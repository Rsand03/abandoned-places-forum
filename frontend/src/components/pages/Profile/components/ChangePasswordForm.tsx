import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useState } from "react";
import emitter from "../../../../emitter/eventEmitter";
import { useToast } from "../../../../hooks/use-toast";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Error!",
        description: "Please fill in all fields.",
      });
      return;
    }

    try {
      emitter.emit("startLoading");

      const userToken = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");

      if (!userToken || !userId) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(
        `${apiUrl}/api/profile/${userId}/updatePassword`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      toast({
        title: "Success!",
        description: "Password updated successfully.",
      });
    } catch (error) {
      if (error instanceof Error && "message" in error) {
        toast({
          title: "Error!",
          description: error.message || "An unknown error occurred.",
        });
      } else {
        toast({
          title: "Error!",
          description: "An unknown error occurred.",
        });
      }
    } finally {
      emitter.emit("stopLoading");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Change your password here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="current">Current password</Label>
          <Input
            id="current"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new">New password</Label>
          <Input
            id="new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdatePassword}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Save password
        </Button>
      </CardFooter>
    </Card>
  );
}

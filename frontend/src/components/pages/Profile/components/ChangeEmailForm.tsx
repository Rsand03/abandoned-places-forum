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
import emitter from "../../../../emitter/eventEmitter";
import { useState } from "react";
import { useToast } from "../../../../hooks/use-toast";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ChangeEmailForm() {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleUpdateEmail = async () => {
    if (!newEmail || !password) {
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
        `${apiUrl}/api/profile/${userId}/updateEmail`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newEmail: newEmail, password: password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      toast({
        title: "Success!",
        description: "Email updated successfully.",
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
        <CardTitle>Change Email</CardTitle>
        <CardDescription>Change your email here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="current">New email</Label>
          <Input
            id="current"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter your new email"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new">Password</Label>
          <Input
            id="new"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdateEmail}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Update email
        </Button>
      </CardFooter>
    </Card>
  );
}

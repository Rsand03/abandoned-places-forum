import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../../../ui/avatar";
import { Separator } from "../../../ui/separator";
import { useEffect, useState } from "react";
import emitter from "../../../../emitter/eventEmitter";
import { Badge } from "../../../ui/badge";
import { useToast } from "../../../../hooks/use-toast";
import UsersPostList from "./UsersPostList";

interface UserProfile {
  username: string;
  email: string;
  points: number;
  role: string;
}

export default function ProfileCard() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        emitter.emit("startLoading");
        const userToken = localStorage.getItem("userToken");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        setUserData(data);
      } catch (error) {
        if (error instanceof Error && "code" in error) {
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

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return;
  }
  return (
    <>
      <Card className="shadow-md border border-slate-200 rounded-md">
        <CardHeader className="flex flex-col items-center text-center gap-4">
          <Avatar className="w-28 h-28">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={userData.username}
              className="rounded-full border border-slate-300"
            />
            <AvatarFallback className="rounded-full bg-slate-100 text-slate-500">
              {userData.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">
              {userData.username}
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              {userData.email}
            </CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col items-center gap-2 py-4 bg-slate-50">
          <Badge
            variant="default"
            className="text-sm px-4 py-1 bg-blue-600 hover:bg-blue-700"
          >
            Role: {userData.role}
          </Badge>
          <p className="text-lg font-medium text-slate-800">
            Points: {userData.points}
          </p>
        </CardContent>
      </Card>
      <div className="w-full mt-4">
        <UsersPostList />
      </div>
    </>
  );
}

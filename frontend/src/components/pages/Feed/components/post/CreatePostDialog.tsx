import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../../ui/alert-dialog";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Textarea } from "../../../../ui/textarea";
import emitter from "../../../../../emitter/eventEmitter";

const apiUrl = import.meta.env.VITE_API_URL;

export default function CreatePostDialog() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleCreatePost = async (title: string, body: string) => {
    try {
      emitter.emit("startLoading");
      const userToken = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");

      const response = await fetch(`${apiUrl}/api/feed/createPost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, title, body }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      setTitle("");
      setBody("");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      emitter.emit("refreshPostList");
      emitter.emit("stopLoading");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
        className="bg-blue-600 hover:bg-blue-700 w-fit md:w-full"
      >
        Create Post
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Post</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the title and content for your new post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Write your post here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleCreatePost(title, body)}
            >
              Submit
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

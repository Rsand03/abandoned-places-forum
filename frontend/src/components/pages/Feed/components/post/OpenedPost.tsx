import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { FormControl, FormItem, FormField } from "../../../../ui/form";
import { Input } from "../../../../ui/input";
import { SendIcon } from "lucide-react";
import { z } from "zod";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FormProvider,
} from "react-hook-form";
import Comment from "../comment/Comment";
import { zodResolver } from "@hookform/resolvers/zod";
import emitter from "../../../../../emitter/eventEmitter";
import SelectLocation from "./SelectLocation";
import { MapLocation } from "../../../Map/Components/utils.ts";
import AeroPhoto from "./AeroPhoto.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

const CommentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

interface FetchPostsDto {
  id: number;
  title: string;
  body: string;
  locationId: string;
  createdByUsername: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  hasUpvoted: boolean;
  location: MapLocation;
}

interface Upvotes {
  postId: number;
}

interface CommentProps {
  id: number;
  body: string;
  postId: number;
  createdById: string;
  createdByUsername: string;
  createdAt: string;
}

export default function OpenedPost() {
  const { postId } = useParams<{ postId: string }>();
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [post, setPost] = useState<FetchPostsDto | null>(null);
  const [upvotes, setUpvotes] = useState<Upvotes[]>([]);
  const [location, setLocation] = useState<MapLocation | null>(null);
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(CommentSchema),
  });

  const { control, handleSubmit } = methods;

  const endOfCommentsRef = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    try {
      emitter.emit("startLoading");
      const userToken = localStorage.getItem("userToken");

      const response = await fetch(`${apiUrl}/api/feed/${postId}/comments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      emitter.emit("stopLoading");
    }
  };

  const handleAddComment: SubmitHandler<FieldValues> = async (data) => {
    if (data.comment) {
      const newComment = {
        body: data.comment,
        createdByUsername: "User",
        createdAt: new Date().toISOString(),
      };

      try {
        emitter.emit("startLoading");
        const userToken = localStorage.getItem("userToken");
        const userId = localStorage.getItem("userId");

        const response = await fetch(`${apiUrl}/api/feed/${postId}/comments`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: newComment.body,
            postId: postId,
            createdById: userId,
          }),
        });

        if (response.ok) {
          const commentData = await response.json();
          setComments((prevComments) => [...prevComments, commentData]);
          methods.reset({ comment: "" });
        } else {
          console.error("Failed to add comment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        emitter.emit("stopLoading");
      }
    }
  };

  const fetchPostById = async (postId: string): Promise<void> => {
    try {
      emitter.emit("startLoading");

      const userToken = localStorage.getItem("userToken");

      if (!userToken) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(`${apiUrl}/api/feed/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Post not found");
        }
        throw new Error("Failed to fetch post");
      }

      const data: FetchPostsDto = await response.json();
      setPost(data);
      setLocation(data.location)
    } catch (error: any) {
      console.error(error);
    } finally {
      emitter.emit("stopLoading");
    }
  };

  const fetchUpvotes = async (): Promise<void> => {
    try {
      emitter.emit("startLoading");

      const userToken = localStorage.getItem("userToken");

      if (!userToken) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(`${apiUrl}/api/feed/upvotes/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch upvotes");
      }

      const data: Upvotes[] = await response.json();
      setUpvotes(data)
    } catch (error: any) {
      console.error(error);
    } finally {
      emitter.emit("stopLoading");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (postId) {
        await fetchPostById(postId);
      }
    };

    fetchData();
    fetchUpvotes();
    fetchComments();
  }, [postId]);

  return (
    post && (
      <div className="flex justify-center">
        <div className="w-full py-8 gap-y-2 flex flex-col max-w-[1440px] px-4">
          <Card className="w-full">
            <CardHeader className="w-full justify-between items-center flex flex-row">
              <h2 className="text-2xl font-semibold mb-2">
                {post.title || "Post"}
              </h2>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
            </CardHeader>
            <CardContent className="">
              <p className="text-sm text-gray-600 mb-4">
                {post.body || "Loading..."}
              </p>
              <div className="flex flex-row flex-wrap md:flex-nowrap gap-x-2 gap-y-2">
                {location && (
                  <div className="h-[400px] rounded-md overflow-hidden border border-slate-300 w-full md:w-1/2">
                    <SelectLocation locationsDisplayedOnMap={[location]} />
                  </div>
                )}
                {location && (
                  <div className="h-[400px] rounded-md overflow-hidden border border-slate-300 w-full md:w-1/2">
                    <AeroPhoto selectedCoords={[location.lat, location.lon]} />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-start w-full gap-x-2"><p className="text-sm text-slate-700">Upvotes: {upvotes.length}</p></div>
            </CardFooter>
          </Card>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleAddComment)}>
                <div className="flex gap-x-2">
                  <FormField
                    control={control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="Write your comment"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit
                    <SendIcon />
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
          <div className="flex flex-col gap-y-2">
            {comments.length > 0 ? (
              comments
                .slice()
                .reverse()
                .map((comment, index) => (
                  <Comment
                    name={comment.createdByUsername}
                    comment={comment.body}
                    createdAt={comment.createdAt}
                    key={index}
                  />
                ))
            ) : (
              <div className="p-2 text-slate-500 italic">No comments</div>
            )}
            <div ref={endOfCommentsRef} />
          </div>
        </div>
      </div>
    )
  );
}

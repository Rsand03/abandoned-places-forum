import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../ui/alert-dialog";
import { Button } from "../../../../ui/button";
import { MessageCircle, SendIcon } from "lucide-react";
import {
  FormControl,
  FormMessage,
  FormItem,
  FormField,
} from "../../../../ui/form";
import { z } from "zod";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FormProvider,
} from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Input } from "../../../../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import emitter from "../../../../../emitter/eventEmitter";
import CommentsList from "./CommentsList";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { useToast } from "../../../../../hooks/use-toast";

const CommentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

interface CommentsDialogProps {
  postId: number;
}

interface CommentProps {
  createdByUsername: string;
  body: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function CommentsDialog({ postId }: CommentsDialogProps) {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  const methods = useForm({
    resolver: zodResolver(CommentSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const endOfCommentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfCommentsRef.current) {
      endOfCommentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const handleAddComment: SubmitHandler<FieldValues> = async (data) => {
    if (data.comment) {
      const newComment = data.comment;
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
            body: newComment,
            postId: postId,
            createdById: userId,
          }),
        });

        if (response.ok) {
          const commentData = await response.json();
          setComments((prevComments) => [...prevComments, commentData.body]);
          methods.reset({ comment: "" });
          toast({
            title: "Success!",
            description: "Comment added.",
          });
        } else {
          console.error("Failed to add comment");
          const errorData = await response.json();
          toast({
            title: "Error!",
            description: "Unexpected error: " + errorData.message,
          });
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        toast({
          title: "Error!",
          description: "Unexpected error: " + error,
        });
      } finally {
        emitter.emit("refreshCommentList");
        emitter.emit("refreshPostList");
        emitter.emit("stopLoading");
      }
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger
          onClick={() => setShowComments(!showComments)}
          className="border-blue-600 border text-blue-600 hover:border-blue-700 hover:text-blue-700 hover:bg-blue-50 flex px-4 py-2 rounded-sm gap-x-2 text-sm font-medium h-10 items-center"
        >
          Comment
          <MessageCircle className="w-4 h-4" />
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[60vw] bg-slate-50">
          <AlertDialogHeader>
            <div className="w-full flex justify-between">
              <AlertDialogTitle className="text-3xl">Comments</AlertDialogTitle>
              <AlertDialogCancel>
                <XIcon />
              </AlertDialogCancel>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-300">
              <CommentsList postId={postId} />
            </div>
          </AlertDialogHeader>
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
                          autoComplete="off"
                        />
                      </FormControl>
                      {errors.comment && <FormMessage></FormMessage>}
                    </FormItem>
                  )}
                />
                <AlertDialogAction>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit
                    <SendIcon />
                  </Button>
                </AlertDialogAction>
              </div>
            </form>
          </FormProvider>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import emitter from "../../../../../emitter/eventEmitter";
import { useEffect, useState, useRef } from "react";
import Comment from "./Comment";

interface CommentProps {
  id: number;
  body: string;
  postId: number;
  createdById: string;
  createdByUsername: string;
  createdAt: string;
}

interface CommentListProps {
  postId: number;
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function CommentsList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [refresh, setRefresh] = useState(0);

  const endOfCommentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleIncrement = () => setRefresh((prev) => prev + 1);

    emitter.on("refreshCommentList", handleIncrement);

    return () => {
      emitter.off("refreshCommentList", handleIncrement);
    };
  }, [refresh]);

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

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    if (endOfCommentsRef.current) {
      endOfCommentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  return (
    <div className="flex flex-col gap-y-2 h-[40vh] overflow-y-scroll">
      {comments.length > 0 ? (
        comments.map((comment, index) => (
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
  );
}

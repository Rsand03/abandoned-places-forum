import { Card, CardHeader, CardContent } from "../../../../ui/card";
import CommentsDialog from "../comment/CommentsDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import UpvoteButton from "../upvote/UpvoteButton";
import AuthService from "../../../../../auth/AuthService";

interface PostCardProps {
  id: number;
  title: string;
  body: string;
  locationId: string;
  createdBy: string;
  creatadAt: string;
  images?: string[];
  commentCount: number;
  likeCount: number;
  hasUpvoted: boolean;
}

export default function PostCard({
  id,
  title,
  body,
  locationId,
  createdBy,
  creatadAt,
  images = [],
  commentCount,
  likeCount,
  hasUpvoted,
}: PostCardProps) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    AuthService.logout();
  }

  if (!userId) {
    return;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Card className="py-4 px-6 w-full flex flex-col gap-y-8">
        <CardHeader className="p-0 flex flex-row flex-wrap gap-x-4 justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <Avatar className="rounded-full">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="w-14 rounded-full border-slate-300 border"
              />
              <AvatarFallback className="w-14 rounded-full border-slate-300 border">
                CN
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-slate-800">
              {createdBy}
            </h2>
          </div>
          <div className="flex flex-col text-sm text-slate-600 gap-y-2">
            <p>{creatadAt}</p>
            <p>{locationId}</p>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-y-2">
          <h2 className="text-xl text-slate-800 font-semibold">{title}</h2>
          <p className="text-md text-slate-700 font-normal">{body}</p>

          {images.length > 0 && (
            <div className="my-4">
              <h3>Images</h3>
              <div className="flex space-x-4">
                {images.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Post Image ${index}`}
                    className="w-20 h-20 object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <div className="w-full flex flex-row flex-wrap gap-y-4 justify-between gap-x-2 items-center">
          <div className="flex gap-x-4">
            <p className="text-sm text-slate-600 font-normal">
              {" "}
              Likes: {likeCount}
            </p>
            <p className="text-sm text-slate-600 font-normal">
              Comments: {commentCount}
            </p>
          </div>
          <div className="flex gap-x-2">
            <UpvoteButton postId={id} userId={userId} isUpvoted={hasUpvoted} />
            <CommentsDialog postId={id} />
          </div>
        </div>
      </Card>
    </div>
  );
}

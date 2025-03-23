import { Card, CardHeader, CardContent } from "../../../../ui/card";
import CommentsDialog from "../comment/CommentsDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import UpvoteButton from "../upvote/UpvoteButton";
import AuthService from "../../../../../service/AuthService";
import AeroPhoto from "./AeroPhoto.tsx";
import { Link } from "react-router-dom";
import { Button } from "../../../../ui/button.tsx";
import { SubCategory } from "./PostList.tsx";
import { Badge } from "../../../../ui/badge.tsx";

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
  locationName: string;
  lon: number;
  lat: number;
  mainCategoryName: string;
  mainCategoryHex: string;
  subCategories: SubCategory[];
  condition: string;
  status: string;
  additionalInformation: string
}

export default function PostCard({
  id,
  title,
  body,
  createdBy,
  creatadAt,
  images = [],
  commentCount,
  likeCount,
  hasUpvoted,
  locationName,
  lon,
  lat,
  mainCategoryName,
  mainCategoryHex,
  subCategories,
  condition,
  status,
  additionalInformation
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
            <Link to={`/posts/${id}`}>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                See full post
              </Button>
            </Link>
            <p>{creatadAt}</p>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-row gap-y-2 flex-wrap flex gap-x-4">
          <div className="flex flex-col gap-y-4 w-full">
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
          <div className="py-4 border-t border-slate-200 w-full flex flex-row flex-wrap md:flex-nowrap">
            <div className="w-full md:w-1/2 flex flex-col gap-y-4">
              <h3 className="text-xl font-bold text-slate-800">Location Details</h3>
              <div className="flex flex-col gap-y-2">
                <p><strong>Location Name:</strong> {locationName}</p>
                <p><strong>Location Coordinates:</strong> Lat: {lat}, Lon: {lon}</p>
                <p><strong>Main Category:</strong> <Badge style={{ backgroundColor: mainCategoryHex }}>{mainCategoryName}</Badge></p>
                <div>
                  <strong>Sub Categories:</strong>
                  <ul className="list-disc pl-6">
                    {subCategories.map((subCategory, index) => (
                      <li key={index} >
                        <Badge style={{ backgroundColor: subCategory.colorHex }}>{subCategory.name}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
                <p><strong>Condition:</strong> {condition}</p>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Additional Information:</strong> {additionalInformation}</p>
            </div>
          </div>
          {location && (
            <div className="h-[500px] rounded-md overflow-hidden border border-slate-300 w-full md:w-1/2 mt-3 md:mt-0">
              <AeroPhoto selectedCoords={[lat, lon]} />
            </div>
          )}
        </div>
          </div>
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

import { Card } from "../../../../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface CommentProps {
  name: string;
  comment: string;
  createdAt: string;
}

export default function Comment({
  name,
  comment: body,
  createdAt,
}: CommentProps) {
  const formattedDate = new Date(createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <Card className="flex p-2 gap-x-4">
      <div>
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
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
        <p className="text-slate-700 text-sm">{body}</p>
      </div>
      <div className="ml-auto">
        <p className="text-slate-700 text-sm">{formattedDate}</p>
      </div>
    </Card>
  );
}

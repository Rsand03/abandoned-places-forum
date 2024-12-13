import { Card } from "../../../../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface CommentProps {
  name: string;
  comment: string;
}

export default function Comment({ name, comment }: CommentProps) {
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
        <p className="text-slate-700 text-sm">{comment}</p>
      </div>
    </Card>
  );
}

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";

export default function ProfileCard() {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  return (
    <div
      className="flex gap-x-4 items-center hover:cursor-pointer hover:bg-slate-100 rounded-lg p-2 px-4 w-full"
      onClick={() => navigate("/profile")}
    >
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
      <h2 className="text-2xl font-semibold text-slate-800">{username}</h2>
    </div>
  );
}

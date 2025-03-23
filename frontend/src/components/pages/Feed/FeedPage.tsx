import PostList from "./components/post/PostList";
import CreatePost from "./components/post/CreatePost";

export default function FeedPage() {
  return (
    <div className="flex justify-center w-full">
      <div className="max-w-[1440px] flex flex-col md:flex-row w-full justify-center">
        <div className="p-4 w-full gap-y-4 flex flex-col">
          <CreatePost />
          <PostList />
        </div>
      </div>
    </div>
  );
}

import PostList from "./components/post/PostList";
import SideMenu from "./SideMenu";
import CreatePost from "./components/post/CreatePost";

export default function FeedPage() {
  return (
    <div className="flex justify-center w-full">
      <div className="max-w-[1440px] flex flex-col md:flex-row w-full justify-center">
        <SideMenu />
        <div className="p-4 w-full max-w-[800px] gap-y-4 flex flex-col">
          <CreatePost />
          <PostList />
        </div>
      </div>
    </div>
  );
}

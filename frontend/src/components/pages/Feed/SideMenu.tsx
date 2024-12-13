import CreatePostDialog from ".//components/post/CreatePostDialog";
import ProfileCard from "./ProfileCard";

export default function SideMenu() {
  return (
    <aside
      className={`md:w-1/4 md:max-w-xs p-4 bg-slate-50 md:border-r border-slate-300 min-w-[200px] w-full`}
    >
      <nav className="mt-2 gap-y-2 flex items-center gap-x-8 md:flex-col md:items-start justify-between w-full">
        <div className="md:mb-4 w-fit md:w-full">
          <ProfileCard />
        </div>
        <CreatePostDialog />
      </nav>
    </aside>
  );
}

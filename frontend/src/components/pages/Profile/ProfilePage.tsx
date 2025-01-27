import ProfileCard from "./components/ProfileCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import ChangeEmailForm from "./components/ChangeEmailForm";
import ChangePasswordForm from "./components/ChangePasswordForm";

export default function ProfilePage() {
  return (
    <div className="flex justify-center w-full py-8 px-2">
      <div className="max-w-[1440px] flex flex-col w-full justify-center items-center gap-y-4">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <ProfileCard />
          </TabsContent>
          <TabsContent value="email">
            <ChangeEmailForm />
          </TabsContent>
          <TabsContent value="password">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

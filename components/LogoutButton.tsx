"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  return (
    <Button
      onClick={async () => {
        await signOut({
          callbackUrl: "/",
        });
      }}
      type="submit"
      className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none flex items-center gap-2 cursor-pointer"
    >
      <LogOut className="size-5 text-black dark:text-white" />
      <span className="text-dark300_light900 max-lg:hidden">Logout</span>
    </Button>
  );
};

export default LogoutButton;

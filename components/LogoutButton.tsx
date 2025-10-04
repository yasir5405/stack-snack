"use client";
import ROUTES from "@/constants/route";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <button
      onClick={async () => {
        await signOut({ callbackUrl: ROUTES.SIGN_IN });
      }}
      className="border border-light-400 p-3 rounded-full cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

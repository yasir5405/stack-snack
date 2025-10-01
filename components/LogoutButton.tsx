"use client";
import ROUTES from "@/constants/route";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <button
      onClick={async () => {
        await signOut({ callbackUrl: ROUTES.SIGN_IN });
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;

import { signIn } from "next-auth/react";

export async function signInWithCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    return { success: false, error: { message: result.error } };
  }

  return { success: true };
}

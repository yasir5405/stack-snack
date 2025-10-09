"use client";
import AuthForm from "@/components/forms/AuthForm";
import { signInWithCredentials } from "@/lib/client-auth";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignIn;

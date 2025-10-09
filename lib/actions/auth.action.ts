"use server";

import action from "../action";
import { SignUpSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import User, { IUserDoc } from "@/database/user.model";
import bcrypt from "bcryptjs";
import Account from "@/database/account.model";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, email, password, username } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();
  let committed = false;
  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new Error("User already exists");

    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) throw new Error("Username already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = (await User.create([{ username, name, email }], {
      session,
    })) as [IUserDoc];

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    committed = true;

    return { success: true };
  } catch (error) {
    if (!committed) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

"use server";

import Answer, { IAnswerDoc } from "@/database/answer.model";
import action from "../action";
import { AnswerServerSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/route";

export const createAnswer = async (
  params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> => {
  const validationResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { content, questionId } = params;
  const userId = validationResult.session?.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();
  let committed = false;

  try {
    const question = await Question.findById(questionId);

    if (!question) throw new Error("Question not found.");

    const [newAnswer] = await Answer.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      { session: session }
    );

    if (!newAnswer) throw new Error("Failed to create answer.");

    question.answers += 1;
    await question.save({ session });

    await session.commitTransaction();
    committed = true;

    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    if (!committed) await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};

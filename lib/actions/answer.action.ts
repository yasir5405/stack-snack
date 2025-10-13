"use server";

import Answer, { IAnswerDoc } from "@/database/answer.model";
import action from "../action";
import { AnswerServerSchema, GetAnswersSchema } from "../validations";
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

export const getAnswers = async (
  params: GetAnswersParams
): Promise<
  ActionResponse<{
    answers: Answer[];
    isNext: boolean;
    totalAnswers: number;
  }>
> => {
  const validationResult = await action({
    params,
    schema: GetAnswersSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, page = 1, pageSize = 10, filter } = params;

  const skip = (Number(page) - 1) * pageSize;

  const limit = pageSize;

  let sortCriteria = {};

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

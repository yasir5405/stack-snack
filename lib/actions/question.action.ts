"use server";

import {
  ActionResponse,
  ErrorResponse,
  Question as QuestionType,
} from "@/types/global";
import action from "../action";
import { AskQuestionSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<QuestionType>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = params;
  const userId = validationResult.session?.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();
  let committed = false;

  try {
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session }
    );
    if (!question) {
      throw new Error("Failed to post question.");
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });
    await Question.findByIdAndUpdate(
      question._id,
      {
        $push: { tags: { $each: tagIds } },
      },
      { session }
    );

    await session.commitTransaction();
    committed = true;

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    if (!committed) await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

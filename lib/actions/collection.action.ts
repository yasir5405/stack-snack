"use server";

import { Collection, Question } from "@/database";
import action from "../action";
import handleError from "../handlers/error";
import { CollectionBaseSchema } from "../validations";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/route";

export async function toggleSaveQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = params;
  const userId = validationResult.session?.user.id;

  try {
    const question = await Question.findById(questionId);

    if (!question) throw new Error("Questio not found.");

    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);

      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await Collection.create({
      question: questionId,
      author: userId,
    });

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

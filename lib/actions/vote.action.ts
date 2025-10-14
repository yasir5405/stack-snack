"use server";

import { Answer, Question, Vote } from "@/database";
import action from "../action";
import handleError from "../handlers/error";
import {
  CreateVoteSchema,
  HasVotedSchema,
  UpdateVoteCountSchema,
} from "../validations";
import mongoose, { ClientSession } from "mongoose";

const updateVoteCount = async (
  params: UpdateVoteCountParams,
  session?: ClientSession
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType, change } = params;

  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      {
        $inc: { [voteField]: change },
      },
      { new: true, session: session }
    );

    if (!result) {
      return handleError(
        new Error("Failed to update vote count")
      ) as ErrorResponse;
    }
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const createVote = async (
  params: CreateVoteParams
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType } = params;

  const userId = validationResult.session?.user.id;

  if (!userId) {
    return handleError(new Error("Unauthorized")) as ErrorResponse;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  let committed = false;

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.deleteOne({ _id: existingVote._id }).session(session);

        await updateVoteCount(
          {
            targetId: targetId,
            targetType: targetType,
            voteType: voteType,
            change: -1,
          },
          session
        );
      } else {
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session }
        );
        await updateVoteCount(
          {
            targetId: targetId,
            targetType: targetType,
            voteType: voteType,
            change: 1,
          },
          session
        );
      }
    } else {
      await Vote.create([{ targetId, targetType, voteType, change: 1 }], {
        session,
      });

      await updateVoteCount(
        {
          targetId: targetId,
          targetType: targetType,
          voteType: voteType,
          change: 1,
        },
        session
      );
    }

    await session.commitTransaction();
    committed = true;

    return { success: true };
  } catch (error) {
    if (!committed) await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

export const hasVoted = async (
  params: HasVotedParams
): Promise<ActionResponse<HasVotedResponse>> => {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType } = params;
  const userId = validationResult.session?.user.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });

    if (!vote) {
      return {
        success: false,
        data: { hasdownVoted: false, hasupVoted: false },
      };
    }

    return {
      success: true,
      data: {
        hasupVoted: vote.voteType === "upvote",
        hasdownVoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

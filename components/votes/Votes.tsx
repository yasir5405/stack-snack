"use client";
import { formatNumber } from "@/lib/utils";
import { Session } from "next-auth";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  session: Session | null;
}

const Votes = ({
  downvotes,
  hasupVoted,
  hasdownVoted,
  upvotes,
  session,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userId = session?.user.id;

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast.error("Please login to vote", {
        description: "Only logged in users can vote.",
      });
    }

    setIsLoading(true);

    try {
      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasupVoted ? "added" : "removed"} successfully.`
          : `Downvote ${!hasdownVoted ? "added" : "removed"} successfully.`;

      toast.success(successMessage, {
        description: "Your vote has been recorded.",
      });
    } catch (error) {
      return toast.error("Failed to vote.", {
        description:
          error instanceof Error
            ? error?.message
            : "An error occurred while voting. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5 ">
      <div className="flex-center gap-1.5">
        <Image
          src={hasupVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          height={18}
          width={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900 ">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={hasdownVoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          height={18}
          width={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900 ">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;

"use client";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { Session } from "next-auth";
import Image from "next/image";
import { use, useState } from "react";
import { toast } from "sonner";

const SaveQuestion = ({
  questionId,
  session,
  hasSavedQuestionPromise,
}: {
  questionId: string;
  session: Session | null;
  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}) => {
  const userId = session?.user.id;
  const [isLoading, setIsLoading] = useState(false);

  const { data } = use(hasSavedQuestionPromise);

  const { saved: hasSaved } = data || {};

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId) {
      return toast.error("Unauthorized", {
        description: "You need to be logged in to save a question.",
      });
    }

    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success) throw new Error(error?.message || "Something went wrong.");

      toast.success(
        `Question ${data?.saved ? "saved" : "unsaved"} successsfully`,
        {}
      );
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="Save question"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="Save question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;

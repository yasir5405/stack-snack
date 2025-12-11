import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";

interface QuestionsListProps {
  filter: string;
  query: string;
  page: number;
  pageSize: number;
}

const QuestionsList = async ({
  filter,
  query,
  page,
  pageSize,
}: QuestionsListProps) => {
  const { success, data, error } = await getQuestions({
    filter: filter || "",
    page: page || 1,
    pageSize: pageSize || 10,
    query: query || "",
  });

  const { questions, isNext } = data || {};

  return (
    <>
      <DataRenderer
        data={questions}
        success={success}
        error={error}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default QuestionsList;

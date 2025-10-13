import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";
import Link from "next/link";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Page = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;

  const { success, data, error } = await getQuestions({
    filter: filter || "",
    page: +page || 1,
    pageSize: +pageSize || 10,
    query: query || "",
  });

  const { questions } = data || {};

  // const filteredQuestions = questions.filter((question) => {
  //   const matchesQuery = question.title
  //     .toLowerCase()
  //     .includes(query?.toLowerCase());
  //   const matchesFilter =
  //     filter ||
  //     question.tags.some(
  //       (tag) => tag.name.toLowerCase() === filter.toLowerCase()
  //     );
  //   return matchesQuery && matchesFilter;
  // });

  return (
    <>
      <section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />

      <DataRenderer
        data={questions}
        success={success}
        error={error}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question, idx) => (
              <QuestionCard key={idx} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Page;

import HomeFilter from "@/components/filters/HomeFilter";
import QuestionsList from "@/components/questions/QuestionsList";
import LocalSearch from "@/components/search/LocalSearch";
import QuestionCardSkeleton from "@/components/skeletons/QuestionCardSkeleton";
import { Suspense } from "react";


interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Page = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;

  const parsedPage = Number(page) || 1;
  const parsedPageSize = Number(pageSize) || 10;

  // Create unique key for Suspense boundary
  const questionsKey = `questions-${filter || "all"}-${query || "none"}-${parsedPage}`;

  return (
    <>
      <section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        {/* Ask Question Button */}
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
        {/* Mobile Filter */}
      </section>

      <HomeFilter />

      {/* Suspense boundary with dynamic key to trigger loading on filter change */}
      <Suspense
        key={questionsKey}
        fallback={
          <div className="mt-10 flex w-full flex-col gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <QuestionCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <QuestionsList
          filter={filter || ""}
          query={query || ""}
          page={parsedPage}
          pageSize={parsedPageSize}
        />
      </Suspense>
    </>
  );
};

export default Page;

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { CollectionFilters } from "@/constants/filter";
import ROUTES from "@/constants/route";
import { EMPTY_COLLECTIONS } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Collections = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;

  const { success, data, error } = await getSavedQuestions({
    filter: filter || "",
    page: +page || 1,
    pageSize: +pageSize || 10,
    query: query || "",
  });

  const { collection } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COLLECTION}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={CollectionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <DataRenderer
        data={collection}
        success={success}
        error={error}
        empty={EMPTY_COLLECTIONS}
        render={(collection) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collection.map((collection, idx) => (
              <QuestionCard key={idx} question={collection.question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Collections;

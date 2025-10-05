import LogoutButton from "@/components/LogoutButton";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "How to learn React",
    description: "I want to learn React, can anyone help me?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
    ],
    author: { _id: "1", name: "Yasir Naseem" },
    upvotes: 10,
    answers: 4,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "Best practices for TypeScript in Next.js",
    description:
      "What are some recommended patterns for using TypeScript with Next.js?",
    tags: [
      { _id: "3", name: "TypeScript" },
      { _id: "4", name: "Next.js" },
    ],
    author: { _id: "2", name: "Alex Kim" },
    upvotes: 15,
    answers: 2,
    views: 80,
    createdAt: new Date(),
  },
  {
    _id: "3",
    title: "How to style components in Tailwind CSS",
    description:
      "How do you organize and reuse styles with Tailwind CSS in a React project?",
    tags: [
      { _id: "5", name: "Tailwind CSS" },
      { _id: "1", name: "React" },
    ],
    author: { _id: "3", name: "Priya Singh" },
    upvotes: 7,
    answers: 3,
    views: 60,
    createdAt: new Date(),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Page = async ({ searchParams }: SearchParams) => {
  const { query = "" } = await searchParams;
  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(query?.toLowerCase())
  );
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
      HomeFilter
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
      <LogoutButton />
    </>
  );
};

export default Page;

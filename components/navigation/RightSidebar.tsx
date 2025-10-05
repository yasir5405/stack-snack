import ROUTES from "@/constants/route";
import Image from "next/image";
import Link from "next/link";
import TagCard from "../cards/TagCard";

const RightSidebar = () => {
  const hotQuestions = [
    { _id: "1", title: "How to create a custom hook in React?" },
    {
      _id: "2",
      title: "What is the difference between useEffect and useLayoutEffect?",
    },
    {
      _id: "3",
      title: "How do you optimize performance in a React application?",
    },
    { _id: "4", title: "How to manage global state in React?" },
    { _id: "5", title: "What are React Server Components?" },
  ];

  const popularTags = [
    { _id: "1", name: "react", questions: 100 },
    { _id: "2", name: "typescript", questions: 80 },
    { _id: "3", name: "nextjs", questions: 65 },
    { _id: "4", name: "javascript", questions: 120 },
    { _id: "5", name: "redux", questions: 50 },
    { _id: "6", name: "nodejs", questions: 70 },
  ];

  return (
    <section className="pt-24 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6  overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((item) => (
            <Link
              key={item._id}
              href={ROUTES.PROFILE(item._id)}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{item.title}</p>

              <Image
                src={"/icons/chevron-right.svg"}
                alt="Chevron"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular tags</h3>

        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map(({ _id, name, questions }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;

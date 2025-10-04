import ROUTES from "@/constants/route";
import Image from "next/image";
import Link from "next/link";

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
    </section>
  );
};

export default RightSidebar;

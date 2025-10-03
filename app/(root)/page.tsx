import { authOptions } from "@/auth";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <div className="py-20">
      <h1 className="">Hello</h1>
      <h1 className="h1-bold font-space-grotesk flex">Hello again</h1>
      <h1>{JSON.stringify(session)}</h1>
      <LogoutButton />
    </div>
  );
};

export default Page;

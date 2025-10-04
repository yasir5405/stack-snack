import Link from "next/link";
import NavLinks from "./navbar/NavLinks";
import ROUTES from "@/constants/route";
import { Button } from "../ui/button";
import Image from "next/image";

const LeftSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-24 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-col flex-1 gap-6 mb-4">
        <NavLinks />
      </div>

      <div className="flex flex-col gap-3">
        <Button
          className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
          asChild
        >
          <Link href={ROUTES.SIGN_IN}>
            <Image
              src={"/icons/account.svg"}
              alt="Account"
              height={20}
              width={20}
              className="invert-colors lg:hidden"
            />
            <span className="primary-text-gradient max-lg:hidden">Log In</span>
          </Link>
        </Button>

        <Button
          className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none"
          asChild
        >
          <Link href={ROUTES.SIGN_UP}>
            <Image
              src={"/icons/sign-up.svg"}
              alt="Account"
              height={20}
              width={20}
              className="invert-colors lg:hidden"
            />
            <span className="max-lg:hidden">Sign Up</span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default LeftSidebar;

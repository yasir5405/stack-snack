import Image from "next/image";
import Link from "next/link";
import Theme from "./Theme";
import MobileNavigation from "./MobileNavigation";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          height={23}
          width={23}
          alt="Snack Stack Logo"
        />

        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Stack<span className="text-primary-500">Snack</span>
        </p>
      </Link>

      <p>Global Search</p>

      <div className="flex-between gap-5">
        <Theme />
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;

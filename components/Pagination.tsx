"use client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { formUrlQuery } from "@/lib/url";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Spinner } from "./ui/spinner";

interface Props {
  page: number | undefined | string;
  isNext: boolean;
  containerClasses?: string;
}

const Pagination = ({ page = 1, isNext, containerClasses = "" }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loadingBtn, setLoadingBtn] = useState<"prev" | "next" | null>(null);

  // 🔑 Reset loading when page actually changes
  useEffect(() => {
    setLoadingBtn(null);
  }, [page]);

  const handleNavigation = (type: "prev" | "next") => {
    setLoadingBtn(type);
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const newUrl = formUrlQuery({
      key: "page",
      params: searchParams.toString(),
      value: nextPageNumber.toString(),
    });

    // Wrap router.push in startTransition to trigger NextTopLoader

    router.push(newUrl, { scroll: false });
  };
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-2 mt-5",
        containerClasses
      )}
    >
      {/* Previous page button */}
      {Number(page) > 1 && (
        <Button
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
          onClick={() => handleNavigation("prev")}
          disabled={loadingBtn !== null}
        >
          <span className="body-medium text-dark200_light800">
            {loadingBtn === "prev" ? (
              <div className="flex items-center justify-center gap-1">
                <Spinner />
                Loading…
              </div>
            ) : (
              "Prev"
            )}
          </span>
        </Button>
      )}

      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>

      {/* Next page button */}
      {isNext && (
        <Button
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
          onClick={() => handleNavigation("next")}
          disabled={loadingBtn !== null}
        >
          <span className="body-medium text-dark200_light800">
            {loadingBtn === "next" ? (
              <div className="flex items-center justify-center gap-1">
                <Spinner />
                Loading…
              </div>
            ) : (
              "Next"
            )}
          </span>
        </Button>
      )}
    </div>
  );
};

export default Pagination;

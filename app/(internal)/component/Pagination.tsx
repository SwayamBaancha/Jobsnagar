"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
const Pagination: FC<{
  page: number;
  pages: number;
  changePage: (page: number) => void;
  // changePage: () => void;
}> = ({ page, pages, changePage }: any) => {
  const router = useRouter();
  let middlePagination;

  if (pages <= 5) {
    middlePagination = [...Array(pages)].map((_, idx) => (
      <button
        key={idx + 1}
        onClick={() => changePage(idx + 1)}
        disabled={page === idx + 1}
      >
        {idx + 1}
      </button>
    ));
  } else {
    const startValue = Math.floor((page - 1) / 5) * 5;

    middlePagination = (
      <>
        {[...Array(5)].map((_, idx) => (
          <button
            key={startValue + idx + 1}
            disabled={page === startValue + idx + 1}
            onClick={() => changePage(startValue + idx + 1)}
          >
            {startValue + idx + 1}
          </button>
        ))}

        <button>...</button>
        <button
          onClick={
            // () => changePage(pages)
            () => router.push(`/jobs/${pages}`)
          }
        >
          {pages}
        </button>
      </>
    );

    if (page > 5) {
      if (pages - page >= 5) {
        middlePagination = (
          <>
            <button onClick={() => changePage(1)}>1</button>
            <button>...</button>
            <button onClick={() => changePage(startValue)}>{startValue}</button>
            {[...Array(5)].map((_, idx) => (
              <button
                key={startValue + idx + 1}
                disabled={page === startValue + idx + 1}
                onClick={() => changePage(startValue + idx + 1)}
              >
                {startValue + idx + 1}
              </button>
            ))}

            <button>...</button>
            <button onClick={() => changePage(pages)}>{pages}</button>
          </>
        );
      } else {
        let amountLeft = pages - page + 5;
        middlePagination = (
          <>
            <button onClick={() => changePage(1)}>1</button>
            <button>...</button>
            <button onClick={() => changePage(startValue)}>{startValue}</button>
            {[...Array(amountLeft)].map((_, idx) => (
              <button
                key={startValue + idx + 1}
                disabled={page === startValue + idx + 1}
                style={pages < startValue + idx + 1 ? { display: "none" } : {}}
                onClick={() => changePage(startValue + idx + 1)}
              >
                {startValue + idx + 1}
              </button>
            ))}
          </>
        );
      }
    }
  }

  return (
    pages > 1 && (
      <div className="pagination">
        <button
          className="pagination__prev"
          onClick={() => changePage((page: any) => page - 1)}
          disabled={page === 1}
        >
          &#171;
        </button>
        {middlePagination}
        <button
          className="pagination__next p-0"
          onClick={() => changePage((page: any) => page + 1)}
          disabled={page === pages}
        >
          &#187;
        </button>
      </div>
    )
  );
};

export default Pagination;

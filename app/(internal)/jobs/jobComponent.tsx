"use client";
import { JobComponentProps } from "@/type/type";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Pagination from "../component/Pagination";

const JobComponent: React.FC<JobComponentProps> = ({
  jobData,
  getDataById,
  currPage,
  // handlePageClick,
  total,
  changePage,
  selected,
  setSelected,
}) => {
  const router = useRouter();
console.log('idu', selected);

  return (
    <>
      <div className="border-2 rounded-xl shadow-xl p-6 mb-6">
        {jobData ? jobData.map((item: any) => {
          const timeAgo = formatDistanceToNow(item?.createdAt, {
            addSuffix: true,
          });
          console.log('ida', item._id);
          
          return (
            <div key={item._id}>
         
              <button
                type="button"
                className={`relative shadow-md bg-white text-gray-800 bg-clip-border rounded-xl w-full border mb-4"
              ${
                selected.includes(item._id)
                  ? " text-black bg-blue-300"
                  : "hover:bg-blue-200 hover:text-gray-700"
              }`}
              >
                <div
                  // type="button"
                  className="p-6 flex flex-row"
                  onClick={() => {
                    setSelected(item._id);
                    router.push(
                      `/jobs/job-detail?currentJobId=${item._id}&page=${currPage}`,
                      {
                        shallow: true,
                      }
                    );
                  }}
                >
                  
                  <div className="mt-2">
                    <Image
                      src={item?.organizationId?.logo || '/loader.png' }
                      width={80}
                      height={70}
                      alt="Company Logo"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="">
                    <h3 className="mb-2 text-xl antialiased font-semibold leading-snug tracking-normal">
                      {item?.jobTitle}
                    </h3>
                    <p className="mb-2 text-base antialiased font-semibold leading-snug tracking-normal">
                      {item?.organizationId?.companyName}
                    </p>
                    <p className="font-sans text-sm antialiased leading-snug tracking-normal">
                      {timeAgo}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          );
        }) : <>
          <p>No Jobs Available</p>
        </>}
        <div className="text-center">
          <Pagination page={currPage} pages={total} changePage={changePage} />
        </div>
      </div>
    </>
  );
};

export default JobComponent;

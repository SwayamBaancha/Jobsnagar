"use client";
import axiosInstance from "@/app/axiosInstance";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import JobDetailsComponent from "../jobSlug";
import JobComponent from "../jobComponent";
import { EmployemtType, experienceLevel, salaryRange } from "@/app/constant";
import Example from "@/app/(internal)/component/dropdown/dropdown";
import Datepicker from "react-tailwindcss-datepicker";
import ConfirmJobApplication from "@/app/(internal)/component/popup/jobApplyPopup";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownType,
  JobDetailType,
  JobDetailsComponentProps,
  JobDetailsPageComponentProps,
} from "@/type/type";

const ViewJobs = ({ params }: { params: { currentJobId: string } }) => {
  const [rowData, setRowData] = useState<JobDetailType[]>([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobData, setJobData] = useState<any>([]);
  const [selectedExperience, setSelectedExperience] = useState<DropdownType>();
  const [selectedSalary, setSelectedSalary] = useState<DropdownType>();
  const [selectedEmployment, setSelectedEmployment] = useState<DropdownType>();
  const [getIndustries, setGetIndustries] = useState<DropdownType[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<DropdownType>();
  const [searchData, setSearchData] = useState("");
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const currentJobId: any = searchParams.get("currentJobId");
  // console.log("rescue", page);

  const [currPage, setCurrPage] = useState(page);
  const [selected, setSelected] = useState("");
  const [total, setTotal] = useState(1);
  const [select, setSelect] = useState("");

  // console.log(rowData);

  useEffect(() => {
    // console.log("logging", currentJobId);
    const data = rowData?.find((ele: any) => {
      // console.log("uuu", ele, ele._id, currentJobId);
      // console.log("final", ele._id === currentJobId);
      return ele._id === currentJobId;
    });
    // console.log("qqq", data);

    if (!data) {
      router.push(
        `/jobs/job-detail?currentJobId=${rowData[0]?._id}&page=${currPage}`,
        {
          shallow: true,
        }
      );
    } else {
      router.push(
        `/jobs/job-detail?currentJobId=${currentJobId}&page=${currPage}`,
        {
          shallow: true,
        }
      );
    }
  }, [rowData]);

  useEffect(() => {
    getData();
  }, [
    selectedExperience,
    date,
    searchData,
    selectedSalary,
    selectedEmployment,
    selectedIndustry,
    currPage,
  ]);

  useEffect(() => {
    getDataById();
  }, [currentJobId]);

  useEffect(() => {
    getIndustry();
  }, []);

  const getData = async () => {
    await axiosInstance
      .get("/jobs-posting/stat", {
        params: {
          experienceLevel: selectedExperience?._id,
          fromDate: date.startDate,
          toDate: date.endDate,
          jobTitle: searchData,
          salaryRange: selectedSalary?._id,
          employmentType: selectedEmployment?._id,
          industry: selectedIndustry?._id,
          page: currPage,
        },
      })
      .then((res) => {
        // console.log("jobs", res);
        setRowData(res.data?.data?.data || []);
        setTotal(res.data?.data?.pages);
      })
      .catch((error) => {
        // console.log(error);
        // toast.error(error.response.data.message);
      });
  };

  const handleChange = () => {
    router.back();
  };

  const getIndustry = async () => {
    await axiosInstance
      .get(`/industry`)
      .then((res) => {
        setGetIndustries(res.data);
      })
      .catch((error) => {
        // console.log(error);
        // throw error;
      });
  };

  const handleDateChange = (newDate: any) => {
    setDate(newDate);
  };
console.log('id', select);

  const getDataById = async () => {
    await setSelect(currentJobId);
    currentJobId!=='undefined' && (
    await axiosInstance
      .get(`/jobs-posting/${currentJobId}`)
      .then((res) => {
        setJobData(res.data?.data);
        setJobDescription(res.data?.data?.jobDescription);
      })
      .catch((error) => {
        // console.log(error);
        toast.error(error.response.data.message);
      })
    )
  };

  const closePopup = () => {
    setIsPopUp(!isPopUp);
  };
  const onApply = () => {
    setIsPopUp(true);
    // console.log(isPopUp);
  };

  const onSubmit = async () => {
    await axiosInstance
      .post(`/jobs-applications`, {
        jobId: jobData?._id,
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        closePopup();
      });
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 mt-2">
        {/* <div className="z-20"> */}
        <Example
          options={experienceLevel}
          text={selectedExperience?.data || "Experience Level"}
          selected={selectedExperience}
          setSelected={setSelectedExperience}
        />
        {/* </div> */}
        {/* <div className="z-20"> */}
        <Example
          options={EmployemtType}
          text={selectedEmployment?.data || "Employment Type"}
          selected={selectedEmployment}
          setSelected={setSelectedEmployment}
        />
        {/* </div> */}
        {/* <div className="z-20"> */}
        <Example
          options={salaryRange}
          text={selectedSalary?.data || "Salary Range"}
          selected={selectedSalary}
          setSelected={setSelectedSalary}
        />
        {/* </div>
        <div className="z-20"> */}
        <Example
          options={getIndustries}
          text={selectedIndustry?.data || "Industry"}
          selected={selectedIndustry}
          setSelected={setSelectedIndustry}
        />
        {/* </div> */}
        {/* <div> */}
        <Datepicker
          primaryColor={"fuchsia"}
          value={date}
          onChange={handleDateChange}
          showShortcuts={true}
        />
        {/* </div> */}

        <form className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                />
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  "
              placeholder="Search JobTitle, Company..."
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              required
            />
          </div>
          {/* <button
            type="submit"
            className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button> */}
        </form>
      </div>
      <div className="lg:hidden ml-2" onClick={handleChange}>
        <FontAwesomeIcon icon={faArrowLeft} size="xl" />
      </div>
      <h1 className="main-heading">
        Jobsnagar : Where Passion Meets Profession!
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 mt-4 md:gap-2">
        <div className="hidden lg:block">
          <JobComponent
            jobData={rowData}
            getDataById={setJobId}
            currPage={currPage}
            total={total}
            changePage={setCurrPage}
            selected={select}
            setSelected={setSelect}
          />
        </div>

        <div className="lg:col-span-2">
          <JobDetailsComponent rowData={jobData} onApply={onApply} />
        </div>
        <ConfirmJobApplication
          isOpen={isPopUp}
          closeModal={closePopup}
          body={jobDescription}
          firstButtonText="Submit"
          secondButtonText="Cancel"
          onFirstButtonClick={onSubmit}
          onSecondButtonClick={closePopup}
          checkboxText={
            "I hereby acknowledge that all the information provided in this application, including my resume, cover letter, and portfolio, is true, accurate, and complete to the best of my knowledge."
          }
        />
      </div>
    </>
  );
};

export default ViewJobs;

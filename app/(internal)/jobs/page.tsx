"use client";
import axiosInstance from "@/app/axiosInstance";
import React, { useEffect, useState } from "react";
import JobComponent from "./jobComponent";
import { EmployemtType, experienceLevel, salaryRange } from "@/app/constant";
import Example from "@/app/(internal)/component/dropdown/dropdown";
import Datepicker from "react-tailwindcss-datepicker";
import { useSearchParams } from "next/navigation";
import Sidebar from "../component/Sidebar";
import { toast } from "react-toastify";
import { DateChangeHandler, DropdownType } from "@/type/type";

const JobsPosting = () => {
  const [rowData, setRowData] = useState([]);
  const [jobId, setJobId] = useState("");
  const [selectedExperience, setSelectedExperience] = useState<DropdownType>();
  const [selectedSalary, setSelectedSalary] = useState<DropdownType>();
  const [selectedEmployment, setSelectedEmployment] = useState<DropdownType>();
  const [getIndustries, setGetIndustries] = useState<DropdownType[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<DropdownType>();
  const [searchData, setSearchData] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<{ startDate: string; endDate: string; }>({ startDate: "", endDate: "" });
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const slug = searchParams.get("currentJobId");
  const [selected, setSelected] = useState("");
  const [currPage, setCurrPage] = useState(+page);
  const [total, setTotal] = useState(1);

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
        setRowData(res.data?.data?.data);
        setTotal(res.data?.data?.pages);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    getIndustry();
  }, []);
  const getIndustry = async () => {
    await axiosInstance
      .get(`/industry`)
      .then((res) => {
        setGetIndustries(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDateChange = (newDate:any) => {
    const formattedDate = { startDate: newDate.toISOString(), endDate: "" };
    setDate(formattedDate);
  };

  return (
    <div>
      <h1 className="main-heading">Jobsnagar : Where Passion Meets Profession!</h1>

      {/* <div className="text-right md:hidden mb-3">
        <button className="btn" onClick={() => setIsOpen(true)}>
          Filter
        </button>
        <Sidebar isOpen={isOpen} onClose={!isOpen} />
      </div> */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 md:gap-1 md:mt-2">
        <Example
          options={experienceLevel}
          text={selectedExperience?.data || "Experience Level"}
          selected={selectedExperience}
          setSelected={setSelectedExperience}
        />

        <Example
          options={EmployemtType}
          text={selectedEmployment?.data || "Employment Type"}
          selected={selectedEmployment}
          setSelected={setSelectedEmployment}
        />

        <Example
          options={salaryRange}
          text={selectedSalary?.data || "Salary Range"}
          selected={selectedSalary}
          setSelected={setSelectedSalary}
        />

        <Example
          options={getIndustries}
          text={selectedIndustry?.data || "Industry"}
          selected={selectedIndustry}
          setSelected={setSelectedIndustry}
        />
        <Datepicker
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              placeholder="Search JobTitle, Company..."
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              required
            />
          </div>
        </form>
      </div>

      <JobComponent
        jobData={rowData}
        getDataById={setJobId}
        currPage={currPage}
        total={total}
        changePage={setCurrPage}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};

export default JobsPosting;

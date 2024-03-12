import React from "react";
import { JobDetailsComponentProps } from "@/type/type";
import { salaryRange, experienceLevel, EmployemtType } from "@/app/constant";
import Image from "next/image";

const JobDetailsComponent: React.FC<JobDetailsComponentProps> = ({
  rowData,
  onApply,
}) => {
  const salary = salaryRange.find(
    (item: any) => item._id === rowData?.salaryRange
  );
  const expLevel = experienceLevel.find(
    (item: any) => item._id === rowData?.experienceLevel
  );
  const employmentType = EmployemtType.find(
    (item: any) => item._id === rowData?.employmentType
  );

  return (
    <div className="p-3 relative text-gray-700 shadow-md bg-clip-border rounded-xl w-full border mb-4 bg-blue-100">
      <div className="p-3 relative text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-full border mb-4">
        <div className="flex flex-row items-center justify-center">
          <Image
            src={rowData?.organizationId?.logo || '/loader.png'}
            width={90} 
            height={70}
            alt="Company Logo"
            className="rounded-lg"
          />
          <div className="flex flex-col ml-3">
            <h3 className="job-listing-heading">
              {rowData?.organizationId?.companyName}
            </h3>

            <p className="jobs-listing-info">
              {rowData?.organizationId?.description}
            </p>
          </div>
        </div>
      </div>
      <div className="p-3 relative text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-full border mb-4">
        <button
          className="btn float-right"
          type="button"
          onClick={() => onApply(rowData._id)}
        >
          Apply
        </button>
        <h3 className="jobs-listing-heading">Job Title</h3>
        <p className="jobs-listing-info">{rowData?.jobTitle}</p>
        <h3 className="jobs-listing-heading">Job Description</h3>
        <p className="jobs-listing-info">{rowData?.jobDescription}</p>
        <h3 className="jobs-listing-heading">Required Skills</h3>
        <p className="jobs-listing-info">{rowData?.reqSkills}</p>
        <h3 className="jobs-listing-heading">Required Education</h3>
        <p className="jobs-listing-info">{rowData?.education}</p>
        <h3 className="jobs-listing-heading">Salary</h3>
        <p className="jobs-listing-info">{salary?.data}</p>
        <h3 className="jobs-listing-heading">Employment Type</h3>
        <p className="jobs-listing-info">{employmentType?.data}</p>
        <h3 className="jobs-listing-heading">Experience Level</h3>
        <p className="jobs-listing-info">{expLevel?.data}</p>
        <h3 className="jobs-listing-heading">Benefit</h3>
        <p className="jobs-listing-info">{rowData?.benefit}</p>
        <h3 className="jobs-listing-heading">Vaccancy</h3>
        <p className="jobs-listing-info">{rowData?.vaccancy}</p>
        <h3 className="jobs-listing-heading">Deadline</h3>
        <p className="jobs-listing-info">{rowData?.deadline}</p>
      </div>
    </div>
  );
};

export default JobDetailsComponent;

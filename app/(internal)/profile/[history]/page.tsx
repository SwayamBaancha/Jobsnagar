"use client";
import axiosInstance from "@/app/axiosInstance";
import AgGridComponent from "@/app/(internal)/component/grid";
import React, { useEffect, useState } from "react";
import { ColDef } from "ag-grid-community";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CandidateJobs, gridParams } from "@/type/type";

const CandidateJobHistory = ({ params }: { params: { history: string } }) => {
  const router = useRouter();
  const [jobHistory, SetJobsHistory] = useState<CandidateJobs[]>([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axiosInstance
      .get(`/jobs-applications/candidateJobsHistory`)
      .then((res) => {
        SetJobsHistory(res.data?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };
  console.log(jobHistory);

  const viewJob = (id:string) => {
    router.push(`/jobs/${id}`);
  };

  const columnDefs: ColDef[] = [
    { headerName: "JobTitle", field: `jobId.jobTitle` },
    { headerName: "JobDescription", field: `jobId.jobDescription` },
    { headerName: "Application Status", field: `applicationStatusData` },
    {
      headerName: "Date",
      field: `createdAt`,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },

    {
      headerName: "Action",
      field: "actions",
      cellRenderer: (params: gridParams) => (
        <div>
          <a
            className="ml-3"
            onClick={() => viewJob(params.data._id)}
            title="View"
          >
            <FontAwesomeIcon icon={faEye} />
          </a>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1 className="main-heading mb-8 uppercase">My Jobs</h1>
      <AgGridComponent rowData={jobHistory} columnDefs={columnDefs} />
    </>
  );
};

export default CandidateJobHistory;

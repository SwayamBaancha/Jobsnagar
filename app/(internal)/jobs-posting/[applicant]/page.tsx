"use client";
import axiosInstance from "@/app/axiosInstance";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import AgGridComponent from "@/app/(internal)/component/grid";
import { ColDef } from "ag-grid-community";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { gridMultiParams, gridParams } from "@/type/type";

const ShowApplicant = ({ params }: { params: { applicant: string } }) => {
  const [jobData, setJobData] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [jobId, setJobId] = useState("");
  const [candiData, setCandiData] = useState([]);

  useEffect(() => {
    getData();
  }, [params.applicant]);

  // const getData = async () => {
  //   await axiosInstance
  //     .get("/jobs-posting")
  //     .then((res) => {
  //       setJobData(res.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const getData = async () => {
    await axiosInstance
      .get(`/jobs-applications/applicants/${params.applicant}`)
      .then((res) => {
        setCandiData(res.data?.data);
        
        
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };
  console.log('first', candiData);

  const viewCandidate = async (params: gridMultiParams) => {
    router.push(
      `/jobs-posting/jobs-applicants/${params.data.jobId}/${params.data.candidateId._id}/${params.data._id}`
    );
  };

  const columnDefs: ColDef[] = [
    { headerName: "Applicant", field: `candidateId.email` },
    {
      headerName: "Action",
      field: "actions",
      cellRenderer: (params: gridMultiParams) => (
        <div>
          <button onClick={() => viewCandidate(params)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      ),
    },
  ];

  const router = useRouter();
  return (
    <div>
      <AgGridComponent rowData={candiData} columnDefs={columnDefs} />
    </div>
  );
};

export default ShowApplicant;

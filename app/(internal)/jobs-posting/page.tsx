"use client";
import axiosInstance from "@/app/axiosInstance";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PopupSuccess from "../component/popup/defaultPopup";
import { toast } from "react-toastify";
import AgGridComponent from "@/app/(internal)/component/grid";
import { ColDef } from "ag-grid-community";
import { faTrash, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gridParams } from "@/type/type";

const JobsPosting = () => {
  const [jobData, setJobData] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [jobId, setJobId] = useState("");
  const [candiData, setCandiData] = useState<any>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axiosInstance
      .get("/jobs-posting")
      .then((res) => {
        setJobData(res.data?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };
  async (params: gridParams) => {
    await axiosInstance
      .get(`/jobs-applications/applicants/${params.data._id}`)
      .then((res) => {
        setCandiData(res.data?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };

  const onDeleteClick = async (params: gridParams) => {
    setJobId(params.data._id);
    setIsPopUp(true);
  };

  const onEditClick = async (params: gridParams) => {
    router.push(`/jobs-posting/add-update/${params.data._id}`);
  };

  const onShow = async (params: gridParams) => {
    router.push(`/jobs-posting/${params.data._id}`);
  };

  const confirmDelete = async () => {
    await axiosInstance
      .patch(`/jobs-posting/${jobId}`, {
        status: 3,
      })
      .then((res) => {
        toast.success("Job Successfully Deleted");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsPopUp(false);
      });

    getData();
  };

  const columnDefs: ColDef[] = [
    { headerName: "Job Title", field: "jobTitle" },
    {
      headerName: "Job Posted",
      field: `createdAt`,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      headerName: "Action",
      field: "actions",

      cellRenderer: (params: gridParams) => (
        <div>
          <a onClick={() => onEditClick(params)} title="Edit">
            <FontAwesomeIcon icon={faEdit} />
          </a>

          <a
            className="ml-3"
            onClick={() => onDeleteClick(params)}
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </a>

          <a className="ml-3" onClick={() => onShow(params)} title="View">
            <FontAwesomeIcon icon={faEye} />
          </a>
        </div>
      ),
    },
  ];

  const router = useRouter();
  const createJob = () => {
    router.push(`jobs-posting/add-update`);
  };
  const closePopup = () => {
    setIsPopUp(false);
  };
  return (
    <div>
      <PopupSuccess
        isOpen={isPopUp}
        closeModal={closePopup}
        body="Are you sure you want to delete this job"
        firstButtonText="Delete"
        secondButtonText="Cancel"
        onFirstButtonClick={confirmDelete}
        onSecondButtonClick={closePopup}
      />

      <div className="text-right">
        <button className="btn" onClick={createJob}>
          Post Job
        </button>
      </div>
      <br></br>
      <AgGridComponent rowData={jobData} columnDefs={columnDefs} />
    </div>
  );
};

export default JobsPosting;

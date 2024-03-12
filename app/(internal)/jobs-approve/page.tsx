"use client";
import React, { useState, useEffect } from "react";
import { ColDef } from "ag-grid-community";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import AgGridComponent from "@/app/(internal)/component/grid";
import PopupSuccess from "../component/popup/defaultPopup";
import { faBan, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axiosInstance from "@/app/axiosInstance";

const JobsApproval = () => {
  const [rowData, setRowData] = useState<any>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [enablePopup, setEnablePopup] = useState(false);
  const [rejectPopup, setRejectPopup] = useState(false);
  const router = useRouter();
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    await axiosInstance
      .get("/jobs-posting/status")
      .then((response) => {
        setRowData(response.data?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };

  const columnDefs: ColDef[] = [
    { headerName: "Job Title", field: "jobTitle" },
    { headerName: "Organization", field: "jobId.email" },
    // { headerName: "Posted By", field: "contact" },

    {
      headerName: "Action",
      field: "actions",
      cellRenderer: (params: any) => (
        <div>
          {rowData.map((data: any, index: any) => (
            <div key={index}>
              <button
                className={`bg-red-600 px-2 text-amber-400 rounded-xl
                 ${data.status === 2 ? "opacity-25" : ""}
                `}
                onClick={() => onApprove(data)}
                disabled={data.status === 2}
              >
                APPROVE
              </button>
              <button
                className="ml-3 bg-black text-white px-2 rounded-lg"
                onClick={() => onReject(params)}
              >
                REJECT
              </button>
            </div>
          ))}
        </div>
      ),
    },
  ];
  const onApprove = async (params: any) => {
    setJobId(params.data._id);
    setEnablePopup(true);
  };

  const confirmApprove = async () => {
    await axiosInstance
      .patch(`/jobs-posting/${jobId}`, {
        status: 2,
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setEnablePopup(false);
      });
    getData();
  };

  const onReject = (params: any) => {
    setJobId(params.data._id);
    setRejectPopup(true);
  };

  // const onDeleteClick = async (params: any) => {
  //   console.log(params.data._id);
  //   setJobId(params.data._id);
  //   setPopupOpen(true);
  // };

  //   const chnageStatus = async (params: any) => {
  //     console.log("Status", params.data.status);
  //     setStatus(params.data.status === 1);
  //     console.log("data", params.data.status === 1);
  //     setOrganizationId(params.data._id);
  //     setEnablePopup(true);
  //   };

  const confirmDelete = async () => {
    const del = await axiosInstance
      .patch(`/jobs-posting/${jobId}`, {
        status: 3,
      })
      .then((res) => {
        toast.success(res.data?.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setPopupOpen(false);
        setRejectPopup(false);
      });
    getData();
  };
  //     try {
  //       console.log("tha", status);

  //       status
  //         ? await axiosInstance.patch(`/organizations/${organizationId}`, {
  //             status: 3,
  //           })
  //         : await axiosInstance.patch(`/organizations/${organizationId}`, {
  //             status: 1,
  //           });
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setEnablePopup(false);
  //     }
  //     getData();
  //   };

  const closePopup = () => {
    setPopupOpen(false);
    setEnablePopup(false);
    setRejectPopup(false);
  };

  return (
    <div>
      <h3 className="main-heading my-4">JOBS APPROVAL</h3>
      <PopupSuccess
        isOpen={enablePopup}
        closeModal={closePopup}
        // title="Job Approval"
        body="Do you want to approve this Job ?"
        firstButtonText="Approve"
        secondButtonText="Cancel"
        onFirstButtonClick={confirmApprove}
        onSecondButtonClick={closePopup}
      />
      <PopupSuccess
        isOpen={rejectPopup}
        closeModal={closePopup}
        // title="Reject Approval"
        body="Do you want to disapprove this Job ?"
        firstButtonText="DisApprove"
        secondButtonText="Cancel"
        onFirstButtonClick={confirmDelete}
        onSecondButtonClick={closePopup}
      />
      <div>
        <AgGridComponent rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  );
};

export default JobsApproval;

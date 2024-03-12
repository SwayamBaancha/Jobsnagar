"use client";
import React, { SyntheticEvent, useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import AgGridComponent from "@/app/(internal)/component/grid";
import { ColDef } from "ag-grid-community";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const CreditHistory = () => {
  const [credHis, setCredHis] = useState([]);
  const [credit, setCredit] = useState<any>([]);
  useEffect(() => {
    getCredit();
  }, []);

  const getCredit = async () => {
    await axiosInstance
      .get(`/credits/user/credit`)
      .then((res) => {
        setCredit(res.data?.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    getCreditHis();
  }, []);

  const getCreditHis = async () => {
    await axiosInstance
      .get(`/credit-history/user/history`)
      .then((res) => {
        setCredHis(res.data?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };
  const router = useRouter();
  const columnDefs: ColDef[] = [
    { headerName: "Credits", field: `totalCredit` },
    { headerName: "Credit / Debit", field: `actionData` },
    { headerName: "Amount", field: `amount` },
    { headerName: "Reason", field: `reason` },
    {
      headerName: "Transaction Date",
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
      headerName: "Transaction Time",
      field: `createdAt`,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        // const seconds = date.getSeconds();
        const period = date.getHours() < 12 ? "AM" : "PM";
        return `${hours}:${minutes} ${period}`;
      },
    },
  ];
  const addCredit = async () => {
    router.push(`/credits`);
  };
  return (
    <div>
      <h1 className="main-heading">CREDIT HISTORY</h1>

      <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 mb-4">
        <div className="p-6">
          <FontAwesomeIcon
            icon={faCoins}
            // flip={true}
            size="2xl"
            style={{ color: "#ffd700" }}
          />
          <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            Available Credits
          </h5>

          <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
            <FontAwesomeIcon icon={faIndianRupeeSign} />
            {credit.totalCredit}
          </p>
        </div>

        <div className="p-6 pt-0">
          <button
            className="flex items-center gap-2 px-4 py-2 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20"
            type="button"
            onClick={addCredit}
          >
            Buy Credits
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <AgGridComponent rowData={credHis} columnDefs={columnDefs} />
    </div>
  );
};

export default CreditHistory;

"use client";
import { useEffect, useState } from "react";
import AgGridComponent from "../component/grid";
import { ColDef } from "ag-grid-community";
import axiosInstance from "@/app/axiosInstance";
import { toast } from "react-toastify";
import Image from "next/image";

const MyReferral = () => {
  const [rowData, setRowData] = useState([]);
  const [code, setCode] = useState("");

  useEffect(() => {
    getReferralCode();
    getData();
  }, []);

  const getData = async () => {
    await axiosInstance
      .get("/credit-history/user/refer")
      .then((res) => {
        setRowData(res.data?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };

  const getReferralCode = async () => {
    await axiosInstance
      .get(`/users/myUser`)
      .then((res) => {
        setCode(res.data?.data?.myReferralCode);
      })
      .catch((error) => {
        console.log(error);
        // toast.error(error.response.data.message);
      });
  };

  // const sendMail = async () => {
  //   await axiosInstance
  //     .post(`mailers`, {
  //       email,
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}${code}`;
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (error) {
      toast.error("Unable to copy text: ");
    }
  };

  const columnDefs: ColDef[] = [
    { headerName: "Referred Person Email", field: `referTo.email` },
    { headerName: "Credits Earned", field: `amount` },
    {
      headerName: " Date",
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
      headerName: "Time",
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

    // {
    //   headerName: "Action",
    //   field: "actions",
    //   cellRenderer: (params: any) => (
    //     <div>
    //       <a
    //         className="ml-3"
    //         onClick={() => viewJob(params.data._id)}
    //         title="View"
    //       >
    //         <FontAwesomeIcon icon={faEye} />
    //       </a>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
    <div>
          <h1 className="main-heading">SHARE JOBSNAGAR {"->"} EARN CREDITS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 bg-blue-200 rounded-xl">
        <div className="hidden sm:flex sm:items-center sm:justify-center">
        <Image
              src="/2784130.jpg"
              alt="Referral Image"
            //   className="dark:invert"
              width={350}
              height={350}
            />
        </div>
        <div className="lg:col-span-2">
      <h3 className="text-xl font-semibold mt-4 text-center text-gray-800">
       Earn credits by sharing your personal referral link with others
      </h3>
      <div className="md:mx-2 lg:mx-20 border-2 bg-white rounded-xl shadow-xl md:p-6 p-3 mb-6 mt-4">
        <h3 className="text-xl lg:text-2xl font-semibold text-center my-4 uppercase">
          Copy or share your link
        </h3>
        <h4 className="border border-gray-400 p-2 rounded-md">{`${process.env.NEXT_PUBLIC_BASE_URL}${code}`}</h4>
        <div className="text-right">
          <button type="button" className="btn" onClick={handleCopyClick}>
            Copy
          </button>
        </div>
        {/* <div>
        <h3 className="text-2xl font-semibold text-center my-4 uppercase">
          Invite by email
        </h3>
        <input
          type="email"
          className="input"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="text-right">
          <button type="button" className="btn" onClick={sendMail}>
            Submit
          </button>
        </div>
        </div> */}
        </div>
      </div>
      
        </div>
        </div>
      <h1 className="main-heading mb-6">My Referrals</h1>
      <AgGridComponent rowData={rowData} columnDefs={columnDefs} />
    </>
  );
};

export default MyReferral;

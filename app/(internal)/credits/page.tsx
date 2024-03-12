"use client";
import axiosInstance from "@/app/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CreditType } from "@/type/type";
import CardPlan from "../component/CardPlan";
import Cookies from "universal-cookie";


declare global {
  interface Window {
    Razorpay: any;
  }
}

const Credit = () => {
  const cookies = new Cookies();
const id = cookies.get("loggedInUser");
const token=cookies.get("token")
  const [credit, setCredit] = useState<any>([]);
  useEffect(() => {
    getData();
  }, []);
  const router = useRouter();
  const getData = async () => {
    await axiosInstance
      .get(`/credits/user/credit`)
      .then((res) => {
        setCredit(res.data?.data);
        // toast.success(res.data?.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };
  const addCredit = async () => {
    await axiosInstance
      .patch(`/credits/updateCredit`, {
        action: 1,
      })
      .then((res) => {
        toast.success(res.data?.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };
  
  const Checkout=async(amount:any)=>{
    const createOrder=await axiosInstance.post("/payments",
    { amount}
    ).catch((error)=>{
      console.log(error);
    })
    
    const options = {
      "key": process.env.NEXT_PUBLIC_RAZORPAYKEY!,
      "amount": createOrder?.data?.amount,
      "currency": "INR",
      "name": "JOBSNAGAR",
      "description": "Plans Transaction",
      "image": "/logo.png",
      "order_id": createOrder?.data?.id,
      "callback_url":'http://localhost:3001/payments/verify',
      "prefill": {
          "name": "Swayam",
          "email": "swayam",
          "contact": "9000090000"
      },
      "notes": {
          "address": "Baancha"
      },
      "theme": {
          "color": "#3399cc"
      }
  };

  const rzp1 = new window.Razorpay(options);
  console.log(rzp1)
  rzp1.open()
  

  }
  console.log(credit);
  const renderCreditHistory = () => {
    router.push("/credits/history");
  };
  return (
    <>
      <h1 className="main-heading">CREDITS</h1>
      <div className="text-right">
        <button className="btn" type="button" onClick={renderCreditHistory}>
          History
        </button>
      </div>
      <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 mb-4">
        <div className="p-6">
          <FontAwesomeIcon
            icon={faCoins}
            size="2xl"
            style={{ color: "#ffd700" }}
          />
          <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            Available Credits
          </h5>

          <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
            <FontAwesomeIcon icon={faIndianRupeeSign} />
            {credit?.totalCredit}
            {/* {credit && credit.length > 0 && <p>{credit[0].totalCredit}</p>} */}
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
      <h3 className="main-heading">
        PLANS
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-10">
       <CardPlan amount={1} first="0hlo" second="bello" third="pello" fourth="leloo" fifth="yelloe" checkout={Checkout} />
       <CardPlan amount={1} first="0hlo" second="bello" third="pello" fourth="leloo" fifth="yelloe" checkout={Checkout} />
       <CardPlan amount={1} first="0hlo" second="bello" third="pello" fourth="leloo" fifth="yelloe" checkout={Checkout} />
      </div>
    </>
  );
};

export default Credit;

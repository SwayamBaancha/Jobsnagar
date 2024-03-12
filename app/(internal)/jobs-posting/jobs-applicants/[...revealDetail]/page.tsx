"use client";
import axiosInstance from "@/app/axiosInstance";
import {
  faCalendarDays,
  faEnvelope,
  faLocation,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";
import PopupSuccess from "@/app/(internal)/component/popup/defaultPopup";
import { toast } from "react-toastify";

const RevealApplicantDetail = ({
  params,
}: {
  params: { revealDetail: string };
}) => {
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getJobData();
  }, []);
  console.log("log", params.revealDetail);

  const getJobData = async () => {
    await axiosInstance
      .get(`/jobs-posting/${params.revealDetail[0]}`)
      .then((res) => {
        console.log(res);
        setJobData(res.data?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };
  const componentRef = useRef(null);
  const print = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Swayam",
  });

  const handlePrint = async () => {
    await axiosInstance
      .patch(`/jobs-applications/${params.revealDetail[2]}`, {
        applicationStatus: 4,
      })
      .then((res) => {
        print();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const [data, setData] = useState<any>([]);
  const [workExperience, setWorkExperience] = useState<any>([]);
  const [education, setEducation] = useState<any>([]);
  const [creditSuccess, setCreditSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [jobData, setJobData] = useState<any>([]);

  const getData = async () => {
    await axiosInstance
      .get(`/candidate-profile/getProfile/${params.revealDetail[1]}`)
      .then(async (res) => {
        console.log(res);
        setData(res.data?.data);
        setEducation(res.data?.data?.education);
        setWorkExperience(res.data?.data?.workExperience);
        await axiosInstance.patch(
          `/jobs-applications/${params.revealDetail[2]}`,
          {
            applicationStatus: 2,
          }
        );
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const revealDetail = async () => {
    await axiosInstance
      .patch(`/credits/updateCredit`, {
        action: 2,
      })
      .then(async (res) => {
        console.log(res);
        setCreditSuccess(true);
        await axiosInstance.patch(
          `/jobs-applications/${params.revealDetail[2]}`,
          {
            applicationStatus: 3,
          }
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        onClose();
      });
  };

  const onClose = () => {
    setIsOpen(false);
  };
  const jobDate=new Date(jobData?.createdAt);
  // const date=jobDate?.toISOString();
  console.log('tarik', jobDate);
  
  const router = useRouter();
  return (
    <div className="mx-2">
      <PopupSuccess
        isOpen={isOpen}
        closeModal={onClose}
        body="This will cost you 10 credits. Are you sure you want to proceed."
        firstButtonText="Pay"
        secondButtonText="Cancel"
        onFirstButtonClick={revealDetail}
        onSecondButtonClick={onClose}
      />
      <h3 className="main-heading">
        Job Detail for which Candidate applied
      </h3>
      <div className="border-2 border-indigo-800 p-4 rounded m-3">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <h3 className="font-semibold">Job Title : </h3>
            <p> {jobData?.jobTitle}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold">Job Applied : </h3>

          
              {/* <p> {jobDate}</p> */}
          </div>
          <div className="col-span-2 flex flex-col">
            <h3 className="font-semibold">Job Description : </h3>
            <p> {jobData?.jobDescription}</p>
          </div>
        </div>
        <div className="text-right">
          <button
            className="btn"
            onClick={() => router.push(`/jobs-posting`)}
          >
            View Job Detail
          </button>
        </div>
      </div>
      <h3 className="main-heading">
        Applicant Resume
      </h3>
      <div className="text-right">
        <button
          className="btn"
          onClick={() => setIsOpen(true)}
        >
          Reveal Details
        </button>
      </div>
      <div ref={componentRef}>
        <div>
          <div className="grid grid-cols-4 gap-2 md:grid-cols-3 border-2 border-gray-300 rounded-t-xl bg-gray-800 max-h-16 md:max-h-36">
            <div>
              <div className="md:col-span-1">
                {creditSuccess && (
                  <Image
                    // fill
                    src={`${data? data.profilePic : '/loader.png'}`}
                    alt="Profile Photo"
                    width={60}
                    height={180}
                    className="ml-7 rounded-xl mt-2 border-purple-500 border-2 md:mb-2 md:ml-15"
                    // sizes="{max-width:768px} 60px, {max-width:1200px} 120px"
                  />
                )}{" "}
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 ml-3">
              <div className="font-bold text-lg md:text-4xl uppercase text-white mt-2">
                {data?.name}
              </div>
              <p className="font-bold text-xs md:text-xl text-white">
                {/* {data?.workExperience[0]?.position} */}
              </p>
            </div>
          </div>

          <div className="border border-x rounded-b-xl border-b border-t-0 border-black p-1 md:px-3">
            <div className="flex flex-col mt-3 md:mt-0 mb-2 border border-b">
              <div className="resume-heading">My Contact</div>
              <p className="text-xs md:text-sm">
                <FontAwesomeIcon className="mr-2" icon={faEnvelope} />
                {creditSuccess ? data?.email : "user@jobsnagar.com"}
              </p>
              <p className="text-xs md:text-sm">
                <FontAwesomeIcon className="mr-2" icon={faPhone} />
                {creditSuccess ? data?.contact : "xxxxxxxx98"}
              </p>
              <p className="text-xs md:text-sm">
                <FontAwesomeIcon className="mr-2" icon={faCalendarDays} />
                {creditSuccess ? data?.dob : "01-01-1901"}
              </p>
              <p className="text-xs md:text-sm">
                <FontAwesomeIcon className="mr-2" icon={faLocation} />
                {creditSuccess ? data?.address : "Loc"}
              </p>
            </div>

            <div className="resume-heading">About Me</div>
            <p className="text-xs md:text-sm">{data?.about}</p>
            {workExperience && (
              <div className="resume-heading">Experience</div>
            )}
            {workExperience && workExperience.map((item: any, index: any) => {
              return (
                <div key={index} className="mb-4">
                  {/* <div className="text-xs md:text-sm mb-3"> */}
                  <div className="font-bold flex flex-col text-xs md:text-base">
                    {item.companyName}
                  </div>
                  <div className="text-xs md:text-sm">
                    <div className="flex flex-row">
                      <h3 className="font-bold">Date of Joining : </h3>
                      <p>{item.workStart}</p>
                    </div>
                    <div className="flex flex-row">
                      <h3 className="font-bold">Position : </h3>
                      <p>{item.position}</p>
                    </div>
                    <div className="flex flex-row">
                      <h3 className="font-bold">CTC : </h3>
                      <p>{item.ctc}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="resume-heading">Education</div>
            {education && education.map((item: any, index: any) => {
              return (
                <div key={index} className="mb-4">
                  <h3 className="font-bold flex flex-col text-sm md:text-base">
                    {item.instituteName}
                  </h3>
                  <div className="text-xs md:text-sm">
                    <div className="flex flex-row">
                      <h3 className=" font-bold">From :</h3>
                      <p className="">{item.degreeStart}</p>
                    </div>
                    <div className="flex flex-row">
                      <h3 className=" font-bold">To :</h3>
                      <p className="">{item.degreeEnd}</p>
                    </div>
                    <div className="flex flex-row">
                      <h3 className="font-bold">Marks : </h3>
                      <p className="">{item.marks}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col mt-3 md:mt-0 mb-2">
              <div className="resume-heading">
                Skills / Portfolio / Certification
              </div>
              <div className="flex flex-row text-xs md:text-sm mb-1">
                <h3 className="font-bold">Skills : </h3>
                <p>{data?.skills}</p>
              </div>
              <div className="flex flex-row text-xs md:text-sm mb-1">
                <h3 className="font-bold">Portfolio : </h3>
                <p>{data?.portfolio}</p>
              </div>
              <div className="flex flex-row text-xs md:text-sm mb-1">
                <h3 className="font-bold">Certifications : </h3>
                <p>{data?.certification}</p>
              </div>
            </div>
            <div className="flex flex-col mt-3 md:mt-0 mb-2">
              <div className="resume-heading">Other Details</div>
              <div className="flex flex-row text-xs md:text-sm mb-1">
                <h3 className="font-bold">Religion : </h3>
                <p>{data?.religion}</p>
              </div>
              <div className="flex flex-row text-xs md:text-sm mb-1">
                <h3 className="font-bold">Marital Status : </h3>
                <p>{data?.marital}</p>
              </div>
              <div className="flex flex-row text-xs md:text-sm mb-1">
                <h3 className="font-bold">Gender : </h3>
                <p>{data?.gender}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className="btn"
        onClick={handlePrint}
      >
        Print PDF
      </button>
    </div>
  );
};

export default RevealApplicantDetail;

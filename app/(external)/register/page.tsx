"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/app/axiosInstance";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationDetail } from "@/app/validation";
import { useSearchParams } from "next/navigation";
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
const cookies = new Cookies();

const Register = () => {
  const searchParams = useSearchParams();
  const referralPersonCode = searchParams.get("referralCode") || "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationDetail>({
    resolver: zodResolver(registrationSchema),
  });
  const router = useRouter();
  const [selected, setSelected] = useState({ type: "candidate", role: 2 });
  const [showPswd, setShowPswd] = useState(false);
  const [showConfirmPswd, setShowConfirmPswd] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVertify, setIsVertify] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [contacts, setContacts] = useState("");
  const togglePassword = () => {
    setShowPswd(!showPswd);
  };
  const toggleConfirmPassword = () => {
    setShowConfirmPswd(!showConfirmPswd);
  };
  const candiLogin = () => {
    setSelected({ type: "candidate", role: 2 });
    console.log(selected.role);
  };
  const employerLogin = () => {
    setSelected({ type: "employer", role: 3 });
    console.log(selected.role);
  };

  const handleResendCode = async () => {
    await setIsVertify(false);
    // await handleOtpAuthentication();
    await axiosInstance
      .post("/otp-authentications", {
        contact: contacts,
      })
      .then(async (res) => {
        await setIsVertify(true);
        toast.success("Otp Successfully Sent");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleOtpAuthentication = async () => {
    // setIsVertify(false);
    // console.log(isVertify);

    // const contact = data.contact;
    if (!isVertify) {
      await axiosInstance
        .post("/otp-authentications", {
          contact: contacts,
        })
        .then(async (res) => {
          await setIsVertify(true);
          toast.success("Otp Successfully Sent");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      const enteredOtp = parseInt(otpCode);
      await axiosInstance
        .post("/otp-authentications/validate", {
          contact: contacts,
          otpCode: enteredOtp,
        })
        .then(async (res) => {
          await setIsValidated(true);
          toast.success("Otp Validated Successfully");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };

  const onSubmit: SubmitHandler<RegistrationDetail> = async (data) => {
    if (data.password !== data.confirmPswd) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
    const formData = {
      email: data.email,
      password: data.password,
      role: selected.role,
      contact: data.contact,
      referredPersonCode: data.referralPersonCode,
    };
    await axiosInstance
      .post("/users/signup", formData)
      .then((res) => {
        console.log(res);
        const role = res.data?.data?.firstTimeLogIn?.role;
        cookies.set("token", res.data?.data?.firstTimeLogIn?.access_token);
        cookies.set("role", role);
        cookies.set(
          "loggedInUser",
          res.data?.data?.firstTimeLogIn?.loggedInUser
        );
        if (role === 2) {
          router.push(`/profile/add-update/${res.data?.data?.profileId}`);
        } else if (role === 3) {
          router.push(`/company-profile/${res.data?.data?.profileId}`);
        }
        toast.success("Account Created Successfully");
      })
      .catch((error) => {
        toast.error(
          error.response.data.message
        );
        console.log(error);
      });
  };

  return (
    <div className="h-screen">
      <h1 className="main-heading">REGISTRATION FORM</h1>
      <div className="flex flex-col sm:flex-row ">
        <div className=" lg:w-2/12 "></div>
        <div className="w-full flex flex-row pt-10">
          <div className="hidden sm:block sm:w-8/12 md:w-6/12 pt-40">
          <Image
      src={"https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" || '/loader.png'}
      width={400}
      height={400}
      alt="Picture of the author"
    />
          </div>
          <div className="flex md:flex-row">
            <div className="w-full md:w:11/12 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl md:max-w-lg xl:p-0 ">
              <div className="p-1 md:p-3 space-y-2  sm:space-y-9 sm:p-4">
                <h1 className="text-lg md:text-2xl text-indigo-800 text-center font-bold leading-tight tracking-tight">
                  CREATE ACCOUNT
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 text-center">
                    <div
                      className={`p-1 md:p-4 cursor-pointer border border-indigo-800 mr-1 md:mr-2 rounded-lg ${
                        selected.type === "candidate"
                          ? "bg-indigo-800 text-white"
                          : "hover:bg-indigo-800 hover:text-white"
                      }`}
                      onClick={candiLogin}
                    >
                      <div className="text-md md:text-xl p-1 md:p-2">
                        Candidate
                      </div>
                      <div className="text-xs text-slate-400">
                        I want to discover companies
                      </div>
                    </div>
                    <div
                      className={`p-1 md:p-4 cursor-pointer border border-blue-500 mr-2 rounded-lg ${
                        selected.type === "employer"
                          ? "bg-indigo-800 text-white"
                          : "hover:bg-indigo-800 hover:text-white"
                      }`}
                      onClick={employerLogin}
                    >
                      <div className="text-md md:text-xl p-1 md:p-2">
                        Employer
                      </div>
                      <div className="text-xs text-slate-400">
                        I want to attract amazing talents
                      </div>
                    </div>
                  </div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">
                    Contact*
                  </label>
                  <div className="flex flex-row">
                    <input
                      type="contact"
                      id="contact"
                      placeholder="xxxxxxxx98"
                      {...register("contact")}
                      className="external-field w-1/2"
                      value={contacts}
                      onChange={(e) => setContacts(e.target.value)}
                      // required
                    />
                    {errors.contact && (
                      <p className="text-red-500 italic px-2 py-1 rounded-md self-start">
                        {errors.contact?.message}
                      </p>
                    )}

                    <input
                      type="number"
                      id="otpCode"
                      placeholder="Enter OTP"
                      // {...register("otpCode")}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      disabled={!isVertify}
                      className="external-field w-1/3 ml-3"
                    />

                    <button
                      type="button"
                      className="btn ml-3 mt-1"
                      onClick={handleOtpAuthentication}
                    >
                      {isVertify ? "Verify" : "Send"}
                    </button>
                  </div>
                  {isVertify && (
                    <p
                      // type="button"
                      className="text-xs text-red-500 hover:text-red-300 hover:underline uppercase float-right m-1"
                      onClick={handleResendCode}
                    >
                      Resend Code
                    </p>
                  )}
                  <div>
                    {isValidated && (
                      <>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 ">
                            Email*
                          </label>
                          <input
                            type="text"
                            id="email"
                            className="external-field"
                            placeholder="user@gmail.com"
                            {...register("email")}
                            required
                          />
                          {errors.email && (
                            <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                              {errors.email?.message}
                            </p>
                          )}
                        </div>

                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Password*
                        </label>

                        <div className="relative flex place-content-end">
                          <input
                            type={showPswd ? "text" : "password"}
                            id="password"
                            placeholder="••••••••"
                            {...register("password")}
                            className="external-field"
                            required
                          />
                          <div
                            onClick={togglePassword}
                            className="absolute text-gray-700 bottom-2 right-2"
                          >
                            {showPswd ? (
                              <FontAwesomeIcon icon={faEyeSlash} />
                            ) : (
                              <FontAwesomeIcon icon={faEye} />
                            )}
                          </div>
                        </div>

                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Confirm Password*
                        </label>

                        <div className="relative flex place-content-end">
                          <input
                            type={showConfirmPswd ? "text" : "password"}
                            id="confirmPswd"
                            placeholder="••••••••"
                            {...register("confirmPswd")}
                            className="external-field"
                            required
                          />
                          <div
                            onClick={toggleConfirmPassword}
                            className="absolute text-gray-700 bottom-2 right-2"
                          >
                            {showConfirmPswd ? (
                              <FontAwesomeIcon icon={faEyeSlash} />
                            ) : (
                              <FontAwesomeIcon icon={faEye} />
                            )}
                          </div>
                        </div>

                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Referral Code (optional)
                        </label>
                        <input
                          type="text"
                          defaultValue={referralPersonCode}
                          id="referralPersonCode"
                          placeholder="******"
                          {...register("referralPersonCode")}
                          className="external-field"
                        />
                        {errors.referralPersonCode && (
                          <p className="text-red-500 italic px-2 py-1 rounded-md self-start">
                            {errors.referralPersonCode?.message}
                          </p>
                        )}
                        <button
                          type="submit"
                          className="w-full text-white bg-indigo-800 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                          Sign Up
                        </button>
                      </>
                    )}

                    <Link
                      href="/login"
                      className="hover:text-red-400 m-2 text-xs text-center"
                    >
                      Already a User. Please Sign in
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-2/12"></div>
      </div>
    </div>
  );
};

export default Register;

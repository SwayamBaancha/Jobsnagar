"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import Link from "next/link";
import { LoginDetail, loginSchema } from "@/app/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import axiosInstance from "@/app/axiosInstance";
import Image from "next/image";
const cookies = new Cookies();

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDetail>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const [showPswd, setShowPswd] = useState(false);
  const togglePassword = () => {
    setShowPswd(!showPswd);
  };

  const onSubmit: SubmitHandler<LoginDetail> = async (data) => {
    const formData = {
      email: data.email,
      password: data.password,
    };

    await axiosInstance
      .post("/users/signin", formData)
      .then((res) => {
       console.log(res);
       
        if (res.data.data) {
          const token = res.data.data.access_token;
          const userRole = res.data.data.role;
          const loggedInUserId = res.data.data.loggedInUser;
      
          // const res = NextResponse.json({
          //   message: "Login Successfully",
          //   success: true,
          // });
          cookies.set("token", token);
          cookies.set("role", userRole);
          cookies.set("loggedInUser", loggedInUserId);
          // return res;
          if (userRole === 1) {
            router.push("/jobs-approve");
          } else if (userRole === 2) {
            router.push("/jobs");
          } else if (userRole === 3) {
            router.push("/jobs-posting");
          }
          toast.success("Login Successfully");
        } else {
          return Response.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
          
        }
        const userRole = res.data.data.role
        
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="h-screen">
      <h1 className="main-heading">LOGIN FORM</h1>
      <div className="flex flex-col lg:flex-row ">
        <div className=" md:w-1/12 lg:w-2/12 "></div>

        <div className="w-full flex flex-row pt-32 ">
          <div className="hidden sm:block sm:w-6/12 sm:pt-10">
            {/* <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full"
              alt="Phone image"
            /> */}
             <Image
      src={"https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" || '/loader.png'} 
      width={400}
      height={400}
      alt="Picture of the author"
    />
          </div>
          <div className="flex flex-row">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
              <div className="p-6 space-y-4 lg:space-y-6 sm:p-8">
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-indigo-800 md:text-2xl">
                  Sign in to your account
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">
                      Your Email*
                    </label>
                    <input
                      type="text"
                      id="email"
                      className="external-field"
                      // bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                      placeholder="user@example.com"
                      {...register("email")}
                      required
                    />
                    {errors.email && (
                      <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                  <div>
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

                    {errors.email && (
                      <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                        {errors.password?.message}
                      </p>
                    )}
                  </div>

                  <Link
                    href="forgotPswd"
                    className="text-xs text-blue-600 hover:underline hover:text-red-400 dark:text-primary-500 "
                  >
                    Forgot Password
                  </Link>

                  <button
                    type="submit"
                    className="w-full text-white bg-indigo-800 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Sign in
                  </button>

                  <Link
                    href="register"
                    className="text-xs text-center hover:underline hover:text-red-400 dark:text-primary-500 mt-8"
                  >
                    Don't have an account. Create One
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/12 lg:w-2/12"></div>
      </div>
    </div>
  );
};

export default Login;

"use client";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Popover, Transition, Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import axiosInstance from "@/app/axiosInstance";
import PopupSuccess from "@/app/(internal)/component/popup/defaultPopup";
import { Profile } from "@/type/type";

const Header = () => {
  const cookies = new Cookies();
  const role1 = cookies.get("role");
  const id = cookies.get("loggedInUser");
  const [role, setRole] = useState("");
  const [notifications, setNotification] = useState([]);
  const [profilePicu, setProfilePic] = useState("");
  const [isPopUp, setIsPopUp] = useState(false);
  const [profile, setProfile] = useState<any>([]);
  const [loggedInUserId, setLoggedInUserId] = useState("");

  useEffect(() => {
    setRole(role1);
    setLoggedInUserId(id);
    getNotification();
    getProfile();
  }, []);

  const router = useRouter();
  const getNotification = async () => {
    await axiosInstance
      .get(`/notifications`)
      .then((res) => {
        setNotification(res.data?.data);
        // toast.success(res.data.message);
      })
      .catch((error) => {
        console.log(error);
        // toast.error(error.response.data.message);
      });
  };

  const updateStatus = async (id: any) => {
    await axiosInstance
      .patch(`/notifications/${id}`, {
        isRead: true,
      })
      .then((res) => {
        console.log(res);
        // toast.success(res.data.message);
        router.push(res.data?.data?.link);
        getNotification()
      })
      .catch((error) => {
        // toast.error(error.response.data.message);
        console.log(error);
      });
    return;
  };

  const onLogout = async () => {
    await axios
      .get("/api/users/logout")
      .then((resp) => {
        toast.success("logout successfully");
        router.push("/login");
      })
      .catch((error) => {
        toast.error("Logout Unsuccessful");
        console.log(error);
      });
  };

  const getProfile = async () => {
    if (role1 === 2) {
      await axiosInstance
        .get(`/candidate-profile/getProfileId`)
        .then((res) => {
          setProfile(res.data?.data);
          setProfilePic(res.data?.data?.profilePic);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    } else if (role1 === 3) {
      await axiosInstance
        .get(`/organization-profiles/getProfileId`)
        .then((res) => {
          setProfile(res.data?.data);
          setProfilePic(res.data?.data?.logo);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    } else {
      return;
    }
  };
  // console.log(profilePicu);
console.log(profilePicu, 'img');

  const ProfileRoute = () => {
    console.log("consoling");
    if (role1 === 2 && profile.length > 0) {
      `/profile/add-update/${profile._id}`;
      closePopup();
    } else if (role1 === 3 && profile.length > 0) {
      `/company-profile/${profile._id}`;
      closePopup();
    }
  };
  const hideCredit = async () => {
    if (role1 === 2) {
      await axiosInstance
        .patch(`/candidate-profile/${profile._id}`, {
          hideProfileProgress: true,
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
          closePopup();
        });
    } else if (role1 === 3) {
      await axiosInstance
        .patch(`/organization-profiles/${profile._id}`, {
          hideProfileProgress: true,
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
          closePopup();
        });
    } else {
      return;
    }
    getProfile();
  };

  const closePopup = () => {
    setIsPopUp(false);
  };

  return (
    <div>
      <PopupSuccess
        isOpen={isPopUp}
        closeModal={closePopup}
        body="Are you sure you dont need free credits. It helps you to
        complete your profile and increase your chances to get a
        job."
        firstButtonText="I'm sure"
        secondButtonText="No Add Credit"
        onFirstButtonClick={hideCredit}
        onSecondButtonClick={ProfileRoute}
      />
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Image
                  src="/jobsnagar-logo.png"
                  width={180}
                  height={140}
                  alt="Jobsnagar logo"
                  priority
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    href="/jobs"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Jobs
                  </Link>
                  {/* {role1 == 3 && ( */}
                  <Link
                    href="/jobs-posting"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Post Job
                  </Link>
                  {/* )} */}
                  {/* {role1 == 2 && ( */}
                  {/* <Link
                    href={`/profile/${loggedInUserId}`}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    My Jobs
                  </Link> */}
                  {/* )} */}
                </div>
              </div>
            </div>

            <div className="relative inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3">
                <div>
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`
                ${open ? "text-white" : "text-white/90"}
                relative group inline-flex  items-center rounded-md px-3 py-2 text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                        >
                          <svg
                            className="h-9 w-7 relative"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                            />
                          </svg>
                        </Popover.Button>
                        {notifications.length > 0 && (
                          <div className="absolute bg-red-600 rounded-full text-white text-xs ml-6 top-2 w-1/4 h-1/4 flex justify-center items-center font-bold">
                            {notifications.length}
                          </div>
                        )}
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-4 sm:px-0">
                            <div className="overflow-auto rounded-lg ring-1 ring-black/5">
                              {/* <button className="relative grid gap-4 bg-white p-2 lg:grid-cols-1"> */}
                                {notifications.length > 0 ? (
                                  notifications.map((item: any) => (
                                    <div key={item._id} className="shadow mb-4">
                                      <button
                                    
                                        className="bg-white p-2 relative"
                                        onClick={() => updateStatus(item._id)}
                                      >
                                      
                                          <pre className="text-sm font-semibold text-center ml-1">
                                            {item?.action}
                                          </pre>
                                          <p className="text-xs">
                                            {new Date(
                                              item?.createdAt
                                            ).toLocaleTimeString()}
                                          </p>
                                    
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm">
                                    No New Notifications
                                  </p>
                                )}
                              {/* </button> */}
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </div>
              </div>

              {/* <div className="relative ml-3">
                <div>
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`
                ${open ? "text-white" : "text-white/90"}
                group inline-flex  items-center rounded-md px-3 py-2 text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                        >
                          <Image
                            src={profilePicu}
                            width={32}
                            height={32}
                            alt="Profile Pic"
                          />

                          <ChevronDownIcon
                            className={`${
                              open ? "text-orange-300" : "text-orange-300/70"
                            }
                  ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-orange-300/80`}
                            aria-hidden="true"
                          />
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-none md:max-w-xs -translate-x-1/2 transform px-4 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                              <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-1">
                                {solutions.map((item) => (
                                  <Link
                                    key={item?.name}
                                    onClick={item?.onClick}
                                    href={item?.href}
                                    className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                                  >
                                    <div className="ml-4">
                                      <p className="text-sm font-medium text-gray-900">
                                        {item.name}
                                      </p>
                                  
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </div>
              </div> */}
            </div>

            <div className="text-right">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                    <Image
                      src={profilePicu || '/loader.png'}
                      width={32}
                      height={32}
                      alt="Profile Pic"
                    />
                    <ChevronDownIcon
                      className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={
                              role1 === 2
                                ? `/profile/add-update/${profile._id}`
                                : role1 === 3
                                ? `/company-profile/${profile._id}`
                                : "/"
                            }
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/credits"
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Credits
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/profile/${loggedInUserId}`}
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            My Jobs
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                    {/* <div className=""> */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/my-referral"
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm ml-1`}
                        >
                          Refer a Friend
                        </Link>
                      )}
                    </Menu.Item>
                    {/* </div> */}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onLogout}
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm ml-1`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
      {profile?.hideProfileProgress === false && (
        <div className="mt-1">
          <input
            type="range"
            value={profile?.progress}
            className="w-full sm:w-6/12 md:w-9/12 md:px-4 sm:mx-4"
            readOnly
          />
          <Link
            href={
              role1 === 2
                ? `/profile/add-update/${profile._id}`
                : `/company-profile/${profile._id}`
            }
            className="ml-6 md:ml-0 mr-3 mt-2 select-none font-bold uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-4 rounded-lg bg-indigo-800 hover:bg-indigo-400 text-white shadow-md shadow-blue-900/10 hover:shadow-lg hover:shadow-blue-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            aria-current="page"
          >
            Complete Profile
          </Link>
          <button
            className="mr-3 mt-2 select-none font-bold uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-3 rounded-lg bg-indigo-800 hover:bg-indigo-400 text-white shadow-md shadow-blue-900/10 hover:shadow-lg hover:shadow-blue-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            aria-current="page"
            onClick={() => setIsPopUp(true)}
          >
            Dont need Credit
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;

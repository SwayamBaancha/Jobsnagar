"use client";
import axiosInstance from "@/app/axiosInstance";
import React, { useState, useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyProfileSchema, CompanyDetail } from "@/app/validation";
import { toast } from "react-toastify";
import Example from "@/app/(internal)/component/dropdown/hook-dropdown";
import ImageComponent from "../component/ImageComponent";
import { CompanySize } from "@/app/constant";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Industry, ProfilePict, ComponentProps } from "@/type/type";

const ProfileComponent: React.FC<ComponentProps> = ({ slug }) => {
  useEffect(() => {
    getCompanyData();
  }, [slug]);

  useEffect(() => {
    getIndustry();
  }, []);
  // const [percent, setCompletionPercent] = useState(0);
  const [industry, setIndustry] = useState<Industry[]>([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [profilePict, setProfilePic] = useState("");
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CompanyDetail>({
    resolver: zodResolver(CompanyProfileSchema),
  });
  const getIndustry = async () => {
    await axiosInstance.get(`/industry`).then((res) => {
      setIndustry(res.data);
    });
  };

  // const updateCompletionPercentage = async (data: any) => {
  //   const totalWeight = Object.keys(data).length;
  //   const filledFieldsCount = Object.values(data).filter(Boolean).length;
  //   const percentage = (filledFieldsCount / totalWeight) * 100;
  //   console.log("progress", totalWeight, filledFieldsCount, percentage);
  //   // await setCompletionPercent(Math.round(percentage));
  //   return percentage;
  // };

  const updateCompletionPercentage = useMemo(
    () => async (data: any) => {
      console.log("dat", data);
      const totalWeight = await Object.keys(data).length;
      const filledFieldsCount = Object.values(data).filter((value) =>
        Boolean(value)
      ).length;
      const percentage = (await (filledFieldsCount / totalWeight)) * 100;
      console.log("progress", totalWeight, filledFieldsCount, percentage);
      return percentage;
    },
    []
  );

  const handleImageSave = (imgUrl: string) => {
    setEditedImageUrl(imgUrl);
    console.log("data", imgUrl);
    setIsPopUp(false);
  };

  const getCompanyData = async () => {
    if (!slug) return;
    const companyData = await axiosInstance.get(
      `/organization-profiles/${slug}`
    );
    const companyDetail = companyData?.data?.data;
    console.log(companyDetail);
    setValue("name", companyDetail.name);
    setValue("contact", companyDetail.contact);
    setValue("email", companyDetail.email);
    setValue("companyName", companyDetail.companyName);
    setValue("selectIndustry", companyDetail.industry);
    setValue("description", companyDetail.description);
    setValue("address", companyDetail.address);
    setValue("city", companyDetail.city);
    setValue("state", companyDetail.state);
    setValue("pincode", companyDetail.pincode);
    setValue("values", companyDetail.values);
    setValue("website", companyDetail.website);
    setValue("twitter", companyDetail.twitter);
    setValue("instagram", companyDetail.instagram);
    setValue("selectSize", companyDetail.size);
    setProfilePic(companyDetail?.logo);
  };
console.log('img', profilePict);

  const onSubmit: SubmitHandler<CompanyDetail> = async (data) => {
    const percent = await updateCompletionPercentage(data);
    console.log(percent);
    const requestData = {
      name: data.name,
      contact: data.contact,
      email: data.email,
      companyName: data.companyName,
      industry: data.selectIndustry,
      address: data.address,
      description: data.description,
      ...(editedImageUrl !== null && { logo: editedImageUrl }),
      // ...(percent !== 0 && { progress: percent }),
      progress: percent,
      values: data.values,
      website: data.website,
      twitter: data.twitter,
      instagram: data.instagram,
      size: data.selectSize,
    };
    if (!slug) {
      await axiosInstance
        .post("/organization-profile", requestData)
        .then((res) => {
          console.log(res);
          toast.success("Profile Created Successfully");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error in Creating Profile");
        });
    } else {
      await axiosInstance
        .patch(`/organization-profiles/${slug}`, requestData)
        .then((res) => {
          console.log(res);
          toast.success("Profile Updated Successfully");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error in Profile Updation");
        });
      getCompanyData();
    }
  };

  return (
    <div>
      <ImageComponent
        isOpen={isPopUp}
        closeModal={() => {
          setIsPopUp(false);
          setEditedImageUrl(null);
        }}
        image={profilePict || '/loader.png'}
        onImgUrlChange={handleImageSave}
      />
      <div className="main-heading my-4">
        COMPANY PROFILE
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="wrappers">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div className="gradient-bg">DETAILS</div>
            <div className="w-1/2 mx-auto block">
              <FontAwesomeIcon
                icon={faPen}
                className="absolute cursor-pointer ml-28 block bg-black text-white rounded-full"
                onClick={() => {
                  setIsPopUp(true);
                }}
              />

              <Image
              
                src={profilePict || '/loader.png'}
                width={120}
                height={100}
                className=" relative border-2 border-gray-300 rounded-xl  p-2"
                alt="Click here to change or update your profile pic"
              />
            </div>
            <div className="input-div">
              <label className="text-black">Name</label>
              <input
                type="text"
                className="input"
                id="name"
                {...register("name")}
                placeholder="Name"
              />
              {errors.name && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.name?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label className="text-black">Contact</label>
              <input
                type="text"
                className="input"
                id="contact"
                {...register("contact")}
                placeholder="Contact"
              />
              {errors.contact && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.contact?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label className="text-black">Email</label>
              <input
                type="email"
                className="input"
                id="email"
                {...register("email")}
                placeholder="Email"
              />
              {errors.email && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label className="text-black">Company Name</label>
              <input
                type="text"
                className="input"
                id="companyName"
                {...register("companyName")}
                placeholder="Company Name"
              />
              {errors.companyName && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.companyName?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label className="text-black">Industry</label>
              <Example
                control={control}
                name="selectIndustry"
                options={industry}
                text={"Select Industry"}
              />
              {errors.selectIndustry && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.selectIndustry?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label className="text-black">Company Size</label>
              <Example
                control={control}
                name="selectSize"
                options={CompanySize}
                text={"Select Size"}
              />
              {errors.selectIndustry && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.selectIndustry?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label className="text-black">Company Address</label>
              <input
                type="text"
                id="address"
                {...register("address")}
                className="input"
                placeholder="Address"
              />
              {errors.address && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.address?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">City</label>
              <input
                type="text"
                id="city"
                readOnly
                {...register("city")}
                className="input"
                placeholder="City"
              />
              {errors.city && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.city?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">State</label>
              <input
                type="text"
                id="state"
                readOnly
                {...register("state")}
                className="input"
                placeholder="State"
              />
              {errors.state && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.state?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label className="text-black">Pincode</label>
              <input
                type="text"
                id="pincode"
                readOnly
                {...register("pincode")}
                className="input"
                placeholder="Pincode"
              />
              {errors.pincode && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.pincode?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label className="text-black">Website</label>
              <input
                type="text"
                id="website"
                {...register("website")}
                className="input"
                placeholder="url"
              />
              {errors.website && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.website?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">Twitter Handle</label>
              <input
                type="text"
                id="twiter"
                {...register("twitter")}
                className="input"
                placeholder="link"
              />
              {errors.twitter && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.twitter?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">Instagram</label>
              <input
                type="text"
                id="instagram"
                {...register("instagram")}
                className="input"
                placeholder="link"
              />
              {errors.instagram && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.instagram?.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="input-div">
              <label className="text-black">Company Description</label>
              <textarea
                id="description"
                {...register("description")}
                className="input"
                placeholder="Description"
              />
              {errors.description && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.description?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">Values</label>
              <textarea
                id="values"
                {...register("values")}
                className="input"
                placeholder="Values"
              />
              {errors.values && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.values?.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="text-right mb-8">
          <button type="submit" className=" btn">
            SUBMIT
          </button>
          <button type="reset" className=" btn">
            RESET
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileComponent;

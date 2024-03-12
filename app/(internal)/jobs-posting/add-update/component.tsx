"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/app/axiosInstance";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobDetail, JobSchema } from "@/app/validation";
import Example from "@/app/(internal)/component/dropdown/hook-dropdown";
import { EmployemtType, experienceLevel, salaryRange } from "@/app/constant";

interface ComponentProps {
  id?: string;
}

const Component: React.FC<ComponentProps> = ({ id }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<JobDetail>({
    resolver: zodResolver(JobSchema),
  });
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, []);

  const getData = async (id: string) => {
    const response = await axiosInstance.get(`/jobs-posting/${id}`);
    const data = response.data?.data;
    console.log("data", data);
    setValue("title", data.jobTitle);
    setValue("jobDescription", data.jobDescription);
    setValue("education", data.education);
    setValue("reqSkills", data.reqSkills);
    // setValue("salaryRange", data.salaryRange);
    setValue("benefit", data.benefit);
    setValue("deadline", data.deadline);
    setValue("vaccancy", data.vaccancy);
    setValue("selectedExperience", data.experienceLevel);
    setValue("selectedEmployment", data.employmentType);
    setValue("selectedSalary", data.salaryRange);
    // setSelectedExperience(data.selectedExperience);
    // setSelectedSalary(data.salary);
    // setSelectedEmployment(data.selectedEmployment);
  };

  const onSubmit: SubmitHandler<JobDetail> = async (data) => {
    const requestData = {
      jobTitle: data.title,
      jobDescription: data.jobDescription,
      education: data.education,
      experienceLevel: data.selectedExperience,
      reqSkills: data.reqSkills,
      employmentType: data.selectedEmployment,
      salaryRange: data.selectedSalary,
      benefit: data.benefit,
      deadline: data.deadline,
      vaccancy: data.vaccancy,
    };
    let response;

    if (id) {
      response = await axiosInstance
        .patch(`/jobs-posting/${id}`, requestData)
        .then((res) => {
          toast.success(res.data?.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      response = await axiosInstance
        .post("/jobs-posting", requestData)
        .then((response) => {
          console.log(response.data);
          toast.success(response.data?.message);
          router.push("/jobs-posting");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <div>
      <div className="main-heading">POST JOB</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="wrappers">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div className="gradient-bg">DETAILS</div>
            <div className="input-div">
              <label className="text-black">Job Title</label>
              <input
                type="text"
                className="input"
                id="title"
                {...register("title")}
                placeholder="Job Title"
              />
              {errors.title && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.title?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label className="text-black">Experience</label>
              <Example
                control={control}
                name="selectedExperience"
                options={experienceLevel}
                text={"Select Experience Level"}
              />
              {errors.selectedExperience && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.selectedExperience?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">Salary</label>
              <Example
                control={control}
                name="selectedSalary"
                options={salaryRange}
                text={"Select Salary"}
              />
              {errors.selectedSalary && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.selectedSalary?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">Employment Type</label>
              <Example
                control={control}
                name="selectedEmployment"
                options={EmployemtType}
                text={"Select Employment Type"}
              />
              {errors.selectedEmployment && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.selectedEmployment?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label className="text-black">Deadline</label>
              <input
                type="date"
                className="input"
                placeholder="Address"
                id="deadline"
                {...register("deadline")}
              />
              {errors.deadline && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.deadline?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">Vacancy</label>
              <input
                type="number"
                className="input"
                placeholder="Vacancy"
                id="vaccancy"
                {...register("vaccancy")}
              />
              {errors.vaccancy && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.vaccancy?.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="input-div">
              <label className="text-black">Job Description</label>
              <textarea
                className="input"
                placeholder="Job Description"
                id="jobDescription"
                {...register("jobDescription")}
              />
              {errors.jobDescription && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.jobDescription?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">Benefits</label>
              <textarea
                className="input"
                placeholder="Benefit"
                id="benefit"
                {...register("benefit")}
              />
              {errors.benefit && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.benefit?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">Essential Qualification</label>
              <textarea
                className="input"
                placeholder="Education"
                id="education"
                {...register("education")}
              />
              {errors.education && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.education?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label className="text-black">Essential Skills</label>
              <textarea
                className="input"
                placeholder="Skills"
                id="reqSkills"
                {...register("reqSkills")}
              />
              {errors.reqSkills && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.reqSkills?.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="text-right mb-5">
          <button type="submit" className=" btn">
            SUBMIT
          </button>
          <button type="reset" className=" btn">
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default Component;

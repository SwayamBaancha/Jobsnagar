"use client";
import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/app/axiosInstance";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateDetail, CandidateProfileSchema } from "@/app/validation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import ReactQuill from "react-quill";
// // import "react-quill/dist/quill.snow.css";
import ImageComponent from "../../component/ImageComponent";
import Image from "next/image";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { ProfileSlug } from "@/type/type";
import axios from "axios";

const ViewProfile: React.FC<ProfileSlug> = ({
  id,
}) => {
  const [isChecked, setChecked] = useState(false);
  const [isPopUp, setIsPopUp] = useState(false);
  const [profilePict, setProfilePic] = useState("");
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [certiUpload, setCertiUpload]=useState<any>([])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<CandidateDetail>({
    resolver: zodResolver(CandidateProfileSchema),
  });
  const {
    fields: workExperiencefields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "workExperience",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  // const {
  //   fields: certificationFields,
  //   append: appendCertification,
  //   remove: removeCertification,
  // } = useFieldArray({
  //   control,
  //   name: "certification",
  // });

  useEffect(() => {
    getCandidateData();
  }, [id]);

  const updateCompletionPercentage = useMemo(
    () => async (data: CandidateDetail) => {
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

  const onSubmit: SubmitHandler<CandidateDetail> = async (data) => {
    console.log(isValid);
    const percent = await updateCompletionPercentage(data);
    console.log(percent);

    const requestData = {
      name: data.name,
      dob: data.dob,
      contact: data.contact,
      email: data.email,
      address: data.address,
      ...(editedImageUrl !== null && { profilePic: editedImageUrl }),
      // ...(percent !== 0 && { progress: percent }),
      progress:percent,
      workExperience: data.workExperience,
      education: data.education,
      skills: data.skills,
      portfolio: data.portfolio,
      // cerification: data.certification,
      gender: data.gender,
      marital: data.marital,
      religion: data.religion,
      about: data.about,
      // certification:data.certification
    };

    if (!id) {
      await axiosInstance
        .post("/candidate-profile", requestData)
        .then((res) => {
          console.log(res);
          toast.success(res.data?.message);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    } else {
      await axiosInstance
        .patch(`/candidate-profile/${id}`, requestData)
        .then((res) => {
          console.log(res);
          toast.success(res.data?.message);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
      getCandidateData();
    }
  };

  const getCandidateData = async () => {
    if (!id) return;
    const candidateData = await axiosInstance.get(`/candidate-profile/${id}`);
    const candidateDetail = candidateData.data?.data;
    setValue("name", candidateDetail.name);
    setValue("dob", candidateDetail.dob);
    setValue("email", candidateDetail.email);
    setValue("contact", candidateDetail.contact);
    setValue("address", candidateDetail.address);
    setValue("city", candidateDetail.city);
    setValue("state", candidateDetail.state);
    setValue("pincode", candidateDetail.pincode);
    setValue("workExperience", candidateDetail.workExperience);
    setValue("education", candidateDetail.education);
    setValue("skills", candidateDetail.skills);
    setValue("portfolio", candidateDetail.portfolio);
    setValue("gender", candidateDetail.gender);
    setValue("marital", candidateDetail.marital);
    setValue("religion", candidateDetail.religion);
    setValue("about", candidateDetail.about);
    setProfilePic(candidateDetail.profilePic);
  };

  const addMultiExperience = () => {
    appendExperience({
      companyName: "",
      position: "",
      ctc: "",
      workStart: "",
      workEnd: "",
      responsibility: "",
    });
  };

  const addMultiEducation = () => {
    appendEducation({
      instituteName: "",
      class: "",
      marks: "",
      degreeStart: "",
      degreeEnd: "",
    });
  };

  // const addMultiCertification = () => {
  //   appendCertification({
  //     certiName: "",
  //     certiYear: "",
  //     // certiUpload: "",
  //     certiDes: "",
  //   });
  // };

  // const uploadCertification = async (data:any) => {
  //     const response = await axiosInstance.patch(`/candidate-profile/${id}`, {certification:data.certification})
  //     .then((res) => {
  //       console.log(res);
  //       toast.success(res.data?.message);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       toast.error(error.response.data.message);
  //     });
  //   getCandidateData();
  // };

//   const onFileChange = async (index:any, event:any) => {
//     const file = event.target.files[0];
//     // const newFiles = [...fields];
//     // newFiles[index].file = file;
//     // append(newFiles);
//     let image: any = await axiosInstance.get("/aws-services").catch((error) => {
//       toast.error(error);
//     });
//     // console.log(image, "img3");

//     const url = image?.data;
//     let link;
// await axios
//         .put(url, file, {
//           headers: {
//             "Content-Type": file.type,
//           },
//         })
//         .then((res) => {
//           // console.log(res);
//           link=res?.data
//           setCertiUpload(link)
//         })
//         .catch((error) => {
//           // console.log(error);
//           toast.error(error);
//         });
//         return link
//   };

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
      <div className="main-heading mb-4">
        CANDIDATE PROFILE
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="wrapper">
            <div className="gradient-bg">PERSONAL DETAILS</div>

            <div className="w-1/2 mx-auto block">
              <FontAwesomeIcon
                icon={faPen}
                className="absolute cursor-pointer ml-28 block bg-black text-white rounded-full"
                onClick={() => {
                  setIsPopUp(true);
                }}
              />

              <Image
                src={profilePict}
                width={120}
                height={100}
                className=" relative border-2 border-gray-300 rounded-xl  p-2"
                alt="Click here to change or update your profile pic"
              />
            </div>

            <div className="input-div">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="input"
                placeholder="Name"
              />
              {errors.name && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.name?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label>D.O.B</label>
              <input
                id="dob"
                type="date"
                // {...register("dob")}
                {...register(
                  "dob"
                  // {
                  //   validate: (value) => {
                  //     const date = new Date(value);
                  //     const isValid =
                  //       !isNaN(date.getTime()) &&
                  //       value === date.toISOString().split("T")[0];
                  //     return (
                  //       isValid || "Invalid date format. Please use yyyy-MM-dd."
                  //     );
                  //   },
                  // }
                )}
                className="input"
              />
              {errors.dob && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.dob?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label>Contact</label>
              <input
                id="contact"
                type="text"
                {...register("contact")}
                readOnly
                className="input"
                placeholder="Contact"
              />
              {errors.contact && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.contact?.message}
                </p>
              )}
            </div>
            <div className="input-div">
              <label>Email</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="input"
                readOnly
                placeholder="Email"
              />
              {errors.email && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="input-div">
              <label>Address</label>
              <input
                id="address"
                {...register("address")}
                type="text"
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
              <label>City</label>
              <input
                id="city"
                type="text"
                {...register("city")}
                readOnly
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
              <label>State</label>
              <input
                id="state"
                type="text"
                {...register("state")}
                readOnly
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
              <label>Pincode</label>
              <input
                id="pincode"
                type="text"
                {...register("pincode")}
                readOnly
                className="input"
                placeholder="Pincode"
              />
              {errors.pincode && (
                <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                  {errors.pincode?.message}
                </p>
              )}
            </div>
          </div>
          <div className="">
            <div className="gradient-bg">ACADEMIC QULAIFICATIONS</div>

            {educationFields.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-row shadow shadow-gray-400 mb-4 p-3"
              >
                <div className="input-div">
                  <label>Name of the Institution</label>
                  <input
                    id="instituteName"
                    type="text"
                    className="input"
                    placeholder="Institute Name"
                    {...register(`education.${index}.instituteName`)}
                  />
                  {/* {errors.instituteName && (
                    <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                      {errors.instituteName?.message}
                    </p>
                  )} */}
                </div>

                <div className="input-div">
                  <label>Class / Degree</label>
                  <input
                    id="class"
                    type="text"
                    // {...register("class")}
                    className="input"
                    placeholder="Class / Degree"
                    {...register(`education.${index}.class`)}
                  />
                  {/* {errors.class && (
                    <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                      {errors.class?.message}
                    </p>
                  )} */}
                </div>

                <div className="input-div">
                  <label>Enter Marks / CGPA / SGPA</label>
                  <input
                    id="marks"
                    type="text"
                    className="input"
                    placeholder="Enter Marks / CGPA / SGPA"
                    {...register(`education.${index}.marks`)}
                  />
                  {/* {errors.marks && (
                    <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                      {errors.marks?.message}
                    </p>
                  )} */}
                </div>
                <div className="input-div">
                  <label>Starting Date</label>
                  <input
                    id="degreeStart"
                    type="date"
                    className="input"
                    {...register(`education.${index}.degreeStart`, {
                      validate: (value) => {
                        const date = new Date(value);
                        const isValid =
                          !isNaN(date.getTime()) &&
                          value === date.toISOString().split("T")[0];
                        return (
                          isValid ||
                          "Invalid date format. Please use yyyy-MM-dd."
                        );
                      },
                    })}
                    // {...register("degreeStart", {
                    //   validate: (value) => {
                    //     const date = new Date(value);
                    //     const isValid =
                    //       !isNaN(date.getTime()) &&
                    //       value === date.toISOString().split("T")[0];
                    //     return (
                    //       isValid ||
                    //       "Invalid date format. Please use yyyy-MM-dd."
                    //     );
                    //   },
                    // })}
                    placeholder="Starting Date"
                  />
                  {/* {errors.education.degreeS && (
                    <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                      {errors.degreeStart?.message}
                    </p>
                  )} */}
                </div>
                <div className="input-div">
                  <label>Ending Date</label>
                  <input
                    id="endDate"
                    type="date"
                    {...register(`education.${index}.degreeEnd`, {
                      validate: (value) => {
                        const date = new Date(value);
                        const isValid =
                          !isNaN(date.getTime()) &&
                          value === date.toISOString().split("T")[0];
                        return (
                          isValid ||
                          "Invalid date format. Please use yyyy-MM-dd."
                        );
                      },
                    })}
                    className="input"
                  />
                  {/* {errors.degreeEnd && (
                    <p className="bg-yellow-100 text-red-500 italic px-2 py-1 rounded-md self-start">
                      {errors.degreeEnd?.message}
                    </p>
                  )} */}
                </div>
                <button type="button" onClick={() => removeEducation(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addMultiEducation}>
              Add More Education
            </button>
            <p className="text-gray-400">Add recent qualification first</p>
          </div>
          <div className="">
            <div className="gradient-bg">WORK EXPERIENCE</div>

            <label>
              <input
                type="checkbox"
                checked={isChecked}
                className="mr-3 mb-4"
                onChange={() => setChecked(!isChecked)}
              />
              Do you have experience
            </label>
            <br></br>
            {isChecked && (
              <button
                type="button"
                onClick={addMultiExperience}
                className="text-center"
              >
                ADD MORE WORK EXPERIENCE
              </button>
            )}
            <p className="text-gray-400">Add recent work experience first</p>
            {workExperiencefields.map((experience, index) => (
              <div
                key={experience.id}
                className="flex flex-row shadow shadow-gray-400 mb-4 p-3"
              >
                <div className="input-div">
                  <label>Company Name</label>
                  <input
                    type="text"
                    className="input"
                    {...register(`workExperience.${index}.companyName`)}
                  />
                </div>
                <div className="input-div">
                  <label>Position</label>
                  <input
                    type="text"
                    className="input"
                    {...register(`workExperience.${index}.position`)}
                  />
                </div>
                <div className="input-div">
                  <label>CTC</label>
                  <input
                    type="text"
                    className="input"
                    {...register(`workExperience.${index}.ctc`)}
                  />
                </div>
                <div className="input-div">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="input"
                    {...register(`workExperience.${index}.workStart`)}
                  />
                </div>
                <div className="input-div">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="input"
                    {...register(`workExperience.${index}.workEnd`)}
                  />
                </div>
                <div className="col-span-3">
                  <label>Responsibilities</label>
                  <textarea
                    className="input"
                    {...register(`workExperience.${index}.responsibility`)}
                  ></textarea>
                </div>
                <button type="button" onClick={() => removeExperience(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>

          {/* </div> */}
          <div className="wrapper">
            <div className="gradient-bg">
              SKILLS / PORTFOLIO
            </div>
        
             <div className="input-div col-span-2">
              <label>Skills</label>
              <textarea
               
                className="input"
                id="skills"
                placeholder="Skills"
                {...register("skills")}
              />
            </div>
            <div className="input-div">
              <label>Portfolio</label>
              <input
                type="text"
                className="input"
                id="portfolio"
                placeholder="link"
                {...register("portfolio")}
              />
            </div>
          </div>


          {/* <div className="wrappers">
            <div className="gradient-bg">
              CERTIFICATIONS
            </div>

            
            <button
                type="button"
                onClick={addMultiCertification}
                className="text-center"
              >
                ADD CERTIFICATION
              </button>
              <p className="text-gray-400">Add your recent certifications first</p>
            {certificationFields.map((certification, index) => (
              <div
                key={certification.id}
                className="flex flex-row shadow shadow-gray-400 mb-4 p-3"
              >
               
               <div className="input-div">
              <label>Certificatie Name</label>
              <input
                type="text"
                className="input"
                id="certiName"
                placeholder="Name"
                {...register(`certification.${index}.certiName`)}
              />
            </div>
            <div className="input-div">
              <label>Year of Certification</label>
              <input
                type="text"
                className="input"
                id="certiYear"
                placeholder="Year"
                {...register(`certification.${index}.certiYear`)}
              />
            </div> */}
            {/* <div className="input-div flex flex-col">
              <label>Upload Certificate</label>
              <input
                type="file"
                id={`certiUpload-${index}`}
                {...register(`certification.${index}.certiUpload`)}
                onChange={(e) => onFileChange(index, e)}
              />
            
            </div> */}
            {/* <div className="input-div grow">
              <label>Description</label>
              <textarea
                className="input"
                id="certiDes"
                placeholder="share your experience with the certification you have got"
                {...register(`certification.${index}.certiDes`)}
              />
            </div>
    
                <button type="button" onClick={() => removeCertification(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
            
            
          </div> */}

          <div className="wrapper">
            <div className="gradient-bg">OTHER DETAILS</div>

            <div className="input-div">
              <label>Gender</label>
              <input
                type="text"
                className="input"
                id="gender"
                placeholder="Gender"
                {...register("gender")}
              />
            </div>
            <div className="input-div">
              <label>Marital Status</label>
              <input
                type="text"
                className="input"
                id="marital"
                placeholder="Marital Status"
                {...register("marital")}
                // value={"Single / Married"}
                // onChange={(e) => setStatus(e.target.value)}
              />
            </div>
            <div className="input-div">
              <label>Religion</label>
              <input
                type="text"
                className="input"
                id="religion"
                placeholder="Religion"
                {...register("religion")}
              />
            </div>
            <div className="input-div col-span-1 md:col-span-3">
              <label>Summary</label>
              <textarea
                className="input"
                id="about"
                rows={4}
                cols={50}
                placeholder="Tell something about yourself to improve your chances to get hired"
                {...register("about")}
              />

              
            </div>
          </div>
          <div className="input-div">
            <input
              type="checkbox"
              {...register("acknowledgeCheckbox")}
              className="mr-4"
            />
            <label>
              Do you acknowledge the data you have submitted is correct
            </label>
            <div className="text-right">
              <button type="submit" className="btn btn:hover">
                SUBMIT
              </button>
              <button type="reset" className="btn btn:hover ml-3">
                CLEAR
              </button>
            </div>
            {errors.acknowledgeCheckbox && (
              <p className="bg-yellow-100 text-red-500 italic p-0 md:px-2 md:py-1 rounded-md self-start">
                {errors.acknowledgeCheckbox.message}
              </p>
            )}
          </div>
        </form>
              
      </div>
    </div>
  );
};

export default ViewProfile;

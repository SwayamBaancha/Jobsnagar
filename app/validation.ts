import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, { message: "Password is required" }),
});

export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPswd: z.string().min(6),
  contact: z.string(),
  referralPersonCode: z.optional(z.string()),
  otpCode: z.optional(z.string()),
});

export const CandidateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be 2 or more characters long" }),
  dob: z.string(),
  contact: z.string(),
  // .min(10, { message: "Phone numbers are a minimum of 10 digits" }),
  email: z.string().email().trim().toLowerCase(),
  address: z
    .string()
    .trim()
    .min(3, { message: "Street must be 5 or more characters long" }),
  state: z
    .string()
    .trim()
    .min(3, { message: "Street must be 5 or more characters long" }),

  city: z.string(),
  // .trim()
  // .min(2, { message: "City must be 2 or more characters long" }),
  pincode: z.string().regex(/^\d{6}?$/, {
    message: "Must be 6 digit zip.",
  }),

  workExperience: z.array(
    z.object({
      companyName: z
        .string()
        .trim()
        .min(5, { message: "Company name must be 5 or more characters long" }),
      position: z.string().trim(),
      ctc: z.string().trim(),
      workStart: z.string(),
      workEnd: z.string(),
      responsibility: z.string(),
    })
  ),
  education: z.array(
    z.object({
      instituteName: z.string().trim().min(2, {
        message: "Institute Name must be 2 or more characters long",
      }),
      class: z.string().trim(),
      // .min(2, { message: "Degree must be 2 or more characters long" }),
      marks: z
        .string()
        .trim()
        .min(2, { message: "Marks must be 2 or more characters long" }),
      degreeStart: z.string(),
      // .datetime({ message: "Invalid datetime string! Must be UTC." }),
      degreeEnd: z.string(),
    })
  ),
  // certification: z.array(
  //   z.object({
  //     certiName: z.string().trim().min(2, {
  //       message: "Certificate Name must be 2 or more characters long",
  //     }),
  //     certiYear: z.string(),
  //     // .min(2, { message: "Degree must be 2 or more characters long" }),
  //     // certiUpload: z.string(),
  //     certiDes: z.optional(z.string()),
     
  //   })
  // ),
  skills: z.string(),
  portfolio: z.string(),
  gender: z.string(),
  marital: z.string(),
  religion: z.string(),
  about: z.string(),
  acknowledgeCheckbox: z.boolean().refine((data) => data === true, {
    message: "Please acknowledge that the data is correct.",
  }),
});

export const CompanyProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be 2 or more characters long" }),

  selectIndustry: z.string(),
  selectSize: z.string(),
  contact: z
    .string()
    .min(10, { message: "Phone numbers are a minimum of 10 digits" }),
  email: z.string().email().trim().toLowerCase(),
  companyName: z
    .string()
    .trim()
    .min(2, { message: "Company Name must be 2 or more characters long" }),

  description: z
    .string()
    .trim()
    .min(2, { message: "Description must be 2 or more characters long" }),
  address: z
    .string()
    .trim()
    .min(3, { message: "Address must be 5 or more characters long" }),
  state: z
    .string()
    .trim()
    .min(3, { message: "State must be 3 or more characters long" }),

  city: z
    .string()
    .trim()
    .min(2, { message: "City must be 2 or more characters long" }),
  pincode: z.string().regex(/^\d{6}?$/, {
    message: "Must be 6 digit zip.",
  }),
  values: z
    .string()
    .trim()
    .min(2, { message: "Values must be 2 or more characters long" }),

  website: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, { message: "URLs must be a minimum of 5 characters" })
    .refine((val) => val.indexOf(".") !== -1, { message: "Invalid URL" }),

  twitter: z
    .string()
    .trim()
    .min(2, { message: "Twitter Handle must be 2 or more characters long" }),

  instagram: z
    .string()
    .trim()
    .min(2, { message: "Insta ID must be 2 or more characters long" }),
});

export const JobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Title must be 2 or more characters long" }),

  jobDescription: z
    .string()
    .trim()
    .min(2, { message: "Description must be 2 or more characters long" }),

  reqSkills: z
    .string()
    .trim()
    .min(2, { message: "Skills must be 2 or more characters long" }),

  education: z
    .string()
    .trim()
    .min(2, { message: "Education must be 2 or more characters long" }),

  selectedExperience: z.string(),

  selectedEmployment: z.string(),

  selectedSalary: z.string(),

  benefit: z
    .string()
    .trim()
    .min(2, { message: "Benefit must be 2 or more characters long" }),

  deadline: z.string(),

  vaccancy: z.string(),
  // .number()
  // .int()
  // .min(1, { message: "Vacancy must be greater than or equal to 1" }),
});

export type LoginDetail = z.infer<typeof loginSchema>;
export type RegistrationDetail = z.infer<typeof registrationSchema>;
export type CandidateDetail = z.infer<typeof CandidateProfileSchema>;
export type CompanyDetail = z.infer<typeof CompanyProfileSchema>;
export type JobDetail = z.infer<typeof JobSchema>;

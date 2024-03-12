export interface Industry {
  _id: string;
  data: string;
}

export interface ProfilePict {
  _id: string;
  data: string;
}

export interface ComponentProps {
  slug?: string;
}

export interface ProfileSlug{
  id?:string
}

export interface Profile {
  _id: string;
  progress: number;
  hideProfileProgress: boolean;
}

export interface DefaultPopup {
  isOpen: boolean;
  closeModal(): void;
  body: string;
  onFirstButtonClick(): void;
  firstButtonText: string;
  onSecondButtonClick(): void;
  secondButtonText: string;
}

export interface JobConfirm {
  isOpen: boolean;
  closeModal(): void;
  body: string;
  checkboxText: string;
  onFirstButtonClick(): void;
  firstButtonText: string;
  onSecondButtonClick(): void;
  secondButtonText: string;
}

export interface Notifications {
  _id: string;
  senderId: string;
  recieverId: string;
  subject: string;
  body: string;
  triggerEmail: boolean;
  triggerWhatsapp: boolean;
  triggerInApp: boolean;
  link: string;
  isEmailSent: boolean;
  isWhatsappSent: boolean;
  type: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  action: string;
  __v: number;
}

export interface ImageComponentType {
  isOpen: boolean;
  closeModal: () => void;
  image: string;
  onImgUrlChange: (imgUrl: string) => void;
  // profilePict: string;
}

export interface Image {
  path: string;
  preview: string;
  lastModified: string;
  lastModifiedDate: string;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

export interface Blob {
  size: number;
  type: string;
}

export interface CreditType {
  _id: string;
  __v: number;
  createdAt: string;
  role: number;
  totalCredit: number;
  updatedAt: string;
  usedCredit: number;
  userId: string;
}

export interface DropdownType {
  _id: string;
  data: string;
}

export interface JobDetailsComponentProps {
  rowData: {
    _id: string;
    jobTitle: string;
    jobDescription: string;
    reqSkills: string;
    salaryRange: string;
    benefit: string;
    vaccancy: string;
    experienceLevel: string;
    employmentType: string;
    deadline: string;
    education: string;
    organizationId: {
      logo: string;
      industry: string;
      companyName: string;
      description: string;
    };
    industry: string;
  };
  onApply: (id: string) => void;
  // _id: string;
}

export interface JobDetailsPageComponentProps {
  jobData: {
    _id: string;
    jobTitle: string;
    jobDescription: string;
    reqSkills: string;
    salaryRange: string;
    benefit: string;
    vaccancy: string;
    experienceLevel: string;
    employmentType: string;
    deadline: string;
    education: string;
    organizationId: {};
    industry: string;
  };
}

export interface JobComponentProps {
  // jobData: {
  //   _id: string;
  //   jobTitle: string;
  //   jobDescription: string;
  //   reqSkills: string;
  //   salaryRange: string;
  //   benefit: string;
  //   vaccancy: string;
  // };
  jobData: any;
  getDataById: (id: string) => void;
  currPage: any;
  // handlePageClick: () => void;
  total: any;
  changePage: any;
  selected: any;
  setSelected: any;
  // select: any;
}

export interface JobDetailType {
  _id: string;
}

export interface CandidateJobs{
  _id:string,
  jobId:string,
  candidateId:string,
  applicationStatus:number,
  applicationStatusData:string,
}

export interface gridParams {
  data : {
    _id:string
  }
}

export interface DateChangeHandler {
  (newDate: Date): void;
}

export interface gridMultiParams {
  data:{
    _id:string,
    jobId:string,
    candidateId:{
      _id:string
    }
  }
}

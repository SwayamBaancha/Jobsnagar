import React from "react";
import ViewProfile from "../component";
import { useReactToPrint } from "react-to-print";

const EditProfile = ({ params }: { params: { id: string } }) => {
  return <ViewProfile id={params.id} />;
};

export default EditProfile;

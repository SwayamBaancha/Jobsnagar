import React from "react";
import ProfileComponent from "../component";

const EditProfile = ({ params }: { params: { slug: string } }) => {
  return <ProfileComponent slug={params.slug} />;
};

export default EditProfile;

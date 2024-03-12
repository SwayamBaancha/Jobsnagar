import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "../../../axiosInstance";

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { email, password } = reqBody;
  const response = await axiosInstance.post("/users/signin", {
    email,
    password,
  });
  console.log("from server", response.data);

  if (response.data.data) {
    const token = response.data.data.access_token;
    const userRole = response.data.data.role;
    const loggedInUserId = response.data.data.loggedInUser;

    const res = NextResponse.json({
      message: "Login Successfully",
      success: true,
    });
    res.cookies.set("token", token);
    res.cookies.set("role", userRole);
    res.cookies.set("loggedInUser", loggedInUserId);
    return res;
  } else {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

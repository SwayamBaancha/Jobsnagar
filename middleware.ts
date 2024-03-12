import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login";
  const token = request.cookies.get("token")?.value || "";
  const role = request.cookies.get("role")?.value || "";

  const rolePermissions: { [key: string]: string[] } = {
    "1": [
      // "/login",
      "/jobs-approve",
    ], //for super user
    "2": [
      "/",
      // "/login",
      "/jobs",
      "/profile",
      "/profile/history",
      "profile/add-update",
    ], //for candidate
    "3": [
      "/",
      "/upload",
      // "/login",
      "/jobs-posting",
      "/jobs-posting/add-update",
      "/company-profile",
      "/jobs",
    ], // for recruiter
  };

  if (token) {
    if (isPublicPath) {
      return NextResponse.redirect(new URL("/jobs", request.nextUrl));
    }

    if (!rolePermissions[role]?.includes(path)) {
      return new Response("You dont have access to this page", { status: 401 });
    }
  } else {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/company-profile",
    "/jobs",
    "/jobs-approve",
    "/jobs-posting",
    "/jobs-posting/add-update",
    "/profile",
    "/user",
    "/user/add-update",
    "/profile/history",
  ],
};

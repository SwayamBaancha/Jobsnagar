import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./component/Header";
import Footer from "./component/Footer";
import Script from "next/script";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Jobsnagar",
  description: "Created By Swayam",
};

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          <Header />
            <Suspense fallback={<Loading />}>
          <div className="md:container md:mx-auto">
            {children}
            </div>
            </Suspense>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
          <ToastContainer />
          <div className="dark">
            <Footer />
          </div>
        </>
      </body>
    </html>
  );
}

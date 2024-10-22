"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import Chat from "@/components/Chat";
import { baseUrl } from "@/config/const";
import ChatBot from "@/components/ChatBot";
import * as jwt from 'jsonwebtoken';

const NegotiatePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "";
  console.log(id);

  const data = {};

  const acceptRoomRequest = async (id: string) => {
    const res: AxiosResponse = await axios.patch(
      `${baseUrl}/localhosts/accept-room-request/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
  };

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      // If available, retrieve the token
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/login?from=negotiate&id=" + id);
      }

      if (token && id) {
        acceptRoomRequest(id);
      }

    }
    
if(typeof localStorage !== "undefined"){
  const token = localStorage.getItem("jwtToken");
  if(token){
    const decodedToken = jwt.decode(token);
    console.log("decodedtoken",decodedToken);

    if(decodedToken){
    // //@ts-ignore
    //   const userRole = decodedToken?.userRole;
    //     //@ts-ignore
    //   const email = decodedToken?.email;
    //     //@ts-ignore
    //   const idd = decodedToken?.id;
    //   const bitId = id
    //   console.log(userRole,email,idd, bitId);

    
  
        const userData = {
          //@ts-ignore
          id: decodedToken?.id,
          name: "",
           //@ts-ignore
          email: decodedToken?.email,
          city: "",
           //@ts-ignore
          userRole: decodedToken?.userRole,
          bitId : id
        };
    
    console.log("Customer_Data111111",userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
    
      // }
      
    }
  }
}
  }, []);

  if (data === undefined) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Loading your order...</h3>
          <p>This won&apos;t take long.</p>
        </div>
      </div>
    );
  }

  if (data === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          {/* <p className="text-base font-medium text-primary">Thank you!</p> */}
          {/* <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Negotiate Page
          </h1> */}
          {/* <Chat /> */}

          <ChatBot />
          {/* < TestChat/> */}

          {/* <p className="mt-2 text-base text-zinc-500">
            A Local Host will be in touch.
          </p> */}

          {/* <div className="mt-14 text-sm font-medium">
            <Link
              href="/"
              className={buttonVariants({
                size: "sm",
                className: "w-full",
              })}
            >
              Book again
            </Link>
          </div> */}
        </div>

        <div className="mt-14">
          {/* <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              BOOK A ROOM through LAST MINUTE LOCAL HOST
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              Please Check all Folders Including Spam folder{" "}
              {"(@amarone.company)"} for The notification from the Last Minute
              Local Host
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <NegotiatePage />
  </Suspense>
);

export default Page;

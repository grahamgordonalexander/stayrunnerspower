"use client";

import React, { useState, useEffect, Suspense } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FileText } from "lucide-react";
import Chat from "@/components/Chat";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { baseUrl } from "@/config/const";
import ChatBot from "@/components/ChatBot";
import TestChat from "@/components/TestChat";


interface Room {
  _id: string;
  localhost: string;
  pic_urls: [string];
  description: string;
  available: boolean;
  payment_option: string;
  min_price_per_night: number;
  city: {
    _id: string;
    city_name: string;
    country: string;
    __v: number;
  };
  room_Amentities: string;
  created_at: string;
  updated_at: string;
  __v: 0;
}

const NegotiatePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const id = searchParams.get("id") || "";
  const token = searchParams.get("token") || "";
  console.log("token===>",token)
  // const [customerData, setcustomerData] = useState();


const getCustomerData = async (token:string) => {
  const res = await axios.get(
    baseUrl+"/user/User-details",
    {
      params:{
        token: token,
      }
    }
  );
  if(res?.data?.customerData && res?.data?.userRole && res?.data?.bitId){
    
    const userData = {
      id: res?.data?.customerData?._id,
      name: res?.data?.customerData?.name,
      email: res?.data?.customerData?.email,
      city: res?.data?.customerData?.city,
      userRole: res?.data?.userRole,
      bitId : res?.data?.bitId
    };

console.log("Customer_Data",userData);
if (typeof window !== "undefined") {
  localStorage.setItem("userData", JSON.stringify(userData));
}

  }
};

useEffect(() => {
  getCustomerData(token);
}), [];
// console.log("rercord==========>", customerdata);

  const data = {};

  const getRooms = async (token: string) => {
    const res = await axios.get(
      baseUrl+"/rooms/rooms-details",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res?.data?.data) {
      setRooms(res.data.data);
    }
  };

  useEffect(() => {
    getRooms(token);
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
    <div className="bg-slate-50 grainy-light">
      {/* <Chat /> */}
{/* < TestChat/> */}
      <ChatBot />
      <MaxWidthWrapper>
        <div className="card-container py-4">
          {rooms?.length > 0 ? (
            rooms.map((item) => (
              <div key={item?._id}>
                <Card>
                  <div>
                    <img
                      src={`${baseUrl}/uploads/${item?.pic_urls[0]}`}
                      alt="room"
                      height={300}
                    />
                  </div>
                  <div>
                    <CardHeader>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FileText className="text-gray-500" size={20} />
                        <CardDescription style={{ marginLeft: "8px" }}>
                          {item?.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex mb-4">
                        <p
                          className={`text-sm ml-2 ${
                            item?.available ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item?.available ? "Available" : "Not Available"}
                        </p>
                      </div>

                      <div className="flex">
                        <p className="text-sm mr-2 text-gray-500">
                          Minimum price per night:
                        </p>
                        <p className="text-sm">{item?.min_price_per_night}</p>
                      </div>
                      <div className="flex">
                        <p className="text-sm mr-2 text-gray-500">
                          Payment Option:
                        </p>
                        <p className="text-sm">{item?.payment_option}</p>
                      </div>
                      <div className="flex">
                        <p className="text-sm mr-2 text-gray-500">City:</p>
                        <p className="text-sm">{item?.city?.city_name}</p>
                      </div>
                      <div className="flex">
                        <p className="text-sm mr-2 text-gray-500">room_Amentities:</p>
                        <p className="text-sm">{item?.room_Amentities}</p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <p>Please Add Room</p>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <NegotiatePage />
  </Suspense>
);

export default Page;

"use client";

import Link from "next/link";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import axios, { AxiosResponse } from "axios";
import { baseUrl } from "@/config/const";

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
  billing: string;
  created_at: string;
  updated_at: string;
  __v: 0;
}

const Page = () => {
  const [myRooms, setMyRooms] = useState<Room[]>([]);

  const getMyRooms = async () => {
    const res = await axios.get(baseUrl+"/rooms", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    if (res?.data?.data) {
      setMyRooms(res.data.data);
    }
  };

  const changeRoomAvailability = async (room_id: string) => {
    await axios.patch(
      `${baseUrl}/localhosts/room-availability/${room_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
  };

  const deleteRoomAPI = async (room_id: string) => {
    await axios.delete(
      `${baseUrl}/localhosts/room/${room_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
  };

  const changeAvailability = async (item: Room) => {
    let rooms: Room[] = myRooms;
    rooms = rooms.map((r) =>
      r._id === item._id ? { ...r, available: !r.available } : r
    );
    await setMyRooms(rooms);
  };

  const deleteRoom = async (item: Room) => {
    let rooms: Room[] = myRooms;
    rooms = rooms.filter((r) => r._id !== item._id);
    await setMyRooms(rooms);
    await deleteRoomAPI(item._id);
  };

  const onCheckedHandle = (item: Room) => {
    changeAvailability(item);
    changeRoomAvailability(item._id);
  };

  useEffect(() => {
    getMyRooms();
  }, []);

  return (
    <div className="bg-slate-50 grainy-light">
      <MaxWidthWrapper>
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            margin: "16px 0px",
          }}
        >
          <div>
            <Link
              href="/localhost/room/add"
              className={buttonVariants({
                size: "sm",
                className: "sm:flex items-center gap-1",
              })}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Room
            </Link>
          </div>
          <div className="ml-4">
            <Link
              href="/localhost/profile"
              style={{ background: "#4b5563" }}
              className={buttonVariants({
                size: "sm",
                variant: "secondary",
                className:
                  "sm:flex items-center gap-1 text-black hover:text-black",
              })}
            >
              Profile
            </Link>
          </div>
        </div>
        <div className="card-container py-4">
          {myRooms?.length > 0 ? (
            myRooms.map((item) => (
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
                        <Switch
                          checked={item?.available}
                          onCheckedChange={() => onCheckedHandle(item)}
                        />
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
                        <p className="text-sm mr-2 text-gray-500">Room Service:</p>
                        <p className="text-sm">{item?.billing}</p>
                      </div>
                      <div className="mt-4">
                        <Link
                          href={"/localhost/room/edit?room_id=" + item?._id}
                        >
                          <Button variant="secondary">Edit</Button>
                        </Link>

                        <Button
                          style={{ marginLeft: "8px" }}
                          variant="destructive"
                          onClick={() => deleteRoom(item)}
                        >
                          Delete
                        </Button>
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

export default Page;

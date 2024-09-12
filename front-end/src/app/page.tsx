"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown, Fullscreen, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  isEmpty,
  isNumber,
  isValidEmail,
  isValidName,
  isValidPrice,
} from "@/utils/validation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/config/const";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { any } from "zod";

interface City {
  _id: string;
  city_name: string;
}

export default function Home() {
  const router = useRouter();

  // const [startDate, setStartDate] = useState<Date | null>(null);

  const [bidData, setBidData] = useState({
    name: "",
    email: "",
    city: "",
    beds: "",
    people: "",
    nights: "",
    price_willing_to_pay: "",
    special_instructions: "",
    checkInDate: null as Date | null,
  });

  const [dataErrors, setDataErrors] = useState({
    name: "",
    email: "",
    city: "",
    beds: "",
    people: "",
    nights: "",
    price_willing_to_pay: "",
    special_instructions: "",
    checkInDate : "",
  });

  const [cities, setCities] = useState<City[]>([]);

  const [loading, setLoading] = useState(false);

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      // const formattedDate = date.toISOString().split("T")[0];
      // const convertDate = new Date(formattedDate.replace(/-/g, "/"));
      setBidData({ ...bidData, checkInDate: date });
    } else {
      setBidData({ ...bidData, checkInDate: null });
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price_willing_to_pay" && !isValidPrice(value) && value !== "")
      return;
    if (
      (name === "beds" || name === "people" || name === "nights") &&
      !isNumber(value) &&
      value !== ""
    )
      return;
    setBidData({ ...bidData, [name]: value });
  };

  const handleClick = async () => {
    setDataErrors(() => {
      return {
        name: "",
        email: "",
        city: "",
        beds: "",
        people: "",
        nights: "",
        price_willing_to_pay: "",
        special_instructions: "",
        checkInDate : "",
      };
    });

    let hasError = false;

    if (!isValidName(bidData?.name)) {
      toast.error("Please enter a valid name");
      setDataErrors(() => {
        return {
          ...dataErrors,
          name: "Please enter a valid name",
        };
      });
      hasError = true;
    } else if (!isValidEmail(bidData?.email)) {
      toast.error("Please enter a valid email");
      setDataErrors(() => {
        return {
          ...dataErrors,
          email: "Please enter a valid email",
        };
      });
      hasError = true;
    } else if (isEmpty(bidData?.city)) {
      toast.error("Please select a city");
      setDataErrors(() => {
        return {
          ...dataErrors,
          city: "Please select a city",
        };
      });
      hasError = true;
    } else if (isEmpty(bidData?.beds)) {
      toast.error("Please enter a valid no of beds");
      setDataErrors(() => {
        return {
          ...dataErrors,
          beds: "Please enter a valid no of beds",
        };
      });
      hasError = true;
    } else if (isEmpty(bidData?.people)) {
      toast.error("Please enter a valid no of people");
      setDataErrors(() => {
        return {
          ...dataErrors,
          people: "Please enter a valid no of people",
        };
      });
      hasError = true;
    }
    else if ((bidData?.checkInDate) === null) {
      toast.error("Please enter a valid Check-in date");
      setDataErrors(() => {
        return {
          ...dataErrors,
          checkInDate: "Please enter a valid Check-in date",
        };
      });
      hasError = true;
    }  
    
    else if (isEmpty(bidData?.nights)) {
      toast.error("Please enter a valid no of nights");
      setDataErrors(() => {
        return {
          ...dataErrors,
          nights: "Please enter a valid no of nights",
        };
      });
      hasError = true;
    } else if (isEmpty(bidData?.price_willing_to_pay)) {
      toast.error("Please enter a valid price");
      setDataErrors(() => {
        return {
          ...dataErrors,
          price_willing_to_pay: "Please enter a valid price",
        };
      });
      hasError = true;
    } else if (isEmpty(bidData?.special_instructions)) {
      toast.error("Please enter special instructions");
      setDataErrors(() => {
        return {
          ...dataErrors,
          special_instructions: "Please enter special instructions",
        };
      });
      hasError = true;
    } else {
      try {
        setLoading(true);
        const res: AxiosResponse = await axios.post(
          baseUrl + "/customers/create-bid",
          bidData
        );
        if (res.status === 201) {
          toast.success("Bid has been created successfully");
          router.push("/order/success");
        }
      } catch (err: any) {
        const errMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message[0]
          : err.response.data.message;
        toast.error(errMsg);
        setLoading(false);
      }
    }
  };

  const getAllCities = async () => {
    const res = await axios.get(baseUrl + "/cities");
    if (res?.data?.data) {
      setCities(res.data.data);
    }
  };

  useEffect(() => {
    getAllCities();
  }, []);



  console.log("test data 1", bidData);
  // console.log("test data 2",startDate);
  return (
    <div className="bg-slate-50 grainy-light">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-1 xl:pt-1 lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-2xl md:text-3xl lg:text-4xl">
                Book a{" "}
                <span className="bg-green-600 px-2 text-white">Room</span>{" "}
                through LAST MINUTE LOCAL HOST
              </h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Get a great deal from a local host that want to fill <br /> their rooms in the last minute.
              </p>

              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    negotiate rate
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />5 year
                    pay on check-in
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    save on your room
                  </li>
                </div>
              </ul>

              <div className="mt-20 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="flex flex-col justify-between items-center md:items-start">
                  <p className="mb-4">Have rooms to sell last minute?</p>
                  <Link
                    href="/localhost/signup"
                    className={buttonVariants({
                      size: "sm",
                      className: "sm:flex items-center gap-1   pl-6 pr-6",
                    })}
                  >
                    Become a local host
                  </Link>

                  <p className="text-xs mt-4">
                    A rented space is better than an empty space
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
            <div className="relative w-full md:max-w-xl">
              <div className="w-full col-span-full lg:col-span-1 flex flex-col bg-white shadow-md">
                <ScrollArea className="relative flex-1 overflow-auto">
                  <div
                    aria-hidden="true"
                    className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
                  />

                  <div className="px-8 pb-12 pt-8">
                    <h2 className="tracking-tight font-bold text-3xl">
                      Bid for Room
                    </h2>

                    <div className="w-full h-px bg-zinc-200 my-6" />

                    <div className="relative mt-4 h-full flex flex-col justify-between">
                      <div className="flex flex-col gap-6">
                        <div className="relative flex flex-col gap-1 w-full">
                          <Label
                            className={`${dataErrors?.name && "text-red-600"}`}
                          >
                            Name
                          </Label>
                          <Input
                            name="name"
                            className={`${dataErrors?.name && "border-red-600"
                              }`}
                            type="text"
                            value={bidData?.name}
                            onChange={handleChange}
                          />
                          {dataErrors?.name && (
                            <p className="text-red-600 text-xs italic">
                              {dataErrors?.name}
                            </p>
                          )}
                        </div>

                        <div className="relative flex flex-col gap-1 w-full">
                          <Label
                            className={`${dataErrors?.email && "text-red-600"}`}
                          >
                            Email
                          </Label>
                          <Input
                            name="email"
                            className={`${dataErrors?.email && "border-red-600"
                              }`}
                            type="email"
                            value={bidData?.email}
                            onChange={handleChange}
                          />
                          {dataErrors?.email && (
                            <p className="text-red-600 text-xs italic">
                              {dataErrors?.email}
                            </p>
                          )}
                        </div>

                        <div className="relative flex flex-col gap-1 w-full">
                          <Label
                            className={`${dataErrors?.city && "text-red-600"}`}
                          >
                            City
                          </Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between"
                              >
                                {cities?.length > 0
                                  ? (() => {
                                    const matchedCity = cities.find(
                                      (item) => item._id === bidData.city
                                    );
                                    return matchedCity
                                      ? matchedCity.city_name
                                      : "Select City";
                                  })()
                                  : "Select City"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {cities?.length > 0 &&
                                cities.map((city) => (
                                  <DropdownMenuItem
                                    key={city._id}
                                    className={cn(
                                      "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                                      {
                                        "bg-zinc-100":
                                          city._id === bidData.city,
                                      }
                                    )}
                                    onClick={() => {
                                      setBidData((prev) => ({
                                        ...prev,
                                        city: city._id,
                                      }));
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        city._id === bidData.city
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {city.city_name}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {dataErrors?.city && (
                            <p className="text-red-600 text-xs italic">
                              {dataErrors?.city}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <div className="relative flex flex-col gap-1 w-full">
                            <Label
                              className={`${dataErrors?.beds && "text-red-600"
                                }`}
                            >
                              How many beds?
                            </Label>
                            <Input
                              name="beds"
                              className={`${dataErrors?.beds && "border-red-600"
                                }`}
                              type="beds"
                              value={bidData?.beds}
                              onChange={handleChange}
                            />
                            {dataErrors?.beds && (
                              <p className="text-red-600 text-xs italic">
                                {dataErrors?.beds}
                              </p>
                            )}
                          </div>

                          <div className="relative flex flex-col gap-1 w-full">
                            <Label
                              className={`${dataErrors?.people && "text-red-600"
                                }`}
                            >
                              How many people?
                            </Label>
                            <Input
                              name="people"
                              className={`${dataErrors?.people && "border-red-600"
                                }`}
                              type="people"
                              value={bidData?.people}
                              onChange={handleChange}
                            />
                            {dataErrors?.people && (
                              <p className="text-red-600 text-xs italic">
                                {dataErrors?.people}
                              </p>
                            )}
                          </div>
                        </div>


                        {/* add check in date field here */}

                        <div className="relative flex flex-col gap-2 w-full">
                          <Label
                            className={`${dataErrors?.checkInDate && "text-red-600"
                              }`}
                          >
                            Check In Date
                          </Label>


                          <div style={{ width: '100%' }}>

                        
                            <DatePicker
                              placeholderText="Check In Date"
                              selected={bidData?.checkInDate}
                              onChange={(date) => {
                                handleChangeDate(date);
                              }
                              }
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>

                          {dataErrors?.checkInDate && (
                            <p className="text-red-600 text-xs italic">
                              {dataErrors?.checkInDate}
                            </p>
                          )}
                        </div>





                        <div className="relative flex flex-col gap-1 w-full">
                          <Label
                            className={`${dataErrors?.nights && "text-red-600"
                              }`}
                          >
                            How many nights?
                          </Label>
                          <Input
                            name="nights"
                            className={`${dataErrors?.nights && "border-red-600"
                              }`}
                            type="nights"
                            value={bidData?.nights}
                            onChange={handleChange}
                          />
                          {dataErrors?.nights && (
                            <p className="text-red-600 text-xs italic">
                              {dataErrors?.nights}
                            </p>
                          )}
                        </div>

                        <div className="relative flex flex-col gap-1 w-full">
                          <Label
                            className={`${dataErrors?.price_willing_to_pay && "text-red-600"
                              }`}
                          >
                            Price willing to pay?
                          </Label>
                          <Input
                            name="price_willing_to_pay"
                            className={`${dataErrors?.price_willing_to_pay &&
                              "border-red-600"
                              }`}
                            type="price_willing_to_pay"
                            value={bidData?.price_willing_to_pay}
                            onChange={handleChange}
                          />
                          {dataErrors?.price_willing_to_pay && (
                            <p className="text-red-600 text-xs italic">
                              {dataErrors?.price_willing_to_pay}
                            </p>
                          )}
                        </div>

                        <div className="relative flex flex-col gap-1 w-full">
                          <Label
                            className={`${dataErrors?.special_instructions && "text-red-600"
                              }`}
                          >
                            Special Instructions of Amenities
                          </Label>
                          <Input
                            name="special_instructions"
                            className={`${dataErrors?.special_instructions &&
                              "border-red-600"
                              }`}
                            type="special_instructions"
                            value={bidData?.special_instructions}
                            onChange={handleChange}
                          />
                          {dataErrors?.special_instructions && (
                            <p className="text-red-600 text-xs italic">
                              {dataErrors?.special_instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="w-full px-8 h-16 bg-white">
                  <div className="h-px w-full bg-zinc-200" />
                  <div className="w-full h-full flex justify-end items-center">
                    <div className="w-full flex gap-6 items-center">
                      <Button
                        disabled={loading}
                        onClick={handleClick}
                        size="sm"
                        className="w-full"
                      >
                        {loading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Create a bid"
                        )}

                        <ArrowRight className="h-4 w-4 ml-1.5 inline" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isEmpty } from "@/utils/validation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/config/const";

interface City {
  _id: string;
  city_name: string;
}

const Page: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [dataErrors, setDataErrors] = useState({
    name: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [cities, setCities] = useState<City[]>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setDataErrors(() => {
      return {
        name: "",
        email: "",
        city: "",
        password: "",
        confirmPassword: "",
      };
    });

    if (isEmpty(userData?.name)) {
      toast.error("Please enter a valid name");
      setDataErrors({
        ...dataErrors,
        name: "Please enter a valid name",
      });
    } else if (isEmpty(userData?.city)) {
      toast.error("Please select a valid city");
      setDataErrors({
        ...dataErrors,
        city: "Please select a valid city",
      });
    } else {
      var data = {
        name: userData.name,
        city: userData.city,
      };

      try {
        setLoading(true);
        const res: AxiosResponse = await axios.patch(
          baseUrl+"/localhosts",
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (res.status === 200) {
          toast.success("Data has been updated successfully");
          setLoading(false);
        }
      } catch (err: any) {
        const errMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message[0]
          : err.response.data.message;
        toast.success(errMsg);
        setLoading(false);
      }
    }

    // Handle form submission
  };

  const handleSubmitChangePassword = async (e: any) => {
    e.preventDefault();
    setDataErrors(() => {
      return {
        name: "",
        email: "",
        city: "",
        password: "",
        confirmPassword: "",
      };
    });

    if (isEmpty(userData?.password)) {
      toast.error("Please enter your password");
      setDataErrors({
        ...dataErrors,
        password: "Please enter your password",
      });
    } else if (userData?.password?.length < 8) {
      toast.error("Password contains atleast 8 characters");
      setDataErrors({
        ...dataErrors,
        password: "Password contains atleast 8 characters",
      });
    } else if (userData?.password !== userData?.confirmPassword) {
      toast.error("Passwords do not match");
      setDataErrors({
        ...dataErrors,
        confirmPassword: "Passwords do not match",
      });
    } else {
      var data = {
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      };

      try {
        setLoading2(true);
        const res: AxiosResponse = await axios.patch(
          baseUrl+"/localhosts/change-password",
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (res.status === 200) {
          toast.success("Password has been changed successfully");
          setUserData({
            name: userData.name,
            email: userData.email,
            city: userData.city,
            password: "",
            confirmPassword: "",
          });
          setLoading2(false);
        }
      } catch (err: any) {
        const errMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message[0]
          : err.response.data.message;
        toast.success(errMsg);
        setLoading2(false);
      }
    }

    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const getAllCities = async () => {
    const res = await axios.get(baseUrl+"/cities");
    if (res?.data?.data) {
      setCities(res.data.data);
    }
  };

  const getMyProfile = async () => {
    const res = await axios.get(baseUrl+"/localhosts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    if (res?.data?.data) {
      setUserData(res.data.data);
    }
  };

  useEffect(() => {
    getAllCities();
    getMyProfile();
  }, []);

  return (
    <div className="bg-slate-50 grainy-light">
      <MaxWidthWrapper>
        <div className="w-full flex justify-center py-4">
          <div className="w-full md:max-w-xl col-span-full lg:col-span-1 flex flex-col bg-white shadow-md rounded-md">
            <form onSubmit={handleSubmit}>
              <div className="px-8 pb-12 pt-12">
                <h2 className="tracking-tight font-bold text-3xl">
                  My Profile
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
                        className={`${dataErrors?.name && "border-red-600"}`}
                        type="text"
                        value={userData?.name}
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
                        disabled
                        className={`${dataErrors?.email && "border-red-600"}`}
                        type="email"
                        value={userData?.email}
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
                                    (item) => item._id === userData.city
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
                                    "bg-zinc-100": city._id === userData.city,
                                  }
                                )}
                                onClick={() => {
                                  setUserData((prev) => ({
                                    ...prev,
                                    city: city._id,
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    city._id === userData.city
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
                  </div>
                </div>
              </div>

              <div className="w-full px-8 bg-white pb-12 rounded-md">
                <div className="w-full h-full flex justify-end items-center">
                  <div className="w-full flex justify-center gap-6 items-center">
                    <Button
                      disabled={loading}
                      type="submit"
                      size="sm"
                      className="text-sm px-10"
                    >
                      {loading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Link href={"/localhost/home"}>
                      <Button
                        size="sm"
                        className="text-sm px-10 bg-gray-400 hover:bg-red-600"
                      >
                        cancel
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full flex justify-center py-4">
          <div className="w-full md:max-w-xl col-span-full lg:col-span-1 flex flex-col bg-white shadow-md rounded-md">
            <form onSubmit={handleSubmitChangePassword}>
              <div className="px-8 pb-12 pt-12">
                <h2 className="tracking-tight font-bold text-3xl">
                  Change Password
                </h2>

                <div className="w-full h-px bg-zinc-200 my-6" />

                <div className="relative mt-4 h-full flex flex-col justify-between">
                  <div className="flex flex-col gap-6">
                    <div className="relative flex flex-col gap-1 w-full">
                      <Label
                        className={`${dataErrors?.password && "text-red-600"}`}
                      >
                        Password
                      </Label>
                      <Input
                        name="password"
                        className={`${
                          dataErrors?.password && "border-red-600"
                        }`}
                        type="password"
                        value={userData?.password}
                        onChange={handleChange}
                      />
                      {dataErrors?.password && (
                        <p className="text-red-600 text-xs italic">
                          {dataErrors?.password}
                        </p>
                      )}
                    </div>

                    <div className="relative flex flex-col gap-1 w-full">
                      <Label
                        className={`${
                          dataErrors?.confirmPassword && "text-red-600"
                        }`}
                      >
                        Confirm Password
                      </Label>
                      <Input
                        name="confirmPassword"
                        className={`${
                          dataErrors?.confirmPassword && "border-red-600"
                        }`}
                        type="password"
                        value={userData?.confirmPassword}
                        onChange={handleChange}
                      />
                      {dataErrors?.confirmPassword && (
                        <p className="text-red-600 text-xs italic">
                          {dataErrors?.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full px-8 bg-white pb-12 rounded-md">
                <div className="w-full h-full flex justify-end items-center">
                  <div className="w-full flex justify-center gap-6 items-center">
                    <Button
                      disabled={loading2}
                      type="submit"
                      size="sm"
                      className="text-sm px-10"
                    >
                      {loading2 ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Link href={"/localhost/home"}>
                      <Button
                        size="sm"
                        className="text-sm px-10 bg-gray-400 hover:bg-red-600"
                      >
                        cancel
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;

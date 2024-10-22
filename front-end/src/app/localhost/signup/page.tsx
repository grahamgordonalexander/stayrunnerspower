"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { isValidName, isValidEmail, isEmpty ,validatePassword} from "../../../utils/validation";
import { setUserDataInLocalStorage } from "../../../utils/storage";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { baseUrl } from "@/config/const";

interface City {
  _id: string;
  city_name: string;
}

const Page = () => {
  const router = useRouter();
  const [localhost, setLocalHost] = useState({
    name: "",
    email: "",
    city: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    city: "",
    password: "",
  });

  const [cities, setCities] = useState<City[]>([]);

  const [loading, setLoading] = useState(false);
  //const [password, setPassword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalHost({ ...localhost, [name]: value });
  };

  // const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // console.log(e.target.value);
    
  //   setPassword(e.target.value)
  // }

  const handleClick = async () => {
    setErrors({
      name: "",
      email: "",
      city: "",
      password: "",
    });

    let hasError = false;

    if (!isValidName(localhost?.name)) {
      toast.error("Please enter a valid name");
      setErrors({
        ...errors,
        name: "Please enter a valid name",
      });
      hasError = true;
    } else if (!isValidEmail(localhost?.email)) {
      toast.error("Please enter a valid email");
      setErrors({
        ...errors,
        email: "Please enter a valid email",
      });
      hasError = true;
    } else if (isEmpty(localhost?.city)) {
      toast.error("Please select a valid city");
      setErrors({
        ...errors,
        city: "Please select a valid city",
      });
      hasError = true;
    } else if (!validatePassword(localhost?.password)) {
      toast.error("Please enter a valid password");
      setErrors({
        ...errors,
        password: "Please enter a valid password",
      });
      hasError = true;
    }

    
    else {
      try {
        setLoading(true);
        const res: AxiosResponse = await axios.post(
          baseUrl+"/localhosts",
          localhost
        );
        if (res.status === 201) {
          const userData = {
            name: localhost?.name,
            email: localhost?.email,
            city: localhost?.city,
            id: res?.data?.data?._id,
            code_verified: res?.data?.data?.code_verified,
            password: "",
            // password: password
          };
          setUserDataInLocalStorage(userData);
          if (!res?.data?.code_verified) {
            router.push("/localhost/verify");
          } else {
            toast.success("You are already verified");
            router.push("/login");
          }
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
    const res = await axios.get(baseUrl+"/cities");
    if (res?.data?.data) {
      setCities(res.data.data);
    }
  };

  useEffect(() => {
    getAllCities();
  }, []);

  return (
    <MaxWidthWrapper>
      <div className="w-full flex justify-center py-4">
        <div className="w-full md:max-w-xl col-span-full lg:col-span-1 flex flex-col bg-white shadow-md rounded-md">
          <ScrollArea className="relative flex-1 overflow-auto">
            <div
              aria-hidden="true"
              className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
            />

            <div className="px-8 pb-12 pt-12">
              <h2 className="tracking-tight font-bold text-3xl">
                Become a Last Minute Local Host
              </h2>

              <div className="w-full h-px bg-zinc-200 my-6" />

              <div className="relative mt-4 h-full flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <div className="relative flex flex-col gap-1 w-full ">
                    <Label className={`pl-2 ${errors?.name && "text-red-600"}`}>
                      Your Local Host Name
                    </Label>
                    <Input
                      name="name"
                      className={`${errors?.name && "border-red-600"}`}
                      type="text"
                      value={localhost?.name}
                      onChange={handleChange}
                    />
                    {errors?.name && (
                      <p className="text-red-600 text-xs italic">
                        {errors?.name}
                      </p>
                    )}
                  </div>

                  <div className="relative flex flex-col gap-1 w-full">
                    <Label className={`pl-2 ${errors?.email && "text-red-600"}`}>
                     Your Email
                    </Label>
                    <Input
                      name="email"
                      className={`${errors?.email && "text-red-600"}`}
                      type="email"
                      value={localhost?.email}
                      onChange={handleChange}
                    />
                    {errors?.email && (
                      <p className="text-red-600 text-xs italic">
                        {errors?.email}
                      </p>
                    )}
                  </div>

                  <div className="relative flex flex-col gap-1 w-full">
                    <Label className={`pl-2 ${errors?.city && "text-red-600"}`}>
                    In What City can you Host?
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
                                  (item) => item._id === localhost.city
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
                                  "bg-zinc-100": city._id === localhost.city,
                                }
                              )}
                              onClick={() => {
                                setLocalHost((prev) => ({
                                  ...prev,
                                  city: city._id,
                                }));
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  city._id === localhost.city
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {city.city_name}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {errors?.city && (
                      <p className="text-red-600 text-xs italic">
                        {errors?.city}
                      </p>
                    )}
                  </div>


                  <div className="relative flex flex-col gap-1 w-full">
                    <Label className={`pl-2 ${errors?.password && "text-red-600"}`}>
                      Password
                    </Label>
                    <Input
                      name="password"
                      className={`${errors?.password && "border-red-600"}`}
                      type="password"
                      value={localhost?.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                    />
                    {errors?.password && (
                      <p className="text-red-600 text-xs italic">
                        {errors?.password}
                      </p>
                    )}
                  </div>


                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="w-full px-8 bg-white pb-12 rounded-md">
            <div className="w-full h-full flex justify-end items-center">
              <div className="w-full flex flex-col justify-center gap-6 items-center">
                {/* <p className="font-medium whitespace-nowrap">
              {formatPrice(
                (BASE_PRICE +
                  options.finish.price +
                  options.material.price) /
                  100
              )}
            </p> */}

                <Button
                  disabled={loading}
                  onClick={handleClick}
                  size="sm"
                  className="text-sm w-1/2"
                >
                  {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Next"
                  )}
                </Button>
                <Link
                  style={{ width: "50%", fontSize: "14px", lineHeight: "20px" }}
                  href="/login"
                  className={buttonVariants({
                    size: "sm",
                    variant: "secondary",
                  })}
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <p className="text-xs mt-4">
                A rented space is better than an empty space
              </p>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;

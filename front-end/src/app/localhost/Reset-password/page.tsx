"use client";
import React, { Suspense } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "../../../utils/validation";
import { getUserDataFromLocalStorage, saveToken } from "../../../utils/storage";
import axios, { AxiosResponse } from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check, Star, ChevronsUpDown, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { baseUrl } from "@/config/const";
import { validatePassword } from "../../../utils/validation";

const ResetPasswordPage = () => {
  const userData = getUserDataFromLocalStorage();
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const from = searchParams.get("from") || "";
  // const id = searchParams.get("id") || "";

  const [localhost, setLocalHost] = useState({
   
    password: "",
    ConfirmPassword : "",
  });

  const [errors, setErrors] = useState({
 
    password: "",
    ConfirmPassword : "",
  });

  const [isPending, startTransition] = useTransition();

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalHost({ ...localhost, [name]: value });
  };

  const handleClick = async () => {
    setErrors({
  
      password: "",
      ConfirmPassword : "",
    });

    //let hasError = false;

    if (!validatePassword(localhost?.password)) {
      toast.error("Please enter a valid password");
      setErrors({
        ...errors,
        password: "Please enter a valid password",
      });
     // hasError = true;
    }
    
    else if (!validatePassword(localhost?.ConfirmPassword)) {
      toast.error("Please enter a valid password");
      setErrors({
        ...errors,
        ConfirmPassword: "Please enter a valid password",
        password: "",
      });
     // hasError = true;
    } 
    else if (localhost?.password !== localhost?.ConfirmPassword) {
      toast.error("Passwords do not match");
      setErrors({
        ...errors,
        ConfirmPassword: "Passwords do not match",

      })
    }
    
    
    else {
      console.log("successfully password reseted");
      
      try {
        setLoading(true);
        const res: AxiosResponse = await axios.post(
          baseUrl+"/localhosts/reset-new-password",
          {
            localhost: userData?.id,
            password: localhost.password,
          }
        );

        if (res.status === 200) {
          toast.success("Password successfully created. Please login");
          if (res?.data?.data?.localhost) {
         //   saveToken(res?.data?.token);
        //    console.log(from);
          //  if (from === "negotiate" && id) {
              router.push("/login");
         //   } 
            // else {
            //   router.push("/localhost/home");
            // }
          }
        }
      } catch (err: any) {
        setLoading(false);
        const errMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message[0]
          : err.response.data.message;
        toast.error(errMsg);
      }



    }
  };

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
            Last Minute Local Host
              </h2>
              <br/>
              <p className="tracking-tight  text-l ">
             Please Enter Your New Password
              </p>

              <div className="w-full h-px bg-zinc-200 my-6" />
              <div className="relative flex flex-col gap-1 w-full">
                    <Label className={`${errors?.password && "text-red-600"}`}>
                     Password
                    </Label>
                    <Input
                      name="password"
                      className={`${errors?.password && "text-red-600"}`}
                      type="password"
                      value={localhost?.password}
                      onChange={handleChange}
                    />
                    {errors?.password && (
                      <p className="text-red-600 text-xs italic">
                        {errors?.password}
                      </p>
                    )}
                  </div>


              <div className="relative mt-4 h-full flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <div className="relative flex flex-col gap-1 w-full">
                    <Label className={`${errors?.ConfirmPassword && "text-red-600"}`}>
                      
                      Confirm Password
                    </Label>
                    <Input
                      name="ConfirmPassword"
                      className={`${errors?.ConfirmPassword && "text-red-600"}`}
                      type="password"
                      value={localhost?.ConfirmPassword}
                      onChange={handleChange}
                    />
                    {errors?.ConfirmPassword && (
                      <p className="text-red-600 text-xs italic">
                        {errors?.ConfirmPassword}
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
                {/* <Link
                  style={{
                    width: "50%",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                  href="/localhost/signup"
                  className={buttonVariants({
                    size: "sm",
                    variant: "secondary",
                  })}
                >
                  Become a localhost
                </Link> */}
              </div>
            
            </div>
            <p className="text-center">Please make sure to remember your password.</p>
            {/* <div className="flex justify-center items-center py-2">
              <p className="text-sm mr-2">Forgot password? </p>
              <Link href={"/localhost/forgot-password"}>
                <p className="text-sm text-blue-700 cursor-pointer underline">
                  Click here
                </p>
              </Link>
            </div> */}
            <br/>
       
          </div>
          
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordPage />
  </Suspense>
);

export default Page;

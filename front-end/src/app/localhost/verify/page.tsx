"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { toast } from "react-toastify";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import {
  getUserDataFromLocalStorage,
  setUserDataInLocalStorage,
} from "../../../utils/storage";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { baseUrl } from "@/config/const";

const Page = () => {
  const userData = getUserDataFromLocalStorage();
  const [seconds, setSeconds] = useState(120);
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleResendCode = async () => {
    try {
      setSeconds(60);
      setLoading(true);
      const res = await axios.patch(
        `${baseUrl}/localhosts/resend-verification-code/${userData?.id}`
      );

      if (res.status === 200) {
        toast.success("Verification code has been sent to you email");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err: any) {
      const errMsg = Array.isArray(err.response.data.message)
        ? err.response.data.message[0]
        : err.response.data.message;
      toast.error(errMsg);
      setLoading(false);
    }
  };

  const handleClick = async () => {
    console.log("clicked", userData);
    
    if (verificationCode?.length !== 6) {
      toast.error("Please enter a valid verification code");
    } else {
      try {
        setLoading2(true);
        const res = await axios.patch(
          `${baseUrl}/localhosts/verify/${userData?.id}`,
          {
            verification_code: parseInt(verificationCode, 10),
           // Password : userData?.password
          }
        );

        if (res.status === 200) {
          setUserDataInLocalStorage({
            name: userData?.name || res?.data?.data?.name || "",
            email: userData?.email || "",
            city: userData?.city || res?.data?.data?.city || "",
            id: res?.data?.data?._id,
            code_verified: res?.data?.data?.code_verified,
            password: res?.data?.data?.password,
          });
if(res?.data?.data?.password == ""){
  toast.success("Account verified successfully. Please login");
  startTransition(() => {
    router.push("/login");
  });
}else{
  toast.success("Account verified successfully. Please reset password");
  startTransition(() => {
    router.push("/localhost/Reset-password");
  });
}
         
        }
      } catch (err: any) {
        const errMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message[0]
          : err.response.data.message;
        toast.error(errMsg);
        setLoading2(false);
      }
    }
  };

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  return (
    <MaxWidthWrapper>
      <div className="w-full flex justify-center py-20">
        <div className="w-full md:max-w-xl col-span-full lg:col-span-1 flex flex-col bg-white shadow-md rounded-md pb-16">
          <ScrollArea className="relative flex-1 overflow-auto">
            <div
              aria-hidden="true"
              className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
            />

            <div className="px-8 pb-6 pt-12">
              <div className="flex justify-center">
                <h2 className="tracking-tight font-semibold text-xl mb-6">
                  Last Minute Booking
                </h2>
              </div>

              <div className="relative mt-4 h-full flex flex-col justify-between">
                <div className="w-full flex justify-center">
                  <div className="relative flex flex-col gap-1">
                    <h3 className="font-bold pb-4">Check you inbox</h3>
                    <p className="text-sm">Enter the code we just sent to</p>
                    <p className="text-sm pb-6">{userData?.email}</p>
                    <Label>Your verification code</Label>
                    <InputOTP
                      maxLength={6}
                      onChange={(value) => setVerificationCode(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  {seconds > 0 ? (
                    <p>Time remaining: {seconds} seconds</p>
                  ) : (
                    <p className="text-red-600">Verification code expired</p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="w-full px-8 bg-white pb-12 rounded-md">
            <div className="w-full h-full flex justify-end items-center">
              <div className="w-full flex justify-center gap-1 items-center">
                {/* <p className="font-medium whitespace-nowrap">
              {formatPrice(
                (BASE_PRICE +
                  options.finish.price +
                  options.material.price) /
                  100
              )}
            </p> */}
                {seconds < 1 ? (
                  <Button
                    disabled={loading}
                    onClick={handleResendCode}
                    size="sm"
                    className="text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Resend code"
                    )}
                  </Button>
                ) : (
                  <Button
                    disabled={loading2}
                    onClick={handleClick}
                    size="sm"
                    className="text-sm"
                  >
                    {loading2 ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div>
              <div className="flex justify-center items-center mt-2 flex-col">
                <p className="text-sm mr-2">
                  Did not receive a code? Please Check Spam box or
                </p>
                {seconds < 1 ? (
                  <p
                    onClick={handleResendCode}
                    className="text-sm text-blue-700 cursor-pointer underline"
                  >
                    Resend code
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 cursor-not-allowed">
                    Resend code
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;

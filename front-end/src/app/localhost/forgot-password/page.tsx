"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { isValidEmail } from "../../../utils/validation";
import { setUserDataInLocalStorage } from "../../../utils/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { baseUrl } from "@/config/const";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleClick = async () => {
    setError("");

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email");
      setError("Please enter a valid email");
    } else {
      try {
        setLoading(true);
        const res: AxiosResponse = await axios.patch(
          baseUrl+"/localhosts/forgot-password",
          { email }
        );
        if (res.status === 200) {
          const userData = {
            name: "",
            email: email,
            city: "",
            id: res?.data?.data?._id,
            code_verified: res?.data?.data?.code_verified,
            password: "",
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
              <h2 className="tracking-tight font-bold text-xl">
                Forgot Password?
              </h2>

              <div className="relative mt-10 h-full flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <div className="relative flex flex-col gap-1 w-full">
                    <Label className={`${error && "text-red-600"}`}>
                      Enter your email to get password
                    </Label>
                    <Input
                      name="email"
                      className={`${error && "text-red-600"}`}
                      type="email"
                      value={email}
                      onChange={handleChange}
                    />
                    {error && (
                      <p className="text-red-600 text-xs italic">{error}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="w-full px-8 bg-white pb-12 rounded-md">
            <div className="w-full h-full flex justify-end items-center">
              <div className="w-full flex justify-center gap-6 items-center">
                <Button
                  disabled={loading}
                  onClick={handleClick}
                  size="sm"
                  className="text-sm"
                >
                  {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;

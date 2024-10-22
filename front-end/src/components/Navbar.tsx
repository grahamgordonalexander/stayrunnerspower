"use client";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { getTokenn } from "@/utils/storage";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isUpdate, setIsUpdate] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  let IsUser = false;
  let token = null;

  // Check if localStorage is available
  if (typeof localStorage !== "undefined") {
    // If available, retrieve the token
    token = localStorage.getItem("jwtToken");
    console.log("Token retrieved from localStorage:", token);
  }

  if (token) {
    IsUser = true;
    // Assuming router is properly defined and imported
    // router.push("/localhost/home");
  }

  // Optionally, handle the case where the token is not present or router redirection fails
  // if (!IsUser) {
  //   console.log("User is not authenticated or token is missing.");
  //   // Optionally, you might want to redirect to a login page or display an error message
  // }

  // let IsUser;

  // // const token = localStorage.getItem("jwtToken") ? localStorage.getItem("jwtToken") : null;

  // const token = localStorage.getItem("jwtToken");
  // //console.log("win",window);

  // console.log("get token from Storage-- usestate: ", token);

  // // const ttoken = null || undefined;
  // //const ttoken ="shauguajsckajhiubdkjsdjbc";
  // // console.log("token get from Local storage",ttoken);
  // if (token) {
  //   IsUser = true;
  //   router.push("/localhost/home");
  // }
  // else {
  //   IsUser = false;

  // }

  useEffect(() => {
    setIsUpdate(!isUpdate);
  }, [pathname]);
  //console.log("Is user in navbar ",IsUser);

  // const token = localStorage.getItem("jwtToken");
  // console.log("tokeen",token);

  // if (!token) {
  //   user = false;
  // }
  // else{
  //   user =true;
  // }
  //console.log("user t/f",user);

  const isAdmin = false;

  return (
    <nav className="sticky z-[100] h-20 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-20 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold text-xl">
            Last Minute<span className="text-green-600 ml-2">Booking</span>
          </Link>

          <div className="h-full flex items-center space-x-4">
            {IsUser ? (
              <>
                <Link
                  href="/localhost/home"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Dashboard ✨
                </Link>
                <Link
                  href="/logout"
                  className={buttonVariants({
                    size: "lg",
                    variant: "ghost",
                    className: "font-bold ",
                  })}
                >
                  Logout
                </Link>
                {/* {isAdmin ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard ✨
                  </Link>
                ) : null} */}
                {/* <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Become a local host
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link> */}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    size: "lg",
                    variant: "ghost",
                    className: "font-bold",
                  })}
                >
                  Login
                </Link>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                <Link
                  href="/localhost/signup"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Become a local host
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;

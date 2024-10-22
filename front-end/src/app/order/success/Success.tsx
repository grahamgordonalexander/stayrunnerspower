"use client";

import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const ThankYou = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const data = {};

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
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-base font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Please check your email.
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            A Local Host will be in touch.
          </p>

          <div className="mt-14 text-sm font-medium">
            <Link
              href="/"
              className={buttonVariants({
                size: "sm",
                className: "w-full",
              })}
            >
              Book again
            </Link>
          </div>
        </div>

        <div className="mt-14">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              BOOK A ROOM through LAST MINUTE LOCAL HOST
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              Please Check all Folders Including Spam folder{" "}
              {"(@amarone.company)"} for The notification from the Last Minute
              Local Host
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;

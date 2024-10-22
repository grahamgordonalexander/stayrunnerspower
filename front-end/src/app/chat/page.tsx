"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check, Star, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FINISHES, CITIES, MATERIALS } from "@/validators/option-validator";
import Chat from "@/components/Chat";
import TestChat from "@/components/TestChat";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  return (
    <MaxWidthWrapper>
      <div className="w-full flex justify-center py-4">
        <Chat />
        <TestChat />
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;

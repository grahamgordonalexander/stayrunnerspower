"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MessagesProvider } from "@/context/messages";
import { ReactNode } from "react";

const client = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={client}>
      <MessagesProvider>{children}</MessagesProvider>
    </QueryClientProvider>
  );
};

export default Providers;

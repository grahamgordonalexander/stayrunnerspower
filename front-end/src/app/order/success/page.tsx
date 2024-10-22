import { Suspense } from "react";
import Success from "./Success";

const Page = () => {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
};

export default Page;

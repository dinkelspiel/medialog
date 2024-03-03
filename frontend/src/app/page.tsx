import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  return redirect("/dashboard");
};

export default Page;

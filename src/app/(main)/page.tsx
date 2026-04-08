import React from "react";
import Views from "./_views";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Views Dashboard",
  description: "...",
};

interface Props {}

function Page(props: Props) {
  const {} = props;

  return <Views />;
}

export default Page;

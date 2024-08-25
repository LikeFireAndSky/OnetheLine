import { LogType } from "@/types";
import React from "react";

const Log = ({ title, content, date }: LogType) => {
  return (
    <div className="w-full flex flex-col border px-1 py-3">
      <p>Title : {title}</p>
      <p>Content : {content}</p>
      <p>Date : {date}</p>
    </div>
  );
};

export default Log;

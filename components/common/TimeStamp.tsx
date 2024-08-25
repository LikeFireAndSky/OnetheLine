"use client";

import React from "react";
import moment from "moment";

const TimeStamp = () => {
  return (
    <div>
      <div>Recording Time : {moment().format("YYYY-MM-DD HH:mm:ss")}</div>
    </div>
  );
};

export default TimeStamp;

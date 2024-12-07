import React from "react";
import dynamic from "next/dynamic";

const LazyMain = dynamic(() => import("./LazyMain"), {
  ssr: false,
});

export default () => <LazyMain />;

import React, { Suspense } from "react";
import Loader from "./components/loader";

interface SuspenseLoaderProps {
  children: React.ReactNode;
}

const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ children }) => {
  return (
    <Suspense fallback={<Loader loading={true} />}>
      {children}
    </Suspense>
  );
};

export default SuspenseLoader;

import React, { createContext, useContext, useState } from "react";
import { GlobeController } from "@/api/GlobeController";

interface IGlobeControllerContextProps {
  globeController: GlobeController;
  initialized: boolean;
}

const GlobeControllerContext = createContext<IGlobeControllerContextProps>({} as IGlobeControllerContextProps);

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobeController = () => useContext(GlobeControllerContext);

const GlobeControllerProvider = ({
  globeController,
  children,
}: {
  globeController: GlobeController;
  children: React.ReactNode;
}) => {
  const [initialized, init] = useState<boolean>(false);
  globeController.viewerCreated.on(() => {
    init(globeController.ready);
  });

  const props = {
    globeController,
    initialized,
  };

  return <GlobeControllerContext.Provider value={props}>{children}</GlobeControllerContext.Provider>;
};

export default GlobeControllerProvider;

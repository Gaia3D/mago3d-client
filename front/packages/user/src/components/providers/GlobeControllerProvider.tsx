import React, { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    const handleViewerCreated = () => {
      init(globeController.ready);
    };

    globeController.viewerCreated.on(handleViewerCreated);

    return () => {
      globeController.viewerCreated.off(handleViewerCreated);
    };
  }, [globeController]);

  const props = {
    globeController,
    initialized,
  };

  return <GlobeControllerContext.Provider value={props}>{children}</GlobeControllerContext.Provider>;
};

export default GlobeControllerProvider;

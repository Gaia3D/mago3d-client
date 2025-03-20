import React from 'react';
import {AsideDisplayProps} from "@/components/aside/AsidePanel.tsx";
import SideCloseButton from "@/components/SideCloseButton.tsx";

const AsideWaterSimulation: React.FC<AsideDisplayProps> = ({ display }) => {
  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar water-simulation">
        <div className="side-bar-header">
          <SideCloseButton/>
        </div>
        <div className="content--wrapper">

        </div>
      </div>
    </div>
  );
};

export default AsideWaterSimulation;
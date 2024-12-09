import MapSelector from "@/components/aside/MapSelector.tsx";
import LanguageSelector from "@/components/LanguageSelector.tsx";
import SignInfo from "@/components/SignInfo.tsx";
import React from "react";

const Header = () => {
  return (
      <div className="top-panel">
          <div className="mago3d-logo"/>
          <MapSelector/>
          <LanguageSelector/>
          <SignInfo/>
      </div>
  );
};

export default Header;

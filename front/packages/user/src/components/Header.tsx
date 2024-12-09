import MapSelector from "@/components/header/MapSelector.tsx";
import LanguageSelector from "@/components/header/LanguageSelector.tsx";
import SignInfo from "@/components/header/SignInfo.tsx";
import React from "react";
import DocsSelector from "@/components/header/DocsSelector.tsx";

const Header = () => {
  return (
      <div className="top-panel">
          <div className="mago3d-logo"/>
          <DocsSelector />
          <MapSelector/>
          <LanguageSelector/>
          <SignInfo/>
      </div>
  );
};

export default Header;

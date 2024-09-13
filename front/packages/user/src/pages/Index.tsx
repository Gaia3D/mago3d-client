import {AsideMenu} from "@/components/aside/AsideMenu.tsx";
import {AsidePanel} from "@/components/aside/AsidePanel.tsx";
import {MapTool, MapToolbox} from "@/components/MapToolbox";
import {MapPopup, popupState} from "@/components/MapPopup";
import "cesium/Build/Cesium/Widgets/widgets.css";
import {TimeSeriesProvider} from "@/components/providers/TimeSeriesProvder";
import GlobeControllerProvider from "@/components/providers/GlobeControllerProvider";
import {getInstance} from "@/api/GlobeController";
import Globe from "@/components/Map";
import {BoundarySearchWrapper} from "@/components/BoundarySearch";
import {useSetRecoilState} from "recoil";
import Footer from "@/components/Footer";
import NewAssetModal from "@/components/modal/NewAssetModal.tsx";
import MapSelector from "@/components/aside/MapSelector.tsx";
import LogModal from "@/components/modal/common/LogModal.tsx";

const globeController = getInstance();

const MainPage = () => {
  const setPopup = useSetRecoilState(popupState);

  const handleToolClick = (tool: MapTool) => {
    console.log(`도구가 선택되었습니다. 선택된 도구: ${tool.className}`);
  };

  return (
    <>
      <main>
        <GlobeControllerProvider globeController={globeController}>
          <TimeSeriesProvider>
            <div id="map" className={"map"}>
              <MapPopup/>
              <Globe/>
              <AsidePanel/>
              <MapSelector />
              <BoundarySearchWrapper/>
              <MapToolbox onToolClick={handleToolClick}/>
              <NewAssetModal />
              <LogModal />
              <Footer/>
            </div>
          </TimeSeriesProvider>
        </GlobeControllerProvider>
        <nav>
          <h1 className="logo"></h1>
          <AsideMenu/>
        </nav>
      </main>
    </>
  );
};

export default MainPage;

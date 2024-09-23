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
import keycloak from "@/api/keycloak.ts";
import {AppLoader, AuthClientEvent} from "@mnd/shared";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {authenticateState} from "@/recoils/Auth.ts";

const globeController = getInstance();

const MainPage = () => {

  const setAuth = useSetRecoilState(authenticateState);

  const onReady =() => {
    setAuth(keycloak.authenticated ?? false);
  }

  const authEventHandler = (event: AuthClientEvent, /*error: AuthClientError | undefined*/) => {
    if (event === 'onReady') onReady();
    if (event === 'onAuthSuccess') onReady();
  };

  const setPopup = useSetRecoilState(popupState);

  const handleToolClick = (tool: MapTool) => {
    console.log(`도구가 선택되었습니다. 선택된 도구: ${tool.className}`);
  };

  return (
    <>
      <ReactKeycloakProvider
          authClient={keycloak}
          onEvent={authEventHandler}
          /* onTokens={tokenChangeHandler} */
          initOptions={{
            onLoad: 'login-required',
            responseMode: 'query',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
          }}
          LoadingComponent={<AppLoader />}
      >
        <main>
          <GlobeControllerProvider globeController={globeController}>
            <TimeSeriesProvider>
              <div id="map" className={"map"}>
                <div className="mago3d-logo" />
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
      </ReactKeycloakProvider>
    </>
  );
};

export default MainPage;

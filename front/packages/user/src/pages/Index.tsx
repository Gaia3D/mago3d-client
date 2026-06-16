import {Suspense} from "react";
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
import LogModal from "@/components/modal/common/LogModal.tsx";
import keycloak from "@/api/keycloak.ts";
import {AppLoader, AuthClientEvent} from "@mnd/shared";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {authenticateState} from "@/recoils/Auth.ts";
import Header from "@/components/Header.tsx";
import SideToolContainer from "@/components/tool/SideToolContainer.tsx";

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
              checkLoginIframe: false,
              // silentCheckSsoRedirectUri
              // keycloak-js가 이 값 때문에 3p-cookies 체크를 돌림(노이즈)
            }}
            LoadingComponent={<AppLoader />}
        >
          {/* keycloak provider 안쪽에 Suspense 경계를 둔다.
              AsideAssets 등이 async recoil 셀렉터(currentUserProfileSelector → loadUserProfile)로
              suspend할 때, 이 경계가 받아내야 provider가 언마운트/재마운트되지 않는다.
              (App.tsx 최상위 Suspense가 받으면 keycloak provider까지 리마운트되어
               init이 재실행 → login-required로 /auth 무한 리다이렉트 루프가 발생함) */}
          <Suspense fallback={<AppLoader />}>
            <main>
              <GlobeControllerProvider globeController={globeController}>
                <TimeSeriesProvider>
                  <div id="map" className={"map"}>
                    <Header />
                    <MapPopup/>
                    <Globe/>
                    <AsidePanel/>
                    <BoundarySearchWrapper/>
                    <SideToolContainer />
                    {/*<MapToolbox onToolClick={handleToolClick}/>*/}
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
          </Suspense>
        </ReactKeycloakProvider>
      </>
  );
};

export default MainPage;
# Water Simulation

## Download NPM
link: https://www.npmjs.com/package/mago-cesium-tools
## Install NPM
```bash
npm install mago-cesium-tools
```

## Source Code
link: https://github.com/Gaia3D/mago-cesium-tools   
doc: https://gaia3d.github.io/mago-cesium-tools/MagoFluid.html   
     https://gaia3d.github.io/mago-cesium-tools/MagoFluidOptions.html    
## Usage
```javascript
import {Viewer} from 'cesium';
import {MagoViewer} from 'mago-cesium-tools'

const viewer = new Viewer('cesiumContainer');
const magoViewer = new MagoViewer(viewer);
magoViewer.test();
```

## Example
참고소스 경로 : front/packages/user/src/components/aside/water-simulation/AsideWaterSimulation.tsx      
[주의] 물이 차는 걸 확인하려면 배수를 false로 변경해야 한다    

## Configuration
Traefik 리버스 프록시를 사용하여 frontend 서비스에 특정 경로를 전달하기 위한 설정입니다.

라이브러리에서 요청하는 경로(`/grid`, `/cesium`)가 고정되어 있기 때문에,  
클라이언트가 `/grid`, `/cesium` 경로로 요청을 보내더라도  
Traefik이 이를 내부적으로 `/user/grid`, `/user/cesium`으로 **경로를 재작성하여** frontend 컨테이너에 전달하도록 설정했습니다.

docker-compose.yml
```yaml
  frontend:
    labels:
      - traefik.enable=true
      - traefik.http.routers.frontend.rule=Host(`${DOMAIN}`) && (PathPrefix(`/user`) || PathPrefix(`/admin`) || PathPrefix(`/grid`) || PathPrefix(`/cesium`))
      - traefik.http.routers.frontend.entrypoints=websecure
      - traefik.http.routers.frontend.service=frontend
      - traefik.http.services.frontend.loadbalancer.server.port=80
      - traefik.http.routers.frontend.middlewares=prefix-rewrite
      - traefik.http.middlewares.prefix-rewrite.replacepathregex.regex=^/(grid|cesium)(/.*)?$
      - traefik.http.middlewares.prefix-rewrite.replacepathregex.replacement=/user/$1$2
```
라이브러리에서 요청하는 경로가 고정되어 있어
/grid, /cesium 경로로 요청이 들어오면 /user/grid, /user/cesium으로 변경해줘야 한다

### 그림자 기능
front/packages/user/src/hooks/useMapTool/useSettingTool.ts   
```javascript
const { viewer } = globeController;
if (!viewer) return;

if (on) {
    viewer.scene.shadowMap.enabled = true;
    viewer.scene.shadowMap.darkness = 0.5;
} else {
    viewer.scene.shadowMap.enabled = false;
}
```




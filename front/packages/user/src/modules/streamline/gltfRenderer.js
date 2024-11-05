import * as Cesium from "cesium";
import { colorRamp } from "@/modules/streamline/colorRamp.js";

export const gltfRenderer = (globeController) => {
    const { viewer } = globeController;

    const ramp = colorRamp("#0000ff", "#00ff00", "#ff0000", 8);

    const shaders = ramp.map((v) => {
        return new Cesium.CustomShader({
            translucencyMode: Cesium.CustomShaderTranslucencyMode.TRANSLUCENT,
            fragmentShaderText: `
                void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
                {
                    material.diffuse = vec3(${v.r}, ${v.g}, ${v.b});
                    material.alpha = 0.5; // custom alpha
                }
            `
        });
    });

    const generateUrls = (yearMonth, baseTimes, qValues) => {
        return yearMonth.flatMap(ym =>
            baseTimes.flatMap(time =>
                qValues.map(qValue =>
                    `/user/nc/${ym}/${ym}${time}_output/mnc.h000.${ym}${time}00.pisosurface.l0.q${qValue}.000000.p0.craw/isoSurface.gltf`
                )
            )
        );
    };

    const yearMonth = ["202308", "202402"];
    const baseTimes = ["0100", "0106", "0112", "0118", "0200", "0206", "0212", "0218", "0300", "0306", "0312", "0318"];
    const qValues = ["22", "23", "24", "25", "26", "27", "28", "29"];

    const dataSources = [];
    qValues.forEach(value => {
        dataSources.push(new Cesium.CustomDataSource(`temp-${value}`));
    });

    const urls = generateUrls(yearMonth, baseTimes, qValues);

    let heading = Cesium.Math.toRadians(-180);
    let pitch = Cesium.Math.toRadians(90);
    let roll = Cesium.Math.toRadians(0);
    let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

    let ort = Cesium.Transforms.headingPitchRollQuaternion(new Cesium.Cartesian3(), hpr);

    const baseTimeGroups = [];

    for (let k = 0; k < yearMonth.length; k++) {
        for (let i = 0; i < baseTimes.length; i++) {
            const group = []; // 각 baseTime마다 그룹으로 묶음
            group.id = `group-${yearMonth[k]}-${baseTimes[i]}`;
            for (let j = 0; j < qValues.length; j++) {
                const urlIndex = (k * i * qValues.length) + i * qValues.length + j;
                const entity = new Cesium.Entity({
                    position: new Cesium.Cartesian3(0, 0, 0),
                    model: {
                        uri: urls[urlIndex],
                        shadows: Cesium.ShadowMode.DISABLED,
                        colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
                        customShader: shaders[j],
                    },
                    show: false, // 초기에는 숨김 상태로 설정
                    orientation: ort,
                });
                group.push(entity);
                dataSources[j].entities.add(entity); // 개별 엔티티를 추가
            }
            baseTimeGroups.push(group);
        }
    }

    dataSources.forEach(ds => {
        viewer.dataSources.add(ds);
    });

    // 순차적으로 모델을 로드하는 함수
    const loadModelsSequentially = async (groups) => {
        for (const group of groups) {
            for (const entity of group) {
                entity.show = true;
                console.log(`Loaded model: ${entity.model.uri}`);
                await new Promise(resolve => setTimeout(resolve, 100)); // 로딩 사이 간격 추가
            }
        }
    };

    // 초기에 순차적 로딩 시작
    loadModelsSequentially(baseTimeGroups);

    let currentGroupIndex = 0;
    setInterval(() => {
        baseTimeGroups.forEach((group, index) => {
            const showGroup = index === currentGroupIndex;
            group.forEach(entity => (entity.show = showGroup));
        });
        console.log(baseTimeGroups[currentGroupIndex].id);
        currentGroupIndex = (currentGroupIndex + 1) % baseTimeGroups.length;
    }, 1000);
};

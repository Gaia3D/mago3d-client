import React, { ChangeEvent, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import RadioGroup from "@/components/modal/RadioGroup.tsx";
import {
    classifyAssetTypeAcceptFile,
    inputFormatOptions,
    outputFormatOptions,
    projectionTypeOptions
} from "@/components/utils/optionsData.ts";
import FileUpload from "@/components/modal/FileUpload.tsx";
import ToggleSetting from "@/components/modal/ToggleSetting.tsx";
import { useMutation, useQuery } from "@apollo/client";
import {
    Access,
    AssetStatusDocument,
    AssetType, CreateAssetInput, DatasetCreateAssetDocument,
    DatasetCreateProcessDocument, ProcessContextInput, T3DConvertInput, T3DFormatType
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import { UploadedFile } from "@/types/Common.ts";
import InputWithLabel from "@/components/modal/InputWithLabel.tsx";
import {assetsConvertingListState, assetsRefetchTriggerState} from "@/recoils/Assets.ts";
import { useSetRecoilState } from "recoil";

const ASSET_TYPE = "3dtile";

interface Tile3DContentProps {
    display: boolean;
}

interface ValidationType {
    isValid: boolean,
    message: string,
}

const initialOptions = {
    projectName: '',
    debugMode: false,
    inputFormat: T3DFormatType.Temp,
    outputFormat: 'auto',
    projectionType: 'epsg',
    crs: '',
    proj: '',
    projectionValue: '',
    yUpAxis: false,
    autoUpAxis: false,
    refineAdd: false,
    flipCoordinate: false,
    pngTexture: false,
    reverseTexCoord: false,
    inputType: '',
    maxCount: 1024,
    maxLod: 3,
    minLod: 0,
    maxPoints: 20000
};

const Tile3DContent: React.FC<Tile3DContentProps> = ({ display }) => {
    const [componentKey, setComponentKey] = useState(0);
    const setAssetsRefetchTrigger = useSetRecoilState(assetsRefetchTriggerState);
    const setAssetsConvertingListState = useSetRecoilState(assetsConvertingListState);
    const [options, setOptions] = useState(initialOptions);

    const handleOptionChange = useCallback((key: string, value: string | boolean | number) => {
        setOptions(prevOptions => ({ ...prevOptions, [key]: value }));
    }, []);

    const [showDetail, setShowDetail] = useState(false);
    const detailTitleRef = useRef<HTMLDivElement>(null);
    const fileUploadRef = useRef<{ readyUpload: () => Promise<UploadedFile[] | undefined> }>(null);
    const acceptFile = useMemo(() => classifyAssetTypeAcceptFile(ASSET_TYPE), []);

    const detailToggle = useCallback(() => {
        if (!detailTitleRef.current) return;
        detailTitleRef.current.classList.toggle("on");
        setShowDetail(detailTitleRef.current.classList.contains("on"));
    }, []);

    const [statusQuerySkip, setStatusQuerySkip] = useState(true);
    const [statusId, setStatusId] = useState('');

    const { data: statusData } = useQuery(AssetStatusDocument, {
        variables: { id: statusId },
        pollInterval: 5000,
        fetchPolicy: 'cache-and-network',
        skip: statusQuerySkip,
    });

    useEffect(() => {
        if (!statusQuerySkip) {
            setAssetsRefetchTrigger(prev => prev + 1);
        }
    }, [statusData, statusQuerySkip, setAssetsRefetchTrigger]);

    const [createAssetMutation] = useMutation(DatasetCreateAssetDocument, {
        onCompleted: async (data) => {
            const newStatusId = data.createAsset.id;
            setStatusId(newStatusId);
            await fileConvert(newStatusId);  // 성공 시 fileConvert를 호출합니다.
            setStatusQuerySkip(false);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
            alert('데이터 추가 중 오류가 발생했습니다.');
        },
    });

    const [createProcessMutation] = useMutation(DatasetCreateProcessDocument, {
        onCompleted: () => {
            resetOptions();
        },
        onError: (error) => {
            console.error('Process creation error:', error);
            alert('파일 변환 중 오류가 발생했습니다. 관리자에게 문의하세요.');
            resetOptions();
        },
    });

    const validation = (): ValidationType => {
        const checks = [
            { condition: !options.projectName, message: 'Project name' },
            { condition: options.inputFormat === T3DFormatType.Temp, message: 'Input format' },
            { condition: !options.projectionValue, message: 'origin projection' },
        ];

        for (const check of checks) {
            if (check.condition) {
                return {
                    isValid: false,
                    message: check.message,
                };
            }
        }

        return {
            isValid: true,
            message: '',
        };
    }

    const fileUpload = async () => {

        if (!validation().isValid) {
            alert(`${validation().message} 값을 확인해주세요.`);
            return;
        }

        const uploadedFilesResult = await fileUploadRef.current?.readyUpload();
        if (!uploadedFilesResult) return;

        setAssetsConvertingListState((prev) => {
            if (!prev.includes(ASSET_TYPE)) {
                return [...prev, ASSET_TYPE];
            }
            return prev;
        });

        const uploadId = uploadedFilesResult.map(uploadedFile => uploadedFile.dbId);
        await createAssetMutation({variables: { input: createAssetInput(uploadId) }});
    };

    const createAssetInput = useCallback((uploadId: string[]): CreateAssetInput => ({
        name: options.projectName,
        description: '사용자 추가 데이터입니다.',
        properties: undefined,
        assetType: AssetType.Tiles3D,
        enabled: true,
        access: Access.Private,
        uploadId
    }), [options.projectName]);



    const fileConvert = useCallback(async (id: string) => {
        const t3dValue: T3DConvertInput = {
            inputType: options.inputFormat,
            crs: options.projectionType === 'epsg' ? options.projectionValue : '',
            proj: options.projectionType !== 'epsg' ? options.projectionValue : '',
            reverseTexCoord: options.reverseTexCoord,
            pngTexture: options.pngTexture,
            yUpAxis: options.yUpAxis,
            refineAdd: options.refineAdd,
            maxCount: options.maxCount,
            maxLod: options.maxLod,
            minLod: options.minLod,
            maxPoints: options.maxPoints,
            flipCoordinate: options.flipCoordinate,
            autoUpAxis: options.autoUpAxis,
        };

        const input = {
            context: { t3d: t3dValue } as ProcessContextInput,
            name: options.projectName,
            source: { assetId: [id] }
        };
        console.log(input);
        await createProcessMutation({ variables: { input } });
    }, [options, createProcessMutation]);

    const resetOptions = useCallback(() => {
        setOptions(initialOptions); // options 상태를 초기화
        setComponentKey(prevKey => prevKey + 1); // 컴포넌트 재렌더링
        setAssetsConvertingListState((prev) => {
            if (prev.includes(ASSET_TYPE)) {
                return prev.filter(type => type !== ASSET_TYPE);
            }
            return prev;
        });
    }, []);

    return (
        <div key={componentKey} className={`modal-popup-body ${display ? "on" : "off"}`}>
            <InputWithLabel
                type="text"
                id="projectName"
                value={options.projectName}
                onChange={handleOptionChange}
                label="Project name"
            />
            <div className="title">Input format</div>
            <FormatList
                name="inputFormat"
                selected={options.inputFormat}
                onSelect={handleOptionChange}
                formats={inputFormatOptions[ASSET_TYPE]}
            />
            <div className="title">Output format</div>
            <FormatList
                name="outputFormat"
                selected={options.outputFormat}
                onSelect={handleOptionChange}
                formats={outputFormatOptions[ASSET_TYPE]}
            />
            <div className="title">Origin projection</div>
            <div className="value">
                <RadioGroup
                    name="projectionType"
                    value={options.projectionType}
                    onChange={handleOptionChange}
                    options={projectionTypeOptions}
                />
                <input
                    type="text"
                    className="modal-full-width"
                    value={options.projectionValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('projectionValue', e.target.value)}
                    placeholder={options.projectionType === 'epsg' ? "ex) 4326, 5186" : "ex) +proj=utm +zone=52 +datum=WGS84 +units=m +no_defs"}
                />
            </div>
            <div className="title detail-title" ref={detailTitleRef} onClick={detailToggle}>detail settings</div>
            <div className="value detail-show-value">
                {
                    showDetail ? (
                        <>
                            <ToggleSetting text="y축을 높이 축으로 설정" id="yUpAxis" checked={options.yUpAxis}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text="자동 높이 축 할당" id="autoUpAxis" checked={options.autoUpAxis}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text="x,y 좌표 뒤집기" id="flipCoordinate" checked={options.flipCoordinate}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text="구체화(Refine) 추가 모드" id="refineAdd" checked={options.refineAdd}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text="png 텍스쳐 모드" id="pngTexture" checked={options.pngTexture}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text="텍스쳐를 반대로" id="reverseTexCoord" checked={options.reverseTexCoord}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text="Debug Mode" id="debugMode" checked={options.debugMode}
                                           onChange={handleOptionChange}/>
                            <InputWithLabel label="노드 최대값" type="number" id="maxCount" value={options.maxCount}
                                            onChange={handleOptionChange} isDetail={true}/>
                            <InputWithLabel label="최대 LOD" type="number" id="maxLod" value={options.maxLod}
                                            onChange={handleOptionChange} isDetail={true}/>
                            <InputWithLabel label="최소 LOD" type="number" id="minLod" value={options.minLod}
                                            onChange={handleOptionChange} isDetail={true}/>
                            <InputWithLabel label="포인트 클라우드 데이터의 최대 포인트 수" type="number" id="maxPoints"
                                            value={options.maxPoints} onChange={handleOptionChange} isDetail={true}/>
                        </>
                    ) : (
                        <div className="detail-dot-value" onClick={detailToggle}>...</div>
                    )
                }
            </div>
            <div className="title">File upload</div>
            <div className="value">
                <FileUpload ref={fileUploadRef} acceptFile={acceptFile}/>
            </div>
            <div className="modal-bottom">
                <button onClick={fileUpload} type="button" className="button-full">Convert</button>
            </div>
        </div>
    );
};

export default Tile3DContent;

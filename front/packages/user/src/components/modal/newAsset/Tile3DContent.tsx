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
import {useRecoilState, useSetRecoilState} from "recoil";
import {stackAlertArrState} from "@/recoils/Spinner.ts";
import {useTranslation} from "react-i18next";

interface Tile3DContentProps {
    assetType: string;
    contentType: string;
}

interface ValidationType {
    isValid: boolean,
    message: string,
}

const initialOptions = {
    projectName: '',
    inputFormat: T3DFormatType.Fbx,
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

const Tile3DContent: React.FC<Tile3DContentProps> = ({ assetType, contentType }) => {
    const {t} = useTranslation();
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
    const acceptFile = useMemo(() => classifyAssetTypeAcceptFile(contentType), []);

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
            alert(t("error.data.add"));
            resetOptions();
        },
    });

    const [createProcessMutation] = useMutation(DatasetCreateProcessDocument, {
        onCompleted: () => {
            resetOptions();
        },
        onError: (error) => {
            console.error('Process creation error:', error);
            alert(t("error.file.convert"));
            resetOptions();
        },
    });

    const validation = (): ValidationType => {
        const checks = [
            { condition: !options.projectName, message: t("aside.common.project-name") },
            { condition: !options.projectionValue, message: t("aside.common.origin-projection") },
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
            alert(`${validation().message} ${t("alert.confirm-value")}`);
            return;
        }

        setAssetsConvertingListState((prev) => {
            if (!prev.includes(contentType)) {
                return [...prev, contentType];
            }
            return prev;
        });

        const uploadedFilesResult = await fileUploadRef.current?.readyUpload();
        if (!uploadedFilesResult) {
            setAssetsConvertingListState((prev) => {
                if (prev.includes(contentType)) {
                    return prev.filter(type => type !== contentType);
                }
                return prev;
            });
            return;
        }

        const uploadId = uploadedFilesResult.map(uploadedFile => uploadedFile.dbId);
        await createAssetMutation({variables: { input: createAssetInput(uploadId) }});
    };

    const createAssetInput = useCallback((uploadId: string[]): CreateAssetInput => ({
        name: options.projectName,
        description: t("aside.asset.description"),
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
        await createProcessMutation({ variables: { input } });
    }, [options, createProcessMutation]);

    const resetOptions = useCallback(() => {
        setOptions(initialOptions); // options 상태를 초기화
        setComponentKey(prevKey => prevKey + 1); // 컴포넌트 재렌더링
        setAssetsConvertingListState((prev) => {
            if (prev.includes(contentType)) {
                return prev.filter(type => type !== contentType);
            }
            return prev;
        });
    }, []);

    return (
        <div key={componentKey} className={`modal-popup-body ${assetType === contentType ? "on" : "off"}`}>
            <InputWithLabel
                type="text"
                id="projectName"
                value={options.projectName}
                onChange={handleOptionChange}
                label={t("aside.common.project-name")}
            />
            <div className="title">{t("aside.common.input-format")}</div>
            <FormatList
                name="inputFormat"
                selected={options.inputFormat}
                onSelect={handleOptionChange}
                formats={inputFormatOptions[contentType]}
            />
            <div className="title">{t("aside.common.output-format")}</div>
            <FormatList
                name="outputFormat"
                selected={options.outputFormat}
                onSelect={handleOptionChange}
                formats={outputFormatOptions[contentType]}
            />
            <div className="title">{t("aside.common.origin-projection")}</div>
            <div className="value">
                <RadioGroup
                    name="projectionType"
                    value={options.projectionType}
                    onChange={handleOptionChange}
                    options={projectionTypeOptions}
                    translate={true}
                />
                <input
                    type="text"
                    className="modal-full-width"
                    value={options.projectionValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('projectionValue', e.target.value)}
                    placeholder={options.projectionType === 'epsg' ? "ex) 4326, 5186" : "ex) +proj=utm +zone=52 +datum=WGS84 +units=m +no_defs"}
                />
            </div>
            <div className="title detail-title" ref={detailTitleRef} onClick={detailToggle}>{t("aside.common.detail-setting")}</div>
            <div className="value detail-show-value">
                {
                    showDetail ? (
                        <>
                            <ToggleSetting text={t("aside.asset.y-up-axis")} id="yUpAxis" checked={options.yUpAxis}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text={t("aside.asset.auto-up-axis")} id="autoUpAxis" checked={options.autoUpAxis}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text={t("aside.asset.flip-coordinate")} id="flipCoordinate" checked={options.flipCoordinate}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text={t("aside.asset.refine-add")} id="refineAdd" checked={options.refineAdd}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text={t("aside.asset.png-texture")} id="pngTexture" checked={options.pngTexture}
                                           onChange={handleOptionChange}/>
                            <ToggleSetting text={t("aside.asset.reverse-tex-coord")} id="reverseTexCoord" checked={options.reverseTexCoord}
                                           onChange={handleOptionChange}/>
                            <InputWithLabel label={t("aside.asset.max-count")} type="number" id="maxCount" value={options.maxCount}
                                            onChange={handleOptionChange} isDetail={true}/>
                            <InputWithLabel label={t("aside.asset.max-lod")} type="number" id="maxLod" value={options.maxLod}
                                            onChange={handleOptionChange} isDetail={true}/>
                            <InputWithLabel label={t("aside.asset.min-lod")} type="number" id="minLod" value={options.minLod}
                                            onChange={handleOptionChange} isDetail={true}/>
                            <InputWithLabel label={t("aside.asset.max-points")} type="number" id="maxPoints"
                                            value={options.maxPoints} onChange={handleOptionChange} isDetail={true}/>
                        </>
                    ) : (
                        <div className="detail-dot-value" onClick={detailToggle}>...</div>
                    )
                }
            </div>
            <div className="title">{t("aside.common.file-upload")}</div>
            <div className="value">
                <FileUpload ref={fileUploadRef} acceptFile={acceptFile}/>
            </div>
            <div className="modal-bottom">
                <button onClick={fileUpload} type="button" className="button-full">{t("aside.asset.convert")}</button>
            </div>
        </div>
    );
};

export default Tile3DContent;

import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import {
    classifyAssetTypeAcceptFile,
    inputFormatOptions,
    InterpolationTypeOptions,
    outputFormatOptions,
} from "@/components/utils/optionsData.ts";
import ToggleSetting from "@/components/modal/ToggleSetting.tsx";
import RadioGroup from "@/components/modal/RadioGroup.tsx";
import {UploadedFile} from "@/types/Common.ts";
import {useMutation, useQuery} from "@apollo/client";
import {
    Access,
    AssetStatusDocument,
    AssetType,
    CreateAssetInput,
    DatasetCreateAssetDocument,
    DatasetCreateProcessDocument,
    InputMaybe,
    InterpolationType,
    ProcessContextInput, ProcessTaskStatus,
    Scalars,
    T3DConvertInput,
    T3DFormatType,
    TerrainConvertInput
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import {useRecoilState, useSetRecoilState} from "recoil";
import {assetsConvertingListState, assetsRefetchTriggerState} from "@/recoils/Assets.ts";
import FileUpload from "@/components/modal/FileUpload.tsx";
import {useTranslation} from "react-i18next";
import {newTerrainCountState} from "@/recoils/MainMenuState.tsx";

interface TerrainContentProps {
    assetType: string;
    contentType: string;
}

interface ValidationType {
    isValid: boolean,
    message: string,
}

const initialOptions = {
    projectName: '',
    inputFormat: 'auto',
    outputFormat: 'auto',
    interpolationType: InterpolationType.Bilinear,
    calculateNormals: false,
    minDepth: 0,
    maxDepth: 12,
}

const TerrainContent:React.FC<TerrainContentProps> = ({assetType, contentType}) => {
    const {t} = useTranslation();
    const [componentKey, setComponentKey] = useState(0);
    const [newTerrainCount, setNewTerrainCount] = useRecoilState(newTerrainCountState);
    const setAssetsRefetchTrigger = useSetRecoilState(assetsRefetchTriggerState);
    const setAssetsConvertingListState = useSetRecoilState(assetsConvertingListState);
    const [options, setOptions] = useState(initialOptions);

    const handleOptionChange = useCallback((key: string, value: string | boolean | number) => {
        setOptions(prevOptions => ({ ...prevOptions, [key]: value }));
    }, []);

    const fileUploadRef = useRef<{ readyUpload: () => Promise<UploadedFile[] | undefined> }>(null);
    const acceptFile = useMemo(() => classifyAssetTypeAcceptFile(contentType), []);
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
            if (statusData?.asset?.status === ProcessTaskStatus.Done) {
                setNewTerrainCount((prev) => prev + 1);
            }
        }
    }, [statusData, statusQuerySkip, setAssetsRefetchTrigger]);

    const validation = (): ValidationType => {
        const checks = [
            { condition: !options.projectName, message: t("aside.common.project-name") },
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

    const [createAssetMutation] = useMutation(DatasetCreateAssetDocument, {
        onCompleted: async (data) => {
            const newStatusId = data.createAsset.id;
            setStatusId(newStatusId);
            await fileConvert(newStatusId);
            setStatusQuerySkip(false);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
            alert(t("error.data.add"));
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

    const createAssetInput = useCallback((uploadId: string[]): CreateAssetInput => ({
        name: options.projectName,
        description: t("aside.asset.description"),
        properties: undefined,
        assetType: AssetType.Terrain,
        enabled: true,
        access: Access.Private,
        uploadId
    }), [options.projectName]);

    const fileConvert = useCallback(async (id: string) => {
        const terrainValue: TerrainConvertInput = {
            calculateNormals: options.calculateNormals,
            interpolationType: options.interpolationType,
            maxDepth: options.maxDepth,
            minDepth: options.minDepth,
        };

        const input = {
            context: { terrain: terrainValue } as ProcessContextInput,
            name: options.projectName,
            source: { assetId: [id] }
        };
        await createProcessMutation({ variables: { input } });
    }, [options, createProcessMutation]);

    return (
        <div key={componentKey} className={`modal-popup-body ${assetType === contentType ? "on" : "off"}`}>
            <div className="title">{t("aside.common.project-name")}</div>
            <div className="value">
                <input
                    type="text"
                    className="modal-full-width"
                    value={options.projectName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('projectName', e.target.value)}
                />
            </div>
            <div className="title">{t("aside.common.input-format")}</div>
            <FormatList
                name="inputFormat"
                selected={options.inputFormat}
                onSelect={handleOptionChange}
                formats={inputFormatOptions['terrain']}
            />
            <div className="title">{t("aside.common.output-format")}</div>
            <FormatList
                name="outputFormat"
                selected={options.outputFormat}
                onSelect={handleOptionChange}
                formats={outputFormatOptions['terrain']}
            />
            <div className="title">{t("aside.asset.min-tile-depth")}</div>
            <div className="value">
                <input
                    type="number"
                    className="width-140"
                    value={options.minDepth}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('minDepth', Number(e.target.value))}
                />
            </div>
            <div className="title">{t("aside.asset.max-tile-depth")}</div>
            <div className="value">
                <input
                    type="number"
                    className="width-140"
                    value={options.maxDepth}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('maxDepth', Number(e.target.value))}
                />
            </div>
            <div className="title">{t("aside.asset.interpolation-type")}</div>
            <div className="value">
                <RadioGroup
                    name="interpolationType"
                    value={options.interpolationType}
                    onChange={handleOptionChange}
                    options={InterpolationTypeOptions}
                />
            </div>
            <div className="title">{t("aside.asset.normal-calculation")}</div>
            <ToggleSetting
                id="calculateNormals"
                checked={options.calculateNormals}
                onChange={handleOptionChange}
            />

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

export default TerrainContent;
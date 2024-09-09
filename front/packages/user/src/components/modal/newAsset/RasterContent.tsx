import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import {classifyAssetTypeAcceptFile, inputFormatOptions, outputFormatOptions} from "@/components/utils/optionsData.ts";
import FileUpload from "@/components/modal/FileUpload.tsx";
import {useSetRecoilState} from "recoil";
import {assetsConvertingListState, assetsRefetchTriggerState} from "@/recoils/Assets.ts";
import {UploadedFile} from "@/types/Common.ts";
import {useMutation, useQuery} from "@apollo/client";
import {
    Access, Type,
    AssetStatusDocument, AssetType, CogConvertInput, CreateAssetInput,
    DatasetCreateAssetDocument,
    DatasetCreateProcessDocument, ProcessContextInput, TiffConvertInput,
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import ToggleSetting from "@/components/modal/ToggleSetting.tsx";
import {useTranslation} from "react-i18next";

interface RasterContentProps {
    assetType: string;
    contentType: string;
}

interface ValidationType {
    isValid: boolean,
    message: string,
}

const initialOptions = {
    projectName: '',
    inputFormat: AssetType.Imagery,
    outputFormat: '' as Type,
    originProjection: '',
    convertedProjection: '',
    tiled: false,               // 타일 여부
    overviews: false,           // 오버뷰
}

const RasterContent:React.FC<RasterContentProps> = ({assetType, contentType}) => {
    const {t} = useTranslation();
    const [componentKey, setComponentKey] = useState(0);
    const setAssetsRefetchTrigger = useSetRecoilState(assetsRefetchTriggerState);
    const setAssetsConvertingListState = useSetRecoilState(assetsConvertingListState);
    const [options, setOptions] = useState(initialOptions);

    const handleOptionChange = useCallback((key: string, value: string | boolean | number | undefined) => {
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
        assetType: options.inputFormat,
        enabled: true,
        access: Access.Private,
        uploadId
    }), [options.projectName, options.inputFormat]);

    const fileConvert = useCallback(async (id: string) => {

        if (options.inputFormat === AssetType.Imagery) {
            const tiffValue: TiffConvertInput = {
                // ot: options.outputFormat ?? undefined ,
                sourceSrs: options.originProjection,
                targetSrs: options.convertedProjection
            };

            const input = {
                context: { warp: tiffValue } as ProcessContextInput,
                name: options.projectName,
                source: { assetId: [id] }
            };
            console.log(input);
            await createProcessMutation({ variables: { input } });
        } else if (options.inputFormat === AssetType.Cog) {
            const cogValue: CogConvertInput = {
                overviews: options.overviews,
                tiled: options.tiled
            };

            const input = {
                context: { terrain: cogValue } as ProcessContextInput,
                name: options.projectName,
                source: { assetId: [id] }
            };
            await createProcessMutation({ variables: { input } });
        }

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
                formats={inputFormatOptions['raster']}
            />

            {
                options.inputFormat === AssetType.Imagery ? (
                    <>
                        <div className="title">{t("aside.common.output-format")}</div>
                        <FormatList
                            name="outputFormat"
                            selected={options.outputFormat}
                            onSelect={handleOptionChange}
                            formats={outputFormatOptions['raster']}
                        />
                        <div className="title">{t("aside.common.origin-projection")}</div>
                        <div className="value">
                            <input
                                type="text"
                                className="width-140"
                                value={options.originProjection}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('originProjection', e.target.value)}
                                placeholder="ex) 4326, 5186"
                            />
                        </div>
                        <div className="title">{t("aside.common.converted-projection")}</div>
                        <div className="value">
                            <input
                                type="text"
                                className="width-140"
                                value={options.convertedProjection}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('convertedProjection', e.target.value)}
                                placeholder="ex) 4326, 5186"
                            />
                        </div>
                    </>

                ) : (
                    <>
                        <div className="title">{t("aside.common.output-format")}</div>
                        <ul className="format-list">
                            <li className="selected">AUTO</li>
                        </ul>
                        <div className="title">{t("aside.asset.tile-status")}</div>
                        <ToggleSetting
                            id="tiled"
                            checked={options.tiled}
                            onChange={handleOptionChange}
                        />
                        <div className="title">{t("aside.asset.overview-status")}</div>
                        <ToggleSetting
                            id="overviews"
                            checked={options.overviews}
                            onChange={handleOptionChange}
                        />
                    </>
                )
            }

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

export default RasterContent;
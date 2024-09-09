import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import {classifyAssetTypeAcceptFile, inputFormatOptions, outputFormatOptions} from "@/components/utils/optionsData.ts";
import FileUpload from "@/components/modal/FileUpload.tsx";
import {UploadedFile} from "@/types/Common.ts";
import {useMutation, useQuery} from "@apollo/client";
import {
    Access,
    AssetStatusDocument,
    AssetType, CreateAssetInput,
    DatasetCreateAssetDocument,
    DatasetCreateProcessDocument, ProcessContextInput, ShpConvertInput, ShpConvertOutputInput, T3DConvertInput
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import {useSetRecoilState} from "recoil";
import {assetsConvertingListState, assetsRefetchTriggerState} from "@/recoils/Assets.ts";
import {useTranslation} from "react-i18next";

interface VectorContentProps {
    assetType: string;
    contentType: string;
}

interface ValidationType {
    isValid: boolean,
    message: string,
}

const initialOptions = {
    projectName: '',
    inputFormat: AssetType.GeoJson,
    outputFormat: 'auto',
    originEncoding: 'UTF-8',
    convertedEncoding: 'UTF-8',
    originProjection: '',
    convertedProjection: '',
}

const VectorContent:React.FC<VectorContentProps> = ({assetType, contentType}) => {
    const {t} = useTranslation();
    const [componentKey, setComponentKey] = useState(0);
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
        }
    }, [statusData, statusQuerySkip, setAssetsRefetchTrigger]);

    const [createAssetMutation] = useMutation(DatasetCreateAssetDocument, {
        onCompleted: async (data) => {
            const newStatusId = data.createAsset.id;
            setStatusId(newStatusId);
            await fileConvert(newStatusId);
            resetOptions();
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

    const validation = (): ValidationType => {
        const checks = [
            { condition: !options.projectName, message: t("aside.common.project-name") },
            // { condition: !options.originEncoding, message: 'Origin Encoding' },
            // { condition: !options.convertedEncoding, message: 'Converted Encoding' },
            // { condition: !options.originProjection, message: 'Origin Projection' },
            // { condition: !options.convertedProjection, message: 'Converted Projection' },
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
        assetType: options.inputFormat,
        enabled: true,
        access: Access.Private,
        uploadId
    }), [options.projectName, options.inputFormat]);

    const fileConvert = useCallback(async (id: string) => {
        const shpValue: ShpConvertInput = {
            // layerType: options.inputFormat,
            sourceCharset: options.originEncoding,
            sourceSrs: options.originProjection,
            targetCharset: options.convertedEncoding,
            targetSrs: options.convertedProjection
        };

        const input = {
            context: { ogr2ogr: shpValue } as ProcessContextInput,
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
                formats={inputFormatOptions['vector']}
            />
            <div className="title">{t("aside.common.output-format")}</div>
            <FormatList
                name="outputFormat"
                selected={options.outputFormat}
                onSelect={handleOptionChange}
                formats={outputFormatOptions['vector']}
            />
            <div className="title">{t("aside.common.origin-encoding")}</div>
            <div className="value">
                <input
                    type="text"
                    className="width-140"
                    value={options.originEncoding}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('originEncoding', e.target.value)}
                />
            </div>
            <div className="title">{t("aside.common.converted-encoding")}</div>
            <div className="value">
                <input
                    type="text"
                    className="width-140"
                    value={options.convertedEncoding}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('convertedEncoding', e.target.value)}
                />
            </div>
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

export default VectorContent;
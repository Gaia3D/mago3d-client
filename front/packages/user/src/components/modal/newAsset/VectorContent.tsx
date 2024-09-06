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
    inputFormat: AssetType.Terrain,
    outputFormat: 'auto',
    originEncoding: 'UTF-8',
    convertedEncoding: 'UTF-8',
    originProjection: '',
    convertedProjection: '',
}

const VectorContent:React.FC<VectorContentProps> = ({assetType, contentType}) => {
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

            if (options.inputFormat === AssetType.Shp) {
                const newStatusId = data.createAsset.id;
                setStatusId(newStatusId);
                await fileConvert(newStatusId);
            } else if (options.inputFormat === AssetType.GeoJson) {
                resetOptions();
            }
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
            { condition: options.inputFormat === AssetType.Terrain, message: 'Input Format' },
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
            alert(`${validation().message} 값을 확인해주세요.`);
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
        description: '사용자 추가 데이터입니다.',
        properties: undefined,
        assetType: options.inputFormat,
        enabled: true,
        access: Access.Private,
        uploadId
    }), [options.projectName]);

    const fileConvert = useCallback(async (id: string) => {
        const shpValue: ShpConvertInput = {
            layerType: options.inputFormat,
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
            <div className="title">Project name</div>
            <div className="value">
                <input
                    type="text"
                    className="modal-full-width"
                    value={options.projectName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('projectName', e.target.value)}
                />
            </div>
            <div className="title">Input format</div>
            <FormatList
                name="inputFormat"
                selected={options.inputFormat}
                onSelect={handleOptionChange}
                formats={inputFormatOptions['vector']}
            />
            <div className="title">Output format</div>
            <FormatList
                name="outputFormat"
                selected={options.outputFormat}
                onSelect={handleOptionChange}
                formats={outputFormatOptions['vector']}
            />

            {
                options.inputFormat === AssetType.Shp && (
                    <>
                        <div className="title">Origin Encoding</div>
                        <div className="value">
                            <input
                                type="text"
                                className="width-140"
                                value={options.originEncoding}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('originEncoding', e.target.value)}
                            />
                        </div>
                        <div className="title f-size-12">Converted Encoding</div>
                        <div className="value">
                            <input
                                type="text"
                                className="width-140"
                                value={options.convertedEncoding}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('convertedEncoding', e.target.value)}
                            />
                        </div>
                        <div className="title">Origin Projection</div>
                        <div className="value">
                            <input
                                type="text"
                                className="width-140"
                                value={options.originProjection}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('originProjection', e.target.value)}
                                placeholder="ex) 4326, 5186"
                            />
                        </div>
                        <div className="title f-size-12">Converted Projection</div>
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
                )

            }
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

export default VectorContent;
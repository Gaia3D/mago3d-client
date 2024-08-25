import React, {ChangeEvent, useRef, useState} from 'react';
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
import {useMutation} from "@apollo/client";
import {AssetType, CreateAssetInput, DatasetCreateAssetDocument} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import {UploadedFile} from "@/types/Common.ts";
import {useSetRecoilState} from "recoil";
import {assetsRefetchTriggerState} from "@/recoils/Data.ts";

const ASSET_TYPE = "3dtile";

const Tile3DContent = () => {
    const setAssetsRefetchTrigger = useSetRecoilState<number>(assetsRefetchTriggerState);
    const [options, setOptions] = useState({
        projectName: '',
        debugMode: false,
        inputPath: '',
        outputPath: '',
        inputFormat: 'auto',
        outputFormat: 'auto',
        projectionType: 'epsg',
        projectionValue: '',
        swapUpAxis: false,
        flipUpAxis: false,
    });

    const handleOptionChange = (key: string, value: string | boolean) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            [key]: value,
        }));
    };

    const [showDetail, setShowDetail] = useState(false);
    const detailTitleRef = useRef<HTMLDivElement>(null);
    const fileUploadRef = useRef<{ readyUpload: () => Promise<UploadedFile[] |undefined> }>(null);

    const acceptFile = classifyAssetTypeAcceptFile(ASSET_TYPE);

    const detailToggle = () => {
        if (!detailTitleRef.current) return;
        detailTitleRef.current.classList.toggle("on");
        setShowDetail(detailTitleRef.current.classList.contains("on"));
    }

    const [createMutation] = useMutation(DatasetCreateAssetDocument, {
        update: (cache, { data }) => {
            cache.evict({ fieldName: 'assets' });
        },
        onCompleted(data) {
            console.log('complete data:',data);
            setAssetsRefetchTrigger((prev) => prev + 1);
        }
    });

    const fileConvert = async () => {
        try {
            const uploadedFilesResult = await fileUploadRef.current?.readyUpload();
            console.log("uploadedFilesResult", uploadedFilesResult);
            if (!uploadedFilesResult || uploadedFilesResult.length === 0) {
                alert('파일 업로드에 실패했습니다. 관리자에게 문의 바랍니다.');
                return;
            }

            const uploadId = uploadedFilesResult.map((uploadedFile) => uploadedFile.dbId);
            console.log('uploadId: ', uploadId);

            const input: CreateAssetInput = {
                name: options.projectName,
                groupId: ["91"],    // Sample1
                description: '사용자 추가 데이터입니다.',
                assetType: AssetType.Tiles3D,
                uploadId
            };
            console.log(input);
            await createMutation({
                variables: { input }
            });
        } catch (error) {
            console.error('ApolloError:', error);
            alert('데이터 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
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
                            <ToggleSetting text="Swap Up Axis" id="swapUpAxis" checked={options.swapUpAxis} onChange={handleOptionChange} />
                            <ToggleSetting text="Flip Up Axis" id="flipUpAxis" checked={options.flipUpAxis} onChange={handleOptionChange} />
                            <ToggleSetting text="Debug Mode" id="debugMode" checked={options.debugMode} onChange={handleOptionChange} />
                        </>
                    ) : (
                        <div className="detail-dot-value" onClick={detailToggle}>...</div>
                    )
                }
            </div>
            <div className="title">File upload</div>
            <div className="value">
                <FileUpload ref={fileUploadRef} acceptFile={acceptFile} />
            </div>
            <div className="modal-bottom">
                <button onClick={fileConvert} type="button" className="button-full">Convert</button>
            </div>
        </>
    );
};

export default Tile3DContent;
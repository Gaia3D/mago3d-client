import React, { memo, useState, useEffect } from 'react';
import { dataFormatter } from "@mnd/shared";
import { Asset } from "@/types/assets/Data.ts";
import {
    AssetForDownloadConvertFileDocument, AssetForDownloadOriginFileDocument, AssetType, DatasetDeleteAssetDocument,
    DatasetProcessLogDocument,
    ProcessTaskStatus
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import { statusMap } from "@/components/aside/asset/AsideAssets.tsx";
import { useLazyQuery, useMutation } from "@apollo/client";
import {LayerAccess, LayerAssetType} from "@/types/layerset/gql/graphql.ts";
import {LayersetCreateAssetDocument} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useRecoilState, useSetRecoilState} from "recoil";
import {newLayerCountState} from "@/recoils/MainMenuState.tsx";

type AssetRowProps = {
    item: Asset;
    onDelete: (id: string) => void;
};

const formatStatus = (status: ProcessTaskStatus | null | undefined): string => {
    if (status === null || status === undefined) {
        return ProcessTaskStatus.None;
    }
    return statusMap[status] || status;
};

type ConvertedFile = {
    __typename?: "ConvertedFile" | undefined;
    id: string;
    taskId: string;
    filename: string;
    contentType: string;
    contentSize: number;
    download?: string | null | undefined;
    filepath?: string | null | undefined;
};

const downloadByUrlArr = (urlArr: ConvertedFile[]) => {
    if (urlArr.length > 0) {
        urlArr.forEach((fileData) => {
            if (!fileData.download) return;
            const link = document.createElement('a');
            link.href = fileData.download;
            link.download = fileData.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
};

interface PublishContextValue {
    [key: string]: {
        dataAssetId: string;
    };
}

type CreateAssetInput  = {
    name: string;
    groupIds: string[];
    access: LayerAccess;
    type: LayerAssetType;
    context: PublishContextValue;
    enabled: boolean;
    visible: boolean;
}

const AssetRow: React.FC<AssetRowProps> = memo(({ item, onDelete }) => {
    const [getLogData, { data: logData }] = useLazyQuery(DatasetProcessLogDocument);
    const [showLog, setShowLog] = useState(false);

    const [getOriginFileData, { data: originFileData }] = useLazyQuery(AssetForDownloadOriginFileDocument);
    const [downOriginFile, setDownOriginFile] = useState(false);

    const [getConvertFileData, { data: convertFileData }] = useLazyQuery(AssetForDownloadConvertFileDocument);
    const [downConvertFile, setDownConvertFile] = useState(false);

    const [deleteMutation] = useMutation(DatasetDeleteAssetDocument);
    const [createLayerMutation] = useMutation(LayersetCreateAssetDocument);
    const setNewLayerCount = useSetRecoilState(newLayerCountState);

    const showAssetLog = (id: string) => {
        getLogData({
            variables: { assetId: id }
        });
        setShowLog(true);
    };

    useEffect(() => {
        if (showLog && logData) {
            console.log(logData);
        }
    }, [showLog, logData]);

    const downAsset = (id: string) => {
        getConvertFileData({
            variables: { id: id }
        });
        setDownConvertFile(true);
    };

    useEffect(() => {
        if (downConvertFile && convertFileData) {
            const fileUrlArr = convertFileData?.asset?.convertedFiles;
            if (fileUrlArr) {
                const validFiles = fileUrlArr.filter((file): file is ConvertedFile => file !== null && file !== undefined);
                downloadByUrlArr(validFiles);
            }
            setDownConvertFile(false);
        }
    }, [downConvertFile, convertFileData]);

    const deleteAsset = (id: string, name: string) => {
        console.log("delete ", id);
        if (window.confirm(`데이터 ${name}을 삭제하시겠습니까?`)) {
            deleteMutation({ variables: { id } })
                .then(() => {
                    alert('삭제되었습니다.');
                    onDelete(id);
                });
        }
    };

    const publishAsset = (id: string, type: string, name: string) => {
        confirm (`${name} 데이터를 레이어로 발행하시겠습니까?`)

        const data: CreateAssetInput = {
            name,
            groupIds: ['76'],
            access: LayerAccess.Private,
            enabled: true,
            visible: true,
            type: LayerAssetType.Vector,
            context: {},
        };

        const typeMapping: Record<string, { assetType: LayerAssetType; contextKey: string }> = {
            [AssetType.Shp]: { assetType: LayerAssetType.Vector, contextKey: "feature" },
            [AssetType.Tiles3D]: { assetType: LayerAssetType.Tiles3D, contextKey: "t3d" },
            [AssetType.Cog]: { assetType: LayerAssetType.Cog, contextKey: "cog" },
            [AssetType.Imagery]: { assetType: LayerAssetType.Raster, contextKey: "coverage" },
        };

        const selectedType = typeMapping[type];

        if (!selectedType) {
            alert("지원 되지 않는 확장자입니다.");
            return;
        }

        data.type = selectedType.assetType;
        data.context[selectedType.contextKey] = { dataAssetId: id };  // context 속성에 올바른 값 할당

        createLayerMutation({ variables: { input: data } })
            .then(() => {
                alert('성공적으로 발행되었습니다.');
                setNewLayerCount((prev) => prev + 1);
            })
            .catch(e => {
                console.error(e);
                alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
            });
    };

    if (! item || !item.id || !item.name) {
        console.error("Error. Check Asset ID");
        return (
            <tr>
                <td colSpan={4}>잘못된 데이터</td>
            </tr>
        );
    }
    const status = formatStatus(item.status);
    return (
        <tr>
            <td>{item.assetType}</td>
            <td>
                <div className="name">{item.name}</div>
                <div className="date clear">
                    {(() => {
                        try {
                            return dataFormatter(
                                item.updatedAt ?? new Date().toISOString(),
                                "YYYY-MM-DD HH:mm:ss"
                            );
                        } catch (error) {
                            console.error("Error formatting date:", error);
                            return "";
                        }
                    })()}
                </div>
            </td>
            <td>
                <button type="button" className={`status-button ${status}`}>{status}</button>
            </td>
            <td>
                {status === "success" || status === "none" ? (
                    <button type="button" onClick={() => publishAsset(item.id, item.assetType, item.name)} className="function-button publish"></button>
                ) : (
                    <button type="button" onClick={() => showAssetLog(item.id)} className="function-button log"></button>
                )}
                <button type="button" onClick={() => downAsset(item.id)} className="function-button down"></button>
                <button type="button" onClick={() => deleteAsset(item.id, item.name)} className="function-button delete"></button>
            </td>
        </tr>
    );
});

AssetRow.displayName = 'AssetRow';
export default AssetRow;

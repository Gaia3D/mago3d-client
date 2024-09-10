import React, { memo, useState, useEffect } from 'react';
import { dataFormatter } from "@mnd/shared";
import {
    AssetForDownloadConvertFileDocument,
    AssetForDownloadOriginFileDocument,
    AssetType,
    ConvertedFile,
    DatasetDeleteAssetDocument,
    DatasetProcessLogDocument,
    ProcessTaskStatus
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import { statusMap } from "@/components/aside/asset/AsideAssets.tsx";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
    CreateAssetInput, LayerAccess, LayerAssetType,
    LayersetCreateAssetDocument, PublishContextValue
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { useSetRecoilState} from "recoil";
import {newLayerCountState} from "@/recoils/MainMenuState.tsx";
import {Asset} from "@/types/assets/Data.ts";
import {useTranslation} from "react-i18next";

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

// 백엔드 개발 후 한번에 다운 받을 수 있도록 수정
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

const AssetRow: React.FC<AssetRowProps> = memo(({ item, onDelete }) => {
    const {t} = useTranslation();
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
        if (confirm(t("confirm.asset.delete"))) {
            deleteMutation({ variables: { id } })
                .then(() => {
                    alert(t("success.asset.delete"));
                    onDelete(id);
                });
        }
    };

    const publishAsset = (id: string, type: string, name: string) => {
        if (!confirm(t("confirm.asset.layer"))) return;


        const typeMapping: Record<string, { assetType: LayerAssetType; contextKey: keyof PublishContextValue }> = {
            [AssetType.Tiles3D]: { assetType: LayerAssetType.Tiles3D, contextKey: "t3d" },
            [AssetType.Shp]: { assetType: LayerAssetType.Vector, contextKey: "feature" },
            [AssetType.GeoJson]: { assetType: LayerAssetType.Vector, contextKey: "feature" },
            [AssetType.Imagery]: { assetType: LayerAssetType.Raster, contextKey: "coverage" },
            [AssetType.Cog]: { assetType: LayerAssetType.Cog, contextKey: "cog" },
        };

        const selectedType = typeMapping[type];

        if (!selectedType) {
            alert(t("error.asset.file"));
            return;
        }

        const data: CreateAssetInput = {
            name,
            groupIds: ['0'],
            access: LayerAccess.Private,
            enabled: true,
            visible: true,
            type: selectedType.assetType,
            context: {
                [selectedType.contextKey]: { dataAssetId: id }
            },
        };

        createLayerMutation({ variables: { input: data } })
            .then(() => {
                alert(t("success.asset.publish"));
                setNewLayerCount((prev) => prev + 1);
            })
            .catch(e => {
                console.error(e);
                alert(t("error.admin"));
            });
    };
    if (! item || !item.id || !item.name) {
        console.error("Error. Check Asset ID");
        return (
            <tr>
                <td colSpan={4}>{t("aside.common.wrong-data")}</td>
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

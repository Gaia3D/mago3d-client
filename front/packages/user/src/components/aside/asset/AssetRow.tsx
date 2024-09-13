import React, { memo, useState, useEffect } from 'react';
import { dataFormatter } from "@mnd/shared";
import {
    AssetForDownloadOriginFileDocument,
    AssetType,
    DatasetDeleteAssetDocument,
    DatasetProcessLogDocument,
    ProcessTaskStatus
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import { statusMap } from "@/components/aside/asset/AsideAssets.tsx";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
    AppendUserLayerInput,
    CreateAssetInput,
    CreateLayerGroupDocument, GroupByIdDocument,
    LayerAccess,
    LayerAssetType, LayersetAppendUserLayerDocument, LayersetAssetDocument,
    LayersetCreateAssetDocument, Maybe,
    PublishContextValue, Scalars, UserLayerAsset, UserLayerGroup,
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useRecoilState, useSetRecoilState} from "recoil";
import {newLayerCountState} from "@/recoils/MainMenuState.tsx";
import {Asset} from "@/types/assets/Data.ts";
import {useTranslation} from "react-i18next";
import {layersState, terrainState, UserLayerGroupState} from "@/recoils/Layer.ts";
import axios from 'axios';
import Keycloak from "keycloak-js";
import keycloak from "@/api/keycloak.js";

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


const downloadFile = async (url: string, fileName: string, token: string) => {
    try {
        const response = await axios.get(url, {
            responseType: 'blob', // 파일 데이터를 받을 때는 blob 타입으로 설정
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Blob 생성 시 MIME 타입을 설정
        const urlBlob = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};

const readyDownload = async (fileName: string, url: string, keycloak: Keycloak) => {
    try {
        const token = keycloak.token;
        if (!token) {
            throw new Error('Token is not available');
        }
        await downloadFile(url, fileName, token);
    } catch (error) {
        console.error('Failed to download file:', error);
    }
};

const AssetRow: React.FC<AssetRowProps> = memo(({ item, onDelete }) => {
    const {t} = useTranslation();
    const [getLogData, { data: logData }] = useLazyQuery(DatasetProcessLogDocument);
    const [showLog, setShowLog] = useState(false);
    const [userTerrains, setUserTerrains] = useRecoilState(terrainState);

    const [getOriginFileData, { data: originFileData }] = useLazyQuery(AssetForDownloadOriginFileDocument);
    const [downOriginFile, setDownOriginFile] = useState(false);

    const [getGroupData, { data: groupData }] = useLazyQuery(GroupByIdDocument);
    const [getAssetData, { data: assetData }] = useLazyQuery(LayersetAssetDocument);
    const [deleteMutation] = useMutation(DatasetDeleteAssetDocument);
    const [createLayerGroupMutation] = useMutation(CreateLayerGroupDocument);
    const [createLayerMutation] = useMutation(LayersetCreateAssetDocument);
    const [appendLayerMutation] = useMutation(LayersetAppendUserLayerDocument);
    const setNewLayerCount = useSetRecoilState(newLayerCountState);
    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
    const setLayers = useSetRecoilState<UserLayerAsset[]>(layersState);

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
        getOriginFileData({
            variables: { id: id }
        });
        setDownOriginFile(true);
    };

    useEffect(() => {
        if (downOriginFile && originFileData) {
            const { asset } = originFileData;
            setDownOriginFile(false);
            if (asset?.download) readyDownload(asset.name, asset.download, keycloak);
        }
    }, [downOriginFile, originFileData]);

    const deleteAsset = (id: string, type: string, name: string) => {
        if (confirm(t("confirm.asset.delete"))) {
            deleteMutation({ variables: { id } })
                .then(() => {
                    if ( type === AssetType.Terrain) {
                        const currentTerrain = userTerrains.filter(terrain => terrain?.id !== id );
                        setUserTerrains(currentTerrain);
                    }
                    alert(t("success.asset.delete"));
                    onDelete(id);
                });
        }
    };

    const publishAsset = async (id: string, type: string, name: string) => {
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

        const { data: existingGroupData } = await getGroupData({ variables: { id: '0' } });

        if (!existingGroupData?.group) {
            await createLayerGroupMutation({
                variables: { input: { access: LayerAccess.Public, name: 'User Layer', order: 0, published: true } }
            });
        }

        const input: CreateAssetInput = {
            name,
            groupIds: ['0'],
            access: LayerAccess.Private,
            enabled: true,
            visible: true,
            type: selectedType.assetType,
            context: { [selectedType.contextKey]: { dataAssetId: id } },
        };

        try {
            const newLayer =  await createLayerMutation({ variables: { input } });
            const newAsset = newLayer.data?.createAsset
            if (!newAsset) return;

            const appendInput: AppendUserLayerInput = {
                groupId: '0',
                assetId: newAsset.id
            }
            await appendLayerMutation({variables: {input : appendInput}})

            const layerAsset = await getAssetData({ variables: { id: newAsset.id } });

            const updateAsset: UserLayerAsset = {
                type: selectedType.assetType,
                access: LayerAccess.Private,
                assetId: newAsset.id,
                createdAt: newAsset.createdAt,
                createdBy: newAsset.createdBy,
                description: newAsset.description,
                enabled: newAsset.enabled,
                id: newAsset.id,
                properties: layerAsset.data?.asset.properties,
                name: newAsset.name,
                visible: true
            }

            const updatedLayerGroups = userLayerGroups.map(group => {
                if (group?.groupId === '0') {
                    return {
                        ...group, // 객체를 복사하여 수정 가능하게 만듭니다.
                        assets: [...group.assets, updateAsset] // 배열도 복사 후 새로운 asset을 추가합니다.
                    };
                }
                return group;
            });

            setUserLayerGroups(updatedLayerGroups);

            const tempLayers = updatedLayerGroups.flatMap(group => group?.assets ?? []);
            setLayers(tempLayers);

            alert(t("success.asset.publish"));
            setNewLayerCount(prev => prev + 1);
        } catch (e) {
            console.error(e);
            alert(t("error.admin"));
        }
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
                    item.assetType !== AssetType.Terrain &&
                    <button type="button" onClick={() => publishAsset(item.id, item.assetType, item.name)}
                            className="function-button publish"></button>
                ) : (
                    <button type="button" onClick={() => showAssetLog(item.id)}
                            className="function-button log"></button>
                )}
                <button type="button" onClick={() => downAsset(item.id)} className="function-button down"></button>
                <button type="button" onClick={() => deleteAsset(item.id, item.assetType, item.name)} className="function-button delete"></button>
            </td>
        </tr>
    );
});

AssetRow.displayName = 'AssetRow';
export default AssetRow;

import React, {memo} from 'react';
import {dataFormatter} from "@mnd/shared";
import {Asset} from "@/types/assets/Data.ts";
import {ProcessTaskStatus} from "@/generated/gql/dataset/graphql.ts";
import {statusMap} from "@/components/AsideAssets.tsx";

type AssetRowProps = {
    item: Asset;
};

const formatStatus = (status: ProcessTaskStatus | null | undefined): string | undefined => {
    if (status === null || status === undefined) {
        return undefined;
    }
    return statusMap[status] || status;
};

const showAssetLog = (id: string) => {
    console.log("log ",id);
}

const downAsset = (id: string) => {
    console.log("down ",id);
}

const deleteAsset = (id: string) => {
    console.log("delete ",id);
}

const convertAsset = (id: string) => {
    console.log("convert ",id)
}

const AssetRow: React.FC<AssetRowProps> = memo(({ item }) => {
    if (!item) return null;
    const status = formatStatus(item.status);
    return (
        <tr>
            <td>{item.assetType}</td>
            <td>
                <div className="name">{item.name}</div>
                <div className="date clear">{dataFormatter(
                    item.updatedAt ?? new Date().toISOString(),
                    "YYYY-MM-DD HH:mm:ss"
                )} </div>
            </td>
            <td>
                <button type="button" className={`status-button ${status}`}>{status}</button>
            </td>
            <td>
                {status === "success" || status === "none" ? (
                    <button type="button" onClick={() => convertAsset(item.id)} className="function-button convert"></button>
                ): (
                    <button type="button" onClick={() => showAssetLog(item.id)} className="function-button log"></button>
                )}
                <button type="button" onClick={() => downAsset(item.id)} className="function-button down"></button>
                <button type="button" onClick={() => deleteAsset(item.id)} className="function-button delete"></button>
            </td>
        </tr>
    );
});
AssetRow.displayName = 'AssetRow';
export default AssetRow;
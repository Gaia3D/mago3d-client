import React, {useState} from 'react';
import {
    AssetType,
    Access,
    DatasetAssetListDocument,
    DatasetAssetListQueryVariables,
    ProcessTaskStatus
} from "@/generated/gql/dataset/graphql.ts";
import {useQuery} from "@apollo/client";
import {useRecoilValue} from "recoil";
import {dataSearchSelector} from "@/recoils/Data.ts";

type Asset = {
    __typename?: "Asset" | undefined;
    id: string; name: string;
    assetType: AssetType;
    enabled: boolean;
    access: Access;
    status?: ProcessTaskStatus | null | undefined;
    createdAt?: string | null | undefined;
    updatedAt?: string | null | undefined; }
    | null;

type AssetRowProps = {
    item: Asset;
};

const getStatus = (status: ProcessTaskStatus | null | undefined) => {
    if (status === "Done") {
        return "success";
    } else if (status === "Running" || status === "Ready") {
        return "running";
    } else if (status === "None") {
      return "none";
    } else if (status === undefined || status === null) {
        return "fail";
    } else {
        return "fail";
    }
};

const AssetRow: React.FC<AssetRowProps> = ({ item }) =>{
    if (!item) return null;
    const status: "success" | "running" | "fail" | "none" = getStatus(item.status)
    return ( <tr>
        <td>{item.assetType}</td>
        <td>
            <div className="name">{item.name}</div>
            <div className="date clear">{item.updatedAt}</div>
        </td>
        <td>
            <button type="button" className={`status-button ${status}`}>{status}</button>
        </td>
        <td>
            <button type="button" className="function-button log"></button>
            <button type="button" className="function-button down"></button>
            <button type="button" className="function-button delete"></button>
        </td>
    </tr>
)};

const AsideAssets = () => {
    const searchProps = useRecoilValue<DatasetAssetListQueryVariables>(dataSearchSelector);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const {data, loading} = useQuery(DatasetAssetListDocument, {
        variables: searchProps,
    });

    if(loading || !data) return <></>;

    const {items, pageInfo} = data.assets;

    console.log(items);
    console.log(pageInfo);

    const filteredAssets = items
        .filter(item => (
            item && (filterStatus === 'all' || item.status === filterStatus) &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    return (
        <div className="side-bar-wrapper">
            <input type="checkbox" id="toggleButton" />
            <div className="side-bar">
                <div className="side-bar-header">
                    <label htmlFor="toggleButton">
                        <div className="button side">
                            <div className="description--content">
                                <div className="title">Close sidebar</div>
                            </div>
                        </div>
                    </label>
                    <div className="search-container">
                        <button type="button" className="button search"></button>
                        <input
                            id="searchInput"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="content--wrapper">
                    <button type="button" className="table-button float-right">
                        <span className="new-item"></span>
                        New Assets
                    </button>
                    <table className="assets-list">
                        <caption>assets 목록</caption>
                        <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name/Upload Data</th>
                            <th>Status <button type="button" className="status-view"></button></th>
                            <th>Function</th>
                        </tr>
                        </thead>
                    </table>
                    <div className="pop-layer status">
                        <ul>
                            {['all', 'success', 'running', 'fail'].map(status => (
                                <li key={status} className={filterStatus === status ? 'selected' : ''}>
                                    <a href="#" onClick={() => setFilterStatus(status)}>{status}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="y-scroll">
                        <table className="assets-list">
                            <tbody>
                            {filteredAssets.map((asset, index) => (
                                <AssetRow key={index} item={asset} />
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsideAssets;
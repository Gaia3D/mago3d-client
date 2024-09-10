import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useQuery } from "@apollo/client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
    dataCurrentPageState,
    dataProcessStatusState,
    dataSearchSelector,
    dataSearchTextState
} from "@/recoils/Data.ts";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll.ts";
import { AsideDisplayProps } from "@/components/aside/AsidePanel.tsx";
import AssetRow from "@/components/aside/asset/AssetRow.tsx";
import {
    DatasetAssetListDocument,
    DatasetAssetListQueryVariables,
    ProcessTaskStatus
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import SearchInput from "@/components/SearchInput.tsx";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import { IsNewAssetModalState } from "@/recoils/Modal.ts";
import { assetsRefetchTriggerState } from "@/recoils/Assets.ts";
import {Asset} from "@/types/assets/Data.ts";
import {useTranslation} from "react-i18next";

export const statusMap: Partial<Record<ProcessTaskStatus, string>> = {
    "Done": "success",
    "Running": "running",
    "None": "none",
    "Error": "fail",
};

const reverseStatusMap = Object.entries(statusMap).reduce<Record<string, ProcessTaskStatus>>((acc, [key, value]) => {
    acc[value] = key as ProcessTaskStatus;
    return acc;
}, {});

const getStatusByLabel = (status: string): ProcessTaskStatus | undefined => reverseStatusMap[status];

const AsideAssets: React.FC<AsideDisplayProps> = ({ display }) => {
    const { t } = useTranslation();
    const searchProps = useRecoilValue<DatasetAssetListQueryVariables>(dataSearchSelector);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const setPage = useSetRecoilState(dataCurrentPageState);
    const setSearch = useSetRecoilState(dataSearchTextState);
    const setStatus = useSetRecoilState(dataProcessStatusState);
    const statusTh = useRef<HTMLTableCellElement>(null);
    const assetsRefetchTrigger = useRecoilValue(assetsRefetchTriggerState);
    const setIsNewAssetModal = useSetRecoilState(IsNewAssetModalState);

    const [dataArr, setDataArr] = useState<Asset[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const { data, loading } = useQuery(DatasetAssetListDocument, {
        variables: searchProps,
        fetchPolicy: 'network-only',
    });

    const toggleStatusPop = useCallback(() => {
        if (statusTh.current) {
            statusTh.current.classList.toggle('on');
        }
    }, []);

    const dataReset = useCallback(() => {
        setDataArr([]);
        setPage(0);
    }, [setPage]);

    useEffect(() => {
        dataReset();
    }, [assetsRefetchTrigger, dataReset]);

    const getMore = useCallback(() => {
        if (loading || !data) return;
        const { pageInfo } = data.assets;
        if (pageInfo.page + 1 > pageInfo.totalPages) return;

        setPage(prevPage => prevPage + 1);
        setDataArr(prevDataArr => [...prevDataArr, ...data.assets.items]);
    }, [data, loading, setPage]);

    const loadMoreRef = useInfiniteScroll<HTMLTableRowElement>({
        root: containerRef.current,
        fetchMore: getMore,
        isLoading: loading,
        rootMargin: '20px'
    });

    const debouncedSearch = useDebounce(searchTerm, 300);

    useEffect(() => {
        setSearch(searchTerm.toLowerCase());
        dataReset();
    }, [debouncedSearch, setSearch, dataReset]);

    useEffect(() => {
        setStatus(getStatusByLabel(filterStatus));
        dataReset();
    }, [filterStatus, setStatus, dataReset]);

    const handleDelete = (id: string) => {
        setDataArr((prevData) => prevData.filter(asset => asset?.id !== id));
    };

    return (
        <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
            <div className="side-bar">
                <div className="side-bar-header">
                    <SideCloseButton />
                    <SearchInput value={searchTerm} change={setSearchTerm} />
                </div>
                <div className="content--wrapper">
                    <button type="button" className="table-button float-right" onClick={() => setIsNewAssetModal(true)}>
                        <span className="new-item"></span>
                        {t("aside.asset.new-asset")}
                    </button>
                    <table className="assets-list">
                        <caption>assets 목록</caption>
                        <thead>
                        <tr>
                            <th>{t("aside.asset.type")}</th>
                            <th>{t("aside.asset.name-upload-date")}</th>
                            <th className="status-th" ref={statusTh} onClick={toggleStatusPop}>{t("aside.asset.status")}
                                <div className="status-view"></div>
                                <div className="pop-layer status">
                                    <ul>
                                        {['all', 'success', 'running', 'fail', 'none'].map(status => (
                                            <li key={status} className={filterStatus === status ? 'selected' : ''}>
                                                <span className="text" onClick={() => setFilterStatus(status)}>{status}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </th>
                            <th>{t("aside.asset.function")}</th>
                        </tr>
                        </thead>
                    </table>
                    <div className="y-scroll" ref={containerRef}>
                        <table className="assets-list">
                            <tbody>
                            {dataArr.map(asset => (
                                asset && <AssetRow key={asset.id} item={asset} onDelete={handleDelete} />
                            ))}
                            <tr ref={loadMoreRef}>
                                <td colSpan={4}>
                                    {loading ? (
                                        <span className="spin-loader"></span>
                                    ) : (
                                        dataArr.length === 0 ? t("aside.common.no-data") : t("aside.common.data-end")
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsideAssets;

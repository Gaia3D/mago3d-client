import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
    DatasetAssetListDocument,
    DatasetAssetListQueryVariables,
    ProcessTaskStatus
} from "@/generated/gql/dataset/graphql.ts";
import {useQuery} from "@apollo/client";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {dataCurrentPageState, dataProcessStatusState, dataSearchSelector, dataSearchTextState} from "@/recoils/Data.ts";
import {Asset} from "@/types/assets/Data.ts";
import {useDebounce} from "@/hooks/useDebounce.ts";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll.ts";
import {mainMenuState} from "@/recoils/MainMenuState.tsx";
import {AsideDisplayProps} from "@/components/AsidePanel.tsx";
import AssetRow from "@/components/AssetRow.tsx";



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

const reverseFormatStatus = (status: string): ProcessTaskStatus | undefined => {
    return reverseStatusMap[status];
};

const AsideAssets: React.FC<AsideDisplayProps>  = ({display}) => {
    const searchProps = useRecoilValue<DatasetAssetListQueryVariables>(dataSearchSelector);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const setPage = useSetRecoilState<number>(dataCurrentPageState);
    const setSearch = useSetRecoilState<string|undefined>(dataSearchTextState);
    const setStatus = useSetRecoilState<ProcessTaskStatus|undefined>(dataProcessStatusState);
    const statusTh = useRef<HTMLTableCellElement>(null);

    const toggleStatusPop = () => {
        if (statusTh.current) {
            statusTh.current.classList.toggle('on');
        }
    };

    const [dataArr, setDataArr] = useState<Asset[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFetching, setIsFetching] = useState(false);

    const { data, loading } = useQuery(DatasetAssetListDocument, {
        variables: searchProps,
        fetchPolicy: 'network-only',
    });

    const getMore = useCallback(() => {
        if (loading || !data) return;
        const { pageInfo } = data.assets;
        const nowPage = pageInfo.page + 1;
        if (nowPage >= pageInfo.totalPages) return;
        setPage(nowPage);
        setIsFetching(true);
    }, [data, setPage, loading]);

    const loadMoreRef = useInfiniteScroll({
        root: containerRef.current,
        fetchMore: getMore,
        isLoading: isFetching || loading,
    });

    useEffect(() => {
        if (data) {
            const { items } = data.assets;
            setDataArr(prevDataArr => [...prevDataArr, ...items]);
            setIsFetching(false);
        }
    }, [data]);

    const debouncedSearch = useDebounce(searchTerm, 300);
    useEffect(() => {
        if (loading || !data) return;
        setDataArr([]);
        setPage(0);
        setSearch(searchTerm.toLowerCase());
        setIsFetching(true);
    }, [debouncedSearch]);

    useEffect(() => {
        if (loading || !data) return;
        setDataArr([]);
        setPage(0);
        setStatus(reverseFormatStatus(filterStatus));
        setIsFetching(true);
    }, [filterStatus]);

    const setMenu = useSetRecoilState(mainMenuState);

    return (
        <div className={`side-bar-wrapper ${display?"on":"off"}`}>
            <div className="side-bar">
                <div className="side-bar-header">
                    <div className="button side" onClick={() =>setMenu({SelectedId: ''})}>
                        <div className="description--content">
                            <div className="title">Close sidebar</div>
                        </div>
                    </div>
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
                            <th className="status-th" ref={statusTh} onClick={toggleStatusPop}>Status
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
                            <th>Function</th>
                        </tr>
                        </thead>
                    </table>
                    <div className="y-scroll" ref={containerRef}>
                        <table className="assets-list">
                            <tbody>
                            {dataArr.map((asset) => (
                                asset && <AssetRow key={asset.id} item={asset}/>
                            ))}
                            <tr ref={loadMoreRef}>
                            <td colSpan={4}>
                                    {(isFetching || loading) ?
                                        <span className="spin-loader"></span>
                                        :
                                        (dataArr.length === 0 ? "No data" : "data end")}
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
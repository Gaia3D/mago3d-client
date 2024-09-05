import React, {useCallback, useEffect, useRef, useState} from 'react';
import { AsideDisplayProps } from "@/components/aside/AsidePanel.tsx";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import { useQuery } from "@apollo/client";
import {
    Prop,
    PropsPagedDocument,
    PropsPagedQueryVariables
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { propCurrentPageState, propSearchSelector, propSearchTextState } from "@/recoils/Data.ts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll.ts";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { useModelCreator } from "@/hooks/useModelCreator.ts";
import { CurrentCreatePropIdState } from "@/recoils/Tool.ts";

export const AsideProps: React.FC<AsideDisplayProps> = ({ display }) => {
    const searchProps = useRecoilValue<PropsPagedQueryVariables>(propSearchSelector);
    const setPage = useSetRecoilState(propCurrentPageState);
    const setSearch = useSetRecoilState(propSearchTextState);
    const [currentCreatePropId, setCurrentCreatePropId] = useRecoilState(CurrentCreatePropIdState);

    const { initialized, globeController } = useGlobeController();

    const [dataArr, setDataArr] = useState<Prop[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const { data, loading } = useQuery(PropsPagedDocument, {
        variables: searchProps,
        fetchPolicy: 'network-only',
    });

    const getMore = useCallback(() => {
        if (loading || !data) return;
        const { pageInfo } = data.propsPaged;
        if (pageInfo.page + 1 > pageInfo.totalPages) return;

        setPage(prevPage => prevPage + 1);

        setDataArr(prevDataArr => [
            ...prevDataArr,
            ...data.propsPaged.items.filter((item): item is Prop => item !== null)
        ]);
    }, [data?.propsPaged.pageInfo, loading, setPage]);

    const loadMoreRef = useInfiniteScroll<HTMLDivElement>({
        root: containerRef.current,
        fetchMore: getMore,
        isLoading: loading,
        rootMargin: '20px'
    });

    const { onCreateProp, offCreateProp } = useModelCreator(globeController?.viewer, globeController?.propPrimitives);

    const togglePropClick = (prop: Prop) => {
        if (currentCreatePropId === prop.id) {
            setCurrentCreatePropId('');
            offCreateProp();
            return;
        }

        const propFile = prop.files[0];
        const url = propFile?.download;
        const name = prop.name;

        if (!url) return;
        setCurrentCreatePropId(prop.id);
        onCreateProp(url, name);
    };

    useEffect(() => {
        if (!currentCreatePropId) {
            setCurrentCreatePropId('');
            offCreateProp();
        }
    }, [currentCreatePropId, offCreateProp, setCurrentCreatePropId]);

    return (
        <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
            <input type="checkbox" id="toggleButton" />
            <div className="side-bar">
                <div className="side-bar-header">
                    <SideCloseButton />
                </div>
                <div className="content--wrapper">
                    <div className="prop-scroll" ref={containerRef}>
                        <ul className="prop">
                            {
                                dataArr
                                    .filter((prop) => prop && prop.files.length > 0 && prop.files[0].thumbnail)
                                    .map((prop) => (
                                        <li
                                            key={prop.id}
                                            onClick={() => togglePropClick(prop)}
                                            className={currentCreatePropId === prop.id ? 'selected' : ''}
                                        >
                                            <img
                                                src={prop.files[0].thumbnail?.download ?? ''}
                                                alt={prop.files[0].filename ?? ''}
                                            />
                                        </li>
                                    ))
                            }
                            <div ref={loadMoreRef} className="data-end-ref">
                                {loading ? (
                                    <span className="spin-loader"></span>
                                ) : (
                                    dataArr.length === 0 ? "No data" : "data end"
                                )}
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

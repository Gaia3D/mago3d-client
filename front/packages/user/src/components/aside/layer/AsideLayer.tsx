import React, {useEffect, useState} from "react";
import {
    layerMenuState, UserLayerGroupState
} from "@/recoils/Layer";
import {useRecoilState, useSetRecoilState} from "recoil";
import {AsideDisplayProps} from "@/components/aside/AsidePanel.tsx";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import SearchInput from "@/components/SearchInput.tsx";
import {useDebounce} from "@/hooks/useDebounce.ts";
import PrimitivesContent from "@/components/aside/layer/PrimitivesContent.tsx";
import EntitiesContent from "@/components/aside/layer/EntitiesContent.tsx";
import TilesetContent from "@/components/aside/layer/TilesetContent.tsx";
import {layerGroupsToNodemodels, nodeModlesToCreateUserGroupInput} from "@/components/aside/layer/LayerNodeModel.ts";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";
import {layersetGraphqlFetcher} from "@/api/queryClient.ts";
import {
    CreateUserGroupInput,
    Maybe,
    Mutation,
    UserLayerGroup
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {RESTORE_USERLAYER, SAVE_USERLAYER} from "@/graphql/layerset/Mutation.ts";
import {useLayerVisibilitySetter} from "@/hooks/useLayerVisibilitySetter.ts";
import {loadingState} from "@/recoils/Spinner.ts";

export const AsideLayers: React.FC<AsideDisplayProps>  = ({display}) => {
    const {t} = useTranslation();
    const [layerMenu, setLayerMenu] = useRecoilState(layerMenuState);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllLayersNext, setShowAllLayersNext] = useState(false);
    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);

    const setLoadingState = useSetRecoilState(loadingState);
    const setLayerVisibility = useLayerVisibilitySetter(setLoadingState);

    const debouncedSearch = useDebounce(searchTerm, 300);

    const { mutateAsync: restoreUserLayerMutateAsync } = useMutation({
        mutationFn: () => layersetGraphqlFetcher<Mutation>(RESTORE_USERLAYER),
        onError: (error) => {
            console.error("Error restoring user layer:", error);
            alert(t("error.layer.restore"));
        },
    });

    const { mutateAsync: saveUserLayerMutateAsync } = useMutation({
        mutationFn: ({ input }: { input: CreateUserGroupInput[] }) => layersetGraphqlFetcher<Mutation>(SAVE_USERLAYER, { input }),
        onError: (error) => {
            console.error("Error saving user layer:", error);
            alert(t("error.layer.save"));
        },
    });

    const restoreToDefault = async () => {
        if (!confirm(t("confirm.layer.restore"))) return;
        const {saveUserLayer} = await restoreUserLayerMutateAsync();
        setUserLayerGroups(saveUserLayer);
    };

    const saveState = async () => {
        if (!confirm(t("confirm.layer.save"))) return;
        const input = nodeModlesToCreateUserGroupInput(layerGroupsToNodemodels(userLayerGroups));
        await saveUserLayerMutateAsync({ input });
    };

    const toggleAllLayer = async () => {
        setShowAllLayersNext(!showAllLayersNext);

        const updatedGroups = userLayerGroups.map(group => {
            if (!group) return group;

            const updatedAssets = group.assets.map(asset => {
                // Cesium에 먼저 반영
                setLayerVisibility(asset, showAllLayersNext);
                // Recoil에 반영될 새로운 객체 생성
                return { ...asset, visible: showAllLayersNext };
            });

            return { ...group, assets: updatedAssets };
        });

        setUserLayerGroups(updatedGroups);
    };

    // 레이어가 하나라도 켜져있으면 전체 끄기 on
    useEffect(() => {
        const hasAnyVisible = userLayerGroups.some(group =>
          group?.assets.some(asset => asset.visible)
        );
        setShowAllLayersNext(!hasAnyVisible);
    }, [userLayerGroups]);



    return (
        <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
            <input type="checkbox" id="toggleButton"/>
            <div className="side-bar">
                <div className="side-bar-header">
                    <SideCloseButton />
                    <SearchInput value={searchTerm} change={setSearchTerm} />
                </div>
                <div className="content--wrapper layer-wrapper">
                    <ul className="layer">
                        <li className={`${layerMenu === 'tileset' ? 'selected' : ''}`}
                            onClick={() => setLayerMenu('tileset')}><span className="text">Tileset</span></li>
                        <li className={`${layerMenu === 'primitives' ? 'selected' : ''}`}
                            onClick={() => setLayerMenu('primitives')}><span className="text">Primitives</span></li>
                        <li className={`${layerMenu === 'entities' ? 'selected' : ''}`}
                            onClick={() => setLayerMenu('entities')}><span className="text">Entities</span></li>
                    </ul>
                    <div className={`tileset-button ${layerMenu === 'tileset' ? 'on' : 'off'}`}>
                        <button type="button" onClick={toggleAllLayer}
                                className={`layer-funtion-button ${showAllLayersNext ? 'visible' : 'not-visible'}`}></button>
                        <button onClick={restoreToDefault} className='layer-funtion-button reset'></button>
                        <button onClick={saveState} className='layer-funtion-button save'></button>
                    </div>
                    <div className={`layer-scroll ${layerMenu === 'tileset' ? '' : 'height-plus-44'}`}>
                        {
                            (() => {
                                switch (layerMenu) {
                                    case "tileset":
                                        return <TilesetContent searchTerm={debouncedSearch}/>;
                                    case "primitives":
                                        return <PrimitivesContent/>;
                                    case "entities":
                                        return <EntitiesContent/>;
                                    default:
                                        return null;
                                }
                            })()
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

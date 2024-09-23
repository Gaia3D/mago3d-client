import {useRecoilState, useSetRecoilState} from 'recoil';
import { Maybe, UserLayerAsset, UserLayerGroup } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {UserLayerGroupState, visibleToggledLayerIdState} from "@/recoils/Layer.ts";

const useLayerVisibilityToggle = () => {
    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
    const setVisibleToggledLayerId = useSetRecoilState<string | null>(visibleToggledLayerIdState);

    const layerVisibilityToggle = (item: UserLayerAsset) => {
        const updatedGroups = userLayerGroups.map(group => (
            {
                ...group,
                assets: group?.assets.map(asset =>
                    asset.assetId === item.assetId
                        ? { ...asset, visible: !asset.visible }
                        : asset
                )
            } as UserLayerGroup
        ));

        setUserLayerGroups(updatedGroups);
        setVisibleToggledLayerId(item.assetId.toString());
    };

    const layerVisibilityAllTF = (status: boolean) => {

    }

    return { layerVisibilityToggle, layerVisibilityAllTF };
};

export default useLayerVisibilityToggle;
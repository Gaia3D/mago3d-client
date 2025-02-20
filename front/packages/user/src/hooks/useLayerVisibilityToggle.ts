import { useRecoilState } from 'recoil';
import { Maybe, UserLayerAsset, UserLayerGroup } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { userLayerAssetArrState, UserLayerGroupState } from "@/recoils/Layer.ts";

const useLayerVisibilityToggle = () => {
    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
    const [userLayerAssetArr, setUserLayerAssetArr] = useRecoilState(userLayerAssetArrState);

    const layerVisibilityToggle = (item: UserLayerAsset) => {
        let updatedItem: UserLayerAsset | undefined;

        const updatedGroups = userLayerGroups.map(group => {
            if (!group) return group;

            return {
                ...group,
                assets: group.assets.map(asset => {
                    if (asset.assetId === item.assetId) {
                        updatedItem = { ...asset, visible: !asset.visible }; // 새로운 객체 생성
                        return updatedItem;
                    }
                    return asset;
                })
            } as UserLayerGroup;
        });

        if (!updatedItem) {
            console.warn(`Item not found in groups: ${item.assetId}`);
            return;
        }

        setUserLayerGroups(updatedGroups);
        setUserLayerAssetArr([...userLayerAssetArr, updatedItem]); // 업데이트된 객체를 배열에 추가
    };

    return { layerVisibilityToggle };
};

export default useLayerVisibilityToggle;

// hooks/useDeleteLayer.ts
import { useRecoilState } from 'recoil';
import { Maybe, UserLayerAsset, UserLayerGroup } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { UserLayerGroupState } from "@/recoils/Layer.ts";
import { useMutation as apolloUseMutation } from "@apollo/client/react/hooks/useMutation";
import { LayersetDeleteAssetDocument } from "@mnd/shared/src/types/layerset/gql/graphql.ts";

// 커스텀 훅 정의
export const useDeleteLayer = () => {
    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
    const [deleteAssetMutation] = apolloUseMutation(LayersetDeleteAssetDocument);

    const deleteLayer = async (item: UserLayerAsset) => {
        if (!confirm('레이어를 삭제하시겠습니까?')) return;
        try {
            await deleteAssetMutation({
                variables: { ids: item.assetId }
            });
            const updatedGroups = userLayerGroups.map(group => (
                {
                    ...group,
                    assets: group?.assets.filter(asset =>
                        asset.assetId !== item.assetId
                    )
                } as UserLayerGroup
            ));
            setUserLayerGroups(updatedGroups);
            alert('레이어가 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error(error);
            alert('레이어 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return { deleteLayer };
};

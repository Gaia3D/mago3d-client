// hooks/useDeleteLayer.ts
import { useRecoilState } from 'recoil';
import { Maybe, UserLayerAsset, UserLayerGroup } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { UserLayerGroupState } from "@/recoils/Layer.ts";
import { useMutation as apolloUseMutation } from "@apollo/client/react/hooks/useMutation";
import { LayersetDeleteAssetDocument } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useTranslation} from "react-i18next";

// 커스텀 훅 정의
export const useDeleteLayer = () => {
    const {t} = useTranslation();
    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
    const [deleteAssetMutation] = apolloUseMutation(LayersetDeleteAssetDocument);

    const deleteLayer = async (item: UserLayerAsset) => {
        if (!confirm(t("confirm.layer.delete"))) return;
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
            alert(t("success.layer.delete"));
        } catch (error) {
            console.error(error);
            alert(t("error.layer.delete"));
        }
    };

    return { deleteLayer };
};

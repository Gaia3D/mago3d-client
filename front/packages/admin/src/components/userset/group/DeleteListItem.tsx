import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from "@tanstack/react-query";
import { useKcAdminClient } from "@src/provider/KeycloakAdminClientProvider";
import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import {useTranslation} from "react-i18next";

export const DeleteListItem = ({id, refetch}:{id:string | undefined, refetch: (options?: (RefetchOptions & RefetchQueryFilters) | undefined) => Promise<QueryObserverResult<GroupRepresentation[], unknown>>}) => {
    const {t} = useTranslation();
    const kcAdminClient = useKcAdminClient();
    const {mutateAsync: deleteMutateAsync} = useMutation({
        mutationFn: ( id:string ) => kcAdminClient.groups.del({id})
    });

    const deleteGroup = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if(!id) return;
        if(!confirm(t('question.delete'))) return;

        deleteMutateAsync(id, {
            onSuccess: () => refetch()
        });
    }

    return (
        <td><button type="button" className="btn-s-delete" onClick={deleteGroup}>{t("delete")}</button></td>
    )
}

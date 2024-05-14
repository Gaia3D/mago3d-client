import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from "@tanstack/react-query";
import { useKcAdminClient } from "@src/provider/KeycloakAdminClientProvider";
import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";

export const DeleteListItem = ({id, refetch}:{id:string | undefined, refetch: (options?: (RefetchOptions & RefetchQueryFilters) | undefined) => Promise<QueryObserverResult<GroupRepresentation[], unknown>>}) => {
    const kcAdminClient = useKcAdminClient();
    const {mutateAsync: deleteMutateAsync} = useMutation({
        mutationFn: ( id:string ) => kcAdminClient.groups.del({id})
    });

    const deleteGroup = (event) => {
        if(!id) return;
        if(!confirm('삭제하시겠습니까?')) return;
        
        deleteMutateAsync(id, {
            onSuccess: () => refetch()
        });
        event.stopPropagation();
    }

    return (
        <td><button type="button" className="btn-s-delete" onClick={deleteGroup}>삭제</button></td>
    )
}

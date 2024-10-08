import { useNavigate, useOutletContext  } from "react-router-dom";
import { useKcAdminClient } from "@src/provider/KeycloakAdminClientProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {UpdateGroupForm, useGroupFormSchemas} from "@src/api/Group";
import { zodResolver } from "@hookform/resolvers/zod";
import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

export const UpdateBasic = () => {
    const {t} = useTranslation();
    const {createGroupForm} = useGroupFormSchemas();
    const id = useOutletContext<string>();
    const kcAdminClient = useKcAdminClient();
    const nav = useNavigate();
    const {data} = useQuery({
        queryKey: ['groups', id],
        queryFn: () => kcAdminClient.groups.findOne({id}),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: 0,
        gcTime: 0,
    });

    const { register, handleSubmit, formState: { errors}} = useForm<UpdateGroupForm>({
        resolver: zodResolver(createGroupForm)
    });
    const updateMutation = useMutation({
        mutationFn: ( {id, group}:{id:string, group: GroupRepresentation} ) => kcAdminClient.groups.update({id}, group)
    });

    const onSubmit = (data:UpdateGroupForm) => {
        const group: GroupRepresentation = {
            name: data.name,
            attributes: {
                "description": [data.attributes?.description]
            }
        }

        updateMutation.mutateAsync({id, group})
          .then(() => {
              toast(t("success.edit"));
              toList();
          });
    }
    const toList = () => nav('/userset/group');
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <article>
                    <label htmlFor="update-group-name">{t("group-name")}</label>
                    <input type="text"
                           {...register("name")}
                           id="update-group-name"
                           defaultValue={data?.name}
                    /><br />
                    <label htmlFor="update-group-description">{t("description")}</label>
                    <input type="text"
                           {...register("attributes.description")}
                           id="update-group-description"
                           defaultValue={data?.attributes?.description}
                    />
                </article>
                <div className="alg-right">
                    <button type="submit" className="btn-l-save">{t("save")}</button>
                    <button type="button" className="btn-l-cancel" onClick={toList}>{t("cancel")}</button>
                </div>
            </form>
        </>
    )
}

import { SubmitHandler, useForm } from "react-hook-form";
import {CreateGroupForm, createGroupFormToGroupRepresentation, useGroupFormSchemas} from "../../../api/Group";
import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from "@tanstack/react-query";
import { useKcAdminClient } from "../../../provider/KeycloakAdminClientProvider";
import {useTranslation} from "react-i18next";

export const CreatePopup = ({popupToggle, refetch}: {

    popupToggle: React.Dispatch<React.SetStateAction<boolean>>,
    refetch: (options?: (RefetchOptions & RefetchQueryFilters) | undefined) => Promise<QueryObserverResult<GroupRepresentation[], unknown>>
}) => {
    const {t} = useTranslation();
    const {createGroupForm} = useGroupFormSchemas();
    const kcAdminClient = useKcAdminClient();

    const closePopup = () => popupToggle(false);
    const {register, handleSubmit, formState: {errors}} = useForm<CreateGroupForm>({resolver: zodResolver(createGroupForm)});

    const {mutateAsync: createMutateAsync} = useMutation({
        mutationFn: (group: GroupRepresentation) => kcAdminClient.groups.create(group)
    });

    const onSubmit: SubmitHandler<CreateGroupForm> = (data) => {
        const group: GroupRepresentation = createGroupFormToGroupRepresentation(data);
        createMutateAsync(group, {
            onSuccess() {
                alert(t("success.create"));
                refetch();
                closePopup();
            },
            onError(e: unknown) {
                console.error(e);
                alert(t("error.admin"));
            }
        });
    }

    return (
      <div className="popup-wrap">
          <div className="popup">
              <div className="popup-head">
                  <h3>{t("create-user-group")}</h3>
                  <button type="button" className="button-close" onClick={closePopup}></button>
              </div>
              <div className="popup-body">
                  <div className="content-inner">
                      <form onSubmit={handleSubmit(onSubmit)}>
                          <label htmlFor="group-create-name">{t("group-name")}</label>
                          <input type="text" id="group-create-name"
                                 {...register("name", {
                                     validate: value => !!value.trim(),
                                     required: t('validation.group-name'),
                                 })}
                          />
                          {errors.name && <span style={{color: 'red', marginTop: '-15px'}}>{errors.name.message}</span>}
                          <label htmlFor="group-create-attributes.description">{t("description")}</label>
                          <input type="text" id="group-create-attributes.description"
                                 {...register("attributes.description")}
                          />
                          <button type="submit" className="btn-l-apply">{t("register")}</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    )
}

import {useMutation} from "@tanstack/react-query";
import {useKcAdminClient} from "@src/provider/KeycloakAdminClientProvider";
import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {UpdateUserForm, useFormSchemas, useGetUserInfoById} from "@src/api/User";
import {useNavigate} from "react-router-dom";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

export const Update = ({id}: { id: string }) => {
  const {t} = useTranslation();
  const { updateUserForm } = useFormSchemas();
  const navigate = useNavigate();
  const kcAdminClient = useKcAdminClient();

  const {mutateAsync: updateMutateAsync} = useMutation({
    mutationFn: ({id, user}: { id: string, user: UserRepresentation }) => kcAdminClient.users.update({id}, user)
  });

  const [{data: groups}, {data: userGroups}, {data: user}] = useGetUserInfoById(id, kcAdminClient);

  const {register, handleSubmit, formState: {errors, dirtyFields}, reset} = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserForm),
    defaultValues: {
      groups: userGroups?.at(0)?.id,
      username: user?.username ?? '',
      firstName: user?.firstName ?? '',
      email: user?.email ?? '',
      enabled: user?.enabled ?? false,
      attributes: {
        phone: user?.attributes?.phone?.[0] ?? '',
        division: user?.attributes?.division?.[0] ?? 'army',
        unit: user?.attributes?.unit?.[0] ?? '',
        level: user?.attributes?.level?.[0] ?? ''
      }
    }
  });

  const isDirty = Object.keys(dirtyFields).length > 0;

  const updateUserGroup = (groupId) => {
    const id = user?.id;
    // 기존 그룹에서 제거
    userGroups?.forEach((group) => {
      const groupId = group.id;
      kcAdminClient.users.delFromGroup({id, groupId});
    });
    // 새로운 그룹에 추가
    kcAdminClient.users.addToGroup({id, groupId});
  }

  const onSubmit: SubmitHandler<UpdateUserForm> = (data: UpdateUserForm) => {
    const {groups, ...userInfo} = data;

    if (dirtyFields.groups) {
      updateUserGroup(groups);
    }

    const user: UserRepresentation = userInfo;

    updateMutateAsync({id, user},
      {
        onSuccess() {
          toast(t("success.edit"))
          navigate(-1);
        },
        onError(e: unknown) {
          console.error(e);
          alert(t("error.admin"));
        }
      });
  };
  return (
    <Suspense fallback={<AppLoader/>}>
      <div className="contents">
        <h2>{t("update-user")}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="register">
            <label htmlFor="user-create-username">{t("user-id-army-number")}</label>
            <input type="text" id="user-update-username"  {...register("username")} readOnly disabled/>

            <label htmlFor="user-create-groups">{t("user-group")}</label>
            <select id="user-update-groups" {...register("groups")}>
              {
                groups?.map(({id, name}) => (
                  <option value={id} key={id}>{name}</option>
                ))
              }
            </select>
            {errors.firstName && <div className="input-error">{errors.firstName.message}</div>}
            <label htmlFor="user-create-firstName">{t("name")}</label>
            <input type="text" id="user-update-firstName" {...register("firstName")} />

            {errors.email && <div className="input-error">{errors.email.message}</div>}
            <label htmlFor="user-create-email">{t("army-email")}</label>
            <input type="email" id="user-update-email" {...register("email")}/>

            {(errors.attributes?.phone?.message && typeof errors.attributes?.phone?.message === 'string')
              && <div className="input-error">{errors.attributes.phone.message}</div>}
            <label htmlFor="user-create-attributes.phone">{t("phone-number")}</label>
            <input type="text" id="user-update-attributes.phone" {...register("attributes.phone")}/>

            {errors.attributes?.division && <div className="input-error">{errors.attributes.division.message}</div>}
            {errors.attributes?.unit && <div className="input-error">{errors.attributes.unit.message}</div>}
            <label htmlFor="user-create-attributes.division">{t("division-unit")}</label>
            <select id="user-update-attributes.division" {...register("attributes.division")}>
              <option value="army">{t("army")}</option>
              <option value="navy">{t("navy")}</option>
              <option value="airforce">{t("airforce")}</option>
              <option value="marines">{t("marines")}</option>
              <option value="personnel">{t("division")}</option>
            </select>
            <input type="text" {...register("attributes.unit")} id="user-update-attributes.unit"/>

            <label>{t("rank")}</label>
            <input type="text" {...register("attributes.level")} id="user-update-attributes.level"/>

            <label htmlFor="user-update-attributes.enabled">{t("use-status")}</label>
            <label className="switch mt8">
              <input type="checkbox"
                     id="user-update-attributes.enabled"
                     {...register("enabled")}
              />
              <span className="slider"></span>
            </label>

          </div>
          <div className="alg-right mar-t50">
            {
              isDirty
                ? <button type="submit" className="btn-l-save">{t("edit")}</button>
                : <button type="submit" className="btn-l-save-disabled" disabled>{t("edit")}</button>
            }
            <button type="button" className="btn-l-cancel" onClick={() => reset()}>{t("reset")}</button>
            <button type="button" className="btn-l-cancel" onClick={() => navigate(-1)}>{t("list")}</button>
          </div>
        </form>
      </div>
    </Suspense>
  )
}

import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import {z} from "zod";
import {useTranslation} from "react-i18next";

export const useGroupFormSchemas = () => {
  const { t } = useTranslation();

  const createGroupForm = z.object({
    name: z.string().min(1, t("validation.group-name")),
    attributes: z.object({
      description: z.string().optional()
    }).required()
  })

  return {
    createGroupForm
  }
}

export type GroupFormSchemas = ReturnType<typeof useGroupFormSchemas>;
export type CreateGroupForm = z.infer<GroupFormSchemas['createGroupForm']>;
export type UpdateGroupForm = CreateGroupForm;

export const createGroupFormToGroupRepresentation = (form: CreateGroupForm): GroupRepresentation => {
  const group = {
    name: form.name,
    path: `/${form.name}`,
  } as GroupRepresentation;
  if (form.attributes.description && form.attributes.description.length > 0) {
    group.attributes = {
      //이상함. 서버에서 배열로만 받아짐.
      "description": [form.attributes.description],
    }
  }
  return group;
}
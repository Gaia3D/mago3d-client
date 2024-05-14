import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import {z} from "zod";

export const createGroupForm = z.object({
  name: z.string().min(1, '그룹명을 입력해주시기 바랍니다.'),
  attributes: z.object({
    description: z.string().optional()
  })
}).required();

export const updateGroupForm = createGroupForm;

export type CreateGroupForm = z.infer<typeof createGroupForm>;
export type UpdateGroupForm = z.infer<typeof updateGroupForm>;

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
import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {useSuspenseQueries, useSuspenseQuery} from "@tanstack/react-query";
import {z} from "zod";
import {UserQueryWithAdditionalPageInfo} from "../types/User";
import {passwordRegex, phoneRegex, usernameRegex} from "@src/utils/Miscellaneous";

const username = z.string().trim().min(1, '아이디(군번)을 입력해주시기 바랍니다.')
  .regex(usernameRegex, '4~12자리의 소문자,숫자,특수문자(-)만 사용가능합니다..');
const groups = z.string().trim().min(1, '그룹을 선택해주시기 바랍니다.');
const firstName = z.string().min(1, '이름을 입력해주시기 바랍니다.');
const email = z.string().min(1, '이메일을 입력해주시기 바랍니다.').email('이메일 형식이 올바르지 않습니다.');
const enabled = z.boolean().optional();
const attributes = z.object({
  phone: z.string().regex(phoneRegex, '폰번호를 입력해주시기 바랍니다.'),
  unit: z.string().trim().min(1, '부대명을 입력해주시기 바랍니다.'),
  division: z.string({
    required_error: '군종을 선택주시기 바랍니다.'
  }),
  level: z.string().optional()
}).required({
  phone: true,
  unit: true,
  division: true
});

export const updateUserForm = z.object({
  groups,
  username,
  firstName,
  email,
  enabled,
  attributes,
});

export const isAnUpdateUserFormProperty = (str: string): str is keyof UpdateUserForm => {
  return ['groups', 'firstName', 'email', 'attributes', 'enabled'].includes(str);
}

export const createUserForm = z.object({
  password: z.string()
    .min(8, '비밀번호는 8자리 이상 입력해주시기 바랍니다.')
    .max(20, '비밀번호는 20자리 이하로 입력해주시기 바랍니다.')
    .regex(passwordRegex, '대문자,소문자,특수문자를 포함해야 합니다.'),
  passwordConfirm: z.string().min(8, '비밀번호는 8자리 이상 입력해주시기 바랍니다.').optional(),
  groups,
  username,
  firstName,
  email,
  enabled,
  attributes,
})
  .partial()
  .refine((form) => form.password === form.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type CreateUserForm = z.infer<typeof createUserForm>;
export type UpdateUserForm = z.infer<typeof updateUserForm>;

export const createUserFormToUserRepresentation = (form: CreateUserForm): UserRepresentation => {
  return {
    username: form.username,
    firstName: form.firstName,
    credentials: [
      {
        type: 'password',
        value: form.password,
        temporary: false
      }
    ],
    enabled: true,
    groups: [
      form.groups
    ],
    email: form.email,
    attributes: {
      'phone': form.attributes.phone,
      'division': form.attributes.division,
      'unit': form.attributes.unit,
      'level': form.attributes.level,
    }
  }
}

export const updateUserFormToUserRepresentation = (form: UpdateUserForm): UserRepresentation => {
  const userRepresentation = {} as UserRepresentation;

  if (form.firstName) {
    userRepresentation.firstName = form.firstName;
  }

  if (form.groups) {
    userRepresentation.groups = [form.groups];
  }

  userRepresentation.enabled = form.enabled;

  if (form.email) {
    userRepresentation.email = form.email;
  }

  if (form.attributes) {
    userRepresentation.attributes = form.attributes
  }

  return userRepresentation
}

export const divisionToKor = (division: string): string => {
  switch (division.toLowerCase()) {
    case 'army':
      return '육군';
    case 'navy':
      return '해군';
    case 'airforce':
      return '공군';
    case 'marines':
      return '해병대';
    default:
      return '국직';
  }
}

const defaultUserUseQueryOptions = {
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
}

export const useGetUserInfoById = (id: string, adminClient: KeycloakAdminClient) => {
  return useSuspenseQueries({
    queries: [
      {
        queryKey: ['groups'],
        queryFn: () => adminClient.groups.find(),
        staleTime: 1000 * 60 * 60 * 24,
        ...defaultUserUseQueryOptions
      },
      {
        queryKey: ['userGroups', id],
        queryFn: () => adminClient.users.listGroups({id}),
        staleTime: 0,
        gcTime: 0,
        ...defaultUserUseQueryOptions
      },
      {
        queryKey: ['userOne', id],
        queryFn: () => adminClient.users.findOne({id}),
        staleTime: 0,
        gcTime: 0,
        ...defaultUserUseQueryOptions
      }
    ]
  })
}

export const useGetUserListAndTotalCount = (
  query: UserQueryWithAdditionalPageInfo,
  queryKeys: (string | number | boolean | undefined)[],
  adminClient: KeycloakAdminClient
) => {
  return useSuspenseQueries({
    queries: [
      {
        queryKey: ['users', ...queryKeys],
        queryFn: () => adminClient.users.find(query),
        ...defaultUserUseQueryOptions,
        staleTime: 0,
        gcTime: 0,
        // keepPreviousData: true
      },
      {
        queryKey: ['usersCount', ...queryKeys],
        queryFn: () => adminClient.users.count(query),
        ...defaultUserUseQueryOptions,
        staleTime: 0,
        gcTime: 0,
        // keepPreviousData: true,
      },
    ]
  });
}
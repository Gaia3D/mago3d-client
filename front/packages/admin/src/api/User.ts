import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {useSuspenseQueries, useSuspenseQuery} from "@tanstack/react-query";
import {z} from "zod";
import {UserQueryWithAdditionalPageInfo} from "../types/User";
import {passwordRegex, phoneRegex, usernameRegex} from "@src/utils/Miscellaneous";
import {useTranslation} from "react-i18next";

export const useFormSchemas = () => {
  const { t } = useTranslation();

  const username = z.string().trim().min(1, t('validation.id'))
      .regex(usernameRegex, t('validation.id-regex'));
  const groups = z.string().trim().min(1, t('validation.groups'));
  const firstName = z.string().min(1, t('validation.first-name'));
  const email = z.string().min(1, t('validation.email')).email(t('validation.email-regex'));
  const enabled = z.boolean().optional();
  const attributes = z.object({
    phone: z.string().regex(phoneRegex, t('validation.phone')),
    unit: z.string().trim().min(1, t('validation.unit')),
    division: z.string({
      required_error: t('validation.division')
    }),
    level: z.string().optional()
  }).required({
    phone: true,
    unit: true,
    division: true
  });

  const updateUserForm = z.object({
    groups,
    username,
    firstName,
    email,
    enabled,
    attributes,
  });

  const createUserForm = z.object({
    password: z.string()
        .min(8, t('validation.password-min'))
        .max(20, t('validation.password-max'))
        .regex(passwordRegex, t('validation.password-regex')),
    passwordConfirm: z.string().min(8, t('validation.password-min')).optional(),
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
        message: t('validation.password-confirm'),
      });

  return {
    updateUserForm,
    createUserForm
  };
};

export type FormSchemas = ReturnType<typeof useFormSchemas>;
export type CreateUserForm = z.infer<FormSchemas['createUserForm']>;
export type UpdateUserForm = z.infer<FormSchemas['updateUserForm']>;

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
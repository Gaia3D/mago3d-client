import {zodResolver} from "@hookform/resolvers/zod";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {SubmitHandler, useForm} from "react-hook-form";
import {CreateUserForm, createUserFormToUserRepresentation, useFormSchemas} from "@src/api/User";
import {Suspense, useRef} from "react";
import {useKcAdminClient} from "@src/provider/KeycloakAdminClientProvider";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {AppLoader} from "@mnd/shared";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

type duplicatedType = 'notyet' | 'success';

export const Create = () => {
  const {t} = useTranslation();
  const { createUserForm } = useFormSchemas();
  const navigate = useNavigate();
  const kcAdminClient = useKcAdminClient();
  const duplicatedCheck = useRef<HTMLInputElement>(null);
  const {mutateAsync: createMutateAsync} = useMutation({
    mutationFn: (user: UserRepresentation) => kcAdminClient.users.create(user)
  });

  const {
    register,
    handleSubmit,
    formState: {errors},
    getValues,
    setError,
    clearErrors,
    reset
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserForm)
  });
  const {data: groups} = useSuspenseQuery({
    queryKey: ['groups'],
    queryFn: () => kcAdminClient.groups.find(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const createTestUser = () => {
    for(let i =0; i<100; ++i) {
      const data = {
        username: 'username' + i,
        firstName: '사용자명' +i,
        credentials: [
          {
            type: 'password',
            value: 'asdfasdf',
            temporary: false
          }
        ],
        enabled: true,
        groups: [
          '/일반 사용자'
        ],
        email: 'email' + i + '@mnd.com',
        attributes: {
          'phone': 'phone' + i,
          'division': 'army',
          'unit': '소속부대',
          'level': '계급',
        }
      }
      createMutateAsync(data);
    }
  }

  const onSubmit: SubmitHandler<CreateUserForm> = (data) => {

    if (!duplicatedCheck || !duplicatedCheck.current || duplicatedCheck.current.value === 'notyet') {
      setError('username', {message: t("validation.id-duplicated"), type: 'manual'});
      return;
    }

    const user: UserRepresentation = createUserFormToUserRepresentation(data);
    createMutateAsync(user, {
      onSuccess() {
        toast(t("success.create"));
        navigate(-1);
      },
      onError(error) {
        console.info(error);
        alert(t("error.admin"));
      },
    });
  }

  const checkDuplicate = () => {
    const currentUsername = getValues('username');
    if (!currentUsername || currentUsername.length === 0) {
      setError('username', {message: t("validation.id"), type: 'required'});
      return;
    }

    kcAdminClient.users.find({
      username: currentUsername,
      exact: true
    })
      .then((result) => {
        let dup: duplicatedType = 'success'
        let message = t("success.duplicate");

        if (result.length > 0) {
          dup = 'notyet';
          message = t("error.duplicated");
          setError('username', {message, type: 'manual'});
        } else {
          clearErrors('username');
        }

        alert(message);
        setDuplicate(dup);
      });
  }
  const setDuplicate = (value: duplicatedType = 'notyet') => {
    if (!duplicatedCheck || !duplicatedCheck.current) return;
    duplicatedCheck.current.value = value;
  }

  return (
    <Suspense fallback={<AppLoader/>}>
      <div className="contents">
        <h2>{t("create-user")}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="register">
            <input type="hidden" id="user-create-duplicated" ref={duplicatedCheck}
                   value={duplicatedCheck?.current?.value ? duplicatedCheck.current.value : 'notyet'}/>

            {errors.username && <div className="input-error">{errors.username.message}</div>}
            <label htmlFor="user-create-username">{t("user-id-army-number")}</label>
            <input type="text"
                   {...register("username")}
                   id="user-create-username"
                   onChange={() => setDuplicate()}
            />
            <button type="button" className="overlap-check" onClick={checkDuplicate}>{t("duplicate-check")}</button>

            {errors.groups && <div className="input-error">{errors.groups.message}</div>}
            <label htmlFor="user-create-groups">{t("user-group")}</label>
            <select
              {...register("groups")}
              id="user-create-groups"
              defaultValue={'/User'}
              autoComplete="username"
            >
              <option value="">{t("user-group-select")}</option>
              {
                groups?.map(({id, name, path}) => (
                  <option value={path} key={id}>{name}</option>
                ))
              }
            </select>

            {errors.firstName && <div className="input-error">{errors.firstName.message}</div>}
            <label htmlFor="user-create-firstName">{t("name")}</label>
            <input type="text"
                   {...register("firstName")}
                   id="user-create-firstName"
                   autoComplete="off"
            />

            {errors.password && <div className="input-error">{errors.password.message}</div>}
            <label htmlFor="user-create-password">{t("password")}</label>
            <input type="password"
                   {...register("password")}
                   id="user-create-password"
                   autoComplete="new-password"
            />

            {errors.passwordConfirm && <div className="input-error">{errors.passwordConfirm.message}</div>}
            <label htmlFor="user-create-passwordConfirm">{t("password-confirm")}</label>
            <input type="password"
                   {...register("passwordConfirm")}
                   id="user-create-passwordConfirm"
                   autoComplete="new-password"
            />

            {errors.email && <div className="input-error">{errors.email.message}</div>}
            <label htmlFor="user-create-email">{t("army-email")}</label>
            <input type="email"
                   {...register("email")}
                   id="user-create-email"
            />

            {(errors.attributes?.phone?.message && typeof errors.attributes?.phone?.message === 'string')
              && <div className="input-error">{errors.attributes.phone.message}</div>}
            <label htmlFor="user-create-attributes.phone">{t("phone-number")}</label>
            <input type="text"
                   {...register("attributes.phone")}
                   id="user-create-attributes.phone"
            />

            {errors.attributes?.division && <div className="input-error">{errors.attributes.division.message}</div>}
            {errors.attributes?.unit && <div className="input-error">{errors.attributes.unit.message}</div>}
            <label htmlFor="user-create-attributes.division">{t("division-unit")}</label>
            <select
              {...register("attributes.division")}
              id="user-create-attributes.division"
            >
              <option value="army">{t("army")}</option>
              <option value="navy">{t("navy")}</option>
              <option value="airforce">{t("airforce")}</option>
              <option value="marines">{t("marines")}</option>
              <option value="personnel">{t("personnel")}</option>
            </select>
            <input type="text"
                   {...register("attributes.unit")}
                   id="user-create-attributes.unit"
            />

            <label>{t("rank")}</label>
            <input type="text"
                   {...register("attributes.level")}
                   id="user-create-attributes.level"
            />
          </div>
          <div className="alg-right mar-t50">
            {/*<button type="button" className="btn-l-save" onClick={createTestUser}>테스트 사용자 생성</button>*/}
            <button type="submit" className="btn-l-save">{t("save")}</button>
            <button type="button" className="btn-l-cancel" onClick={() => reset()}>{t("reset")}</button>
            <button type="button" className="btn-l-cancel" onClick={() => navigate(-1)}>{t("list")}</button>
          </div>
        </form>
      </div>
    </Suspense>
  )
}

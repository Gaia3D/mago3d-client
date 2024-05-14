import { SubmitHandler, useForm } from "react-hook-form";
import { CreateGroupForm, createGroupForm, createGroupFormToGroupRepresentation } from "../../../api/Group";
import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from "@tanstack/react-query";
import { useKcAdminClient } from "../../../provider/KeycloakAdminClientProvider";

export const CreatePopup = ({popupToggle, refetch}: {
    popupToggle: React.Dispatch<React.SetStateAction<boolean>>,
    refetch: (options?: (RefetchOptions & RefetchQueryFilters) | undefined) => Promise<QueryObserverResult<GroupRepresentation[], unknown>>
}) => {

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
                alert('등록되었습니다');
                refetch();
                closePopup();
            },
            onError(e: unknown) {
                console.error(e);
                alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
            }
        });
    }

    return (
      <div className="popup-wrap">
          <div className="popup">
              <div className="popup-head">
                  <h3>사용자 그룹 등록</h3>
                  <button type="button" className="button-close" onClick={closePopup}></button>
              </div>
              <div className="popup-body">
                  <div className="content-inner">
                      <form onSubmit={handleSubmit(onSubmit)}>
                          <label htmlFor="group-create-name">그룹명</label>
                          <input type="text" id="group-create-name"
                                 {...register("name", {
                                     validate: value => !!value.trim(),
                                     required: '그룹명을 입력해주시기 바랍니다.',
                                 })}
                          />
                          {errors.name && <span style={{color: 'red', marginTop: '-15px'}}>{errors.name.message}</span>}
                          <label htmlFor="group-create-attributes.description">설명</label>
                          <input type="text" id="group-create-attributes.description"
                                 {...register("attributes.description")}
                          />
                          <button type="submit" className="btn-l-apply">등록</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    )
}

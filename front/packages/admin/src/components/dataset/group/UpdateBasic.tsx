import {useOutletContext} from "react-router-dom";
import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import {SubmitHandler, useForm} from "react-hook-form";
import {useToPath} from "@src/hooks/common";
import {toast} from "react-toastify";
import {UpdateGroupOutletContext} from "./GroupOutletContext";
import {useMutation} from "@apollo/client";
import {
  DatasetGroupListForUpdateDocument,
  DatasetUpdateGroupDocument,
  UpdateGroupInput
} from "@src/generated/gql/dataset/graphql";

const UpdateBasic = () => {
  const back = useToPath('/dataset/group');
  const {
    data: {group}
  } = useOutletContext<UpdateGroupOutletContext>();

  const [updateMutation] = useMutation(DatasetUpdateGroupDocument, {
    refetchQueries: [
      DatasetGroupListForUpdateDocument
    ],
    onCompleted() {
      toast('수정되었습니다');
    }
  });

  const {register, handleSubmit, formState: {errors}} = useForm<UpdateGroupInput>();

  const onSubmit: SubmitHandler<UpdateGroupInput> = (input) => {
    updateMutation({
      variables: {
        id: group.id,
        input
      }
    });
  }

  return (
    <Suspense fallback={<AppLoader/>}>
      <article>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>그룹명</label>
          <input type="text" defaultValue={group.name} {...register("name", {
            validate: value => !!value.trim()
          })}/>
          {errors.name && <span className="error">{errors.name.message}</span>}
          <br/>

          <label>설명</label>
          <input type="text" defaultValue={group.description} {...register("description")}/>
          {errors.description && <span className="error">{errors.description.message}</span>}
        </form>
      </article>
      <div className="alg-right">
        <button type="button" className="btn-l-save" onClick={handleSubmit(onSubmit)}>저장</button>
        <button type="button" className="btn-l-cancel" onClick={back}>뒤로</button>
      </div>
    </Suspense>
  )
}

export default UpdateBasic;
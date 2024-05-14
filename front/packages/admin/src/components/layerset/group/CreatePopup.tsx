import {SubmitHandler, useForm} from "react-hook-form";
import {CreateGroupInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useMutation} from "@apollo/client";
import {
  LayerAccess,
  LayersetCreateGroupDocument, LayersetGroupListDocument,
  LayersetGroupListWithAssetDocument
} from "@src/generated/gql/layerset/graphql";
import React from "react";

const CreatePopup = ({onClose}: {
  onClose: () => void,
}) => {

  const {register, handleSubmit, formState: {errors}} = useForm<CreateGroupInput>();

  const [createMutation] = useMutation(LayersetCreateGroupDocument,{
    refetchQueries: [LayersetGroupListDocument, LayersetGroupListWithAssetDocument]
  });

  const onSubmit: SubmitHandler<CreateGroupInput> = (input) => {
    // const input = Object.assign({}, DefaultLayerGroupInput, data);
    createMutation({
      variables: {
        input: {
          name: input.name,
          description: input.description,
          access: LayerAccess.Public,
          enabled: true
        }
      }
    }).then(onClose);
  }

  return (
    <div className="popup-wrap">
      <div className="popup">
        <div className="popup-head">
          <h3>레이어 그룹 등록</h3>
          <button type="button" className="button-close" onClick={onClose}></button>
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
                     {...register("description")}
              />
              <button type="submit" className="btn-l-apply">등록</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePopup;
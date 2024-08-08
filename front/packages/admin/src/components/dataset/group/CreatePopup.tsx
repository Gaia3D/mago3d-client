import {SubmitHandler, useForm} from "react-hook-form";
import React from "react";
import {CreateGroupInput, DatasetGroupListDocument, DatasetCreateGroupDocument} from "@src/generated/gql/dataset/graphql";
import {useMutation} from '@apollo/client';
import {useTranslation} from "react-i18next";

const CreatePopup = ({ onClose }: { onClose: () => void }) => {
  const {t} = useTranslation();
  const {register, handleSubmit, formState: { errors },} = useForm<CreateGroupInput>();

  const [createMutation] = useMutation(DatasetCreateGroupDocument, {
    refetchQueries: [DatasetGroupListDocument],
  });

  const onSubmit: SubmitHandler<CreateGroupInput> = (input) => {
    createMutation({
      variables: {
        input,
      },
    }).then(onClose);
  };

  return (
    <div className="popup-wrap">
      <div className="popup">
        <div className="popup-head">
          <h3>{t("create-data-group")}</h3>
          <button
            type="button"
            className="button-close"
            onClick={onClose}
          ></button>
        </div>
        <div className="popup-body">
          <div className="content-inner">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="datagroup-create-name">{t("group-name")}</label>
              <input
                type="text"
                id="datagroup-create-name"
                {...register("name", {
                  validate: (value) => !!value.trim(),
                  required: t("validation.required"),
                })}
              />
              {errors.name && (
                <span style={{ color: "red", marginTop: "-15px" }}>
                  {errors.name.message}
                </span>
              )}
              <label htmlFor="datagroup-create-description">{t("description")}</label>
              <input
                type="text"
                id="datagroup-create-description"
                {...register("description")}
              />
              <button type="submit" className="btn-l-apply">
                {t('register')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePopup;
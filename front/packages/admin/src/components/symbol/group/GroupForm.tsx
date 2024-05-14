import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SymbolGroupFormPropsType } from "../../../types/Symbol";
import {
  useCreateSymbolGroupMutation,
  useDeleteSymbolGroupMutation,
  useUpdateSymbolGroupMutation,
} from "../../../api/Symbol";

function GroupForm({
  id,
  name,
  enabled,
  onClickNew,
}: SymbolGroupFormPropsType) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const groupEnabledTRef = useRef<HTMLInputElement>(undefined);
  const groupEnabledFRef = useRef<HTMLInputElement>(undefined);

  const navigate = useNavigate();

  const toListById = () => {
    if (id) {
      navigate(`/symbol/list/${id}`);
    } else {
      navigate("/symbol/list");
    }
  };

  useEffect(() => {
    if (enabled === true) {
      groupEnabledTRef.current.checked = true;
      groupEnabledFRef.current.checked = false;
    } else if (enabled === false) {
      groupEnabledTRef.current.checked = false;
      groupEnabledFRef.current.checked = true;
    } else if (enabled === undefined) {
      groupEnabledTRef.current.checked = false;
      groupEnabledFRef.current.checked = false;
    }
    if (name) {
      groupNameRef.current.value = name;
    } else {
      groupNameRef.current.value = "";
    }
  }, [id]);

  const clearForm = () => {
    onClickNew();
    groupNameRef.current.value = "";
    groupEnabledTRef.current.checked = undefined;
    groupEnabledFRef.current.checked = undefined;
  };

  const createMutation = useCreateSymbolGroupMutation();
  const updateMutation = useUpdateSymbolGroupMutation();
  const deleteMutation = useDeleteSymbolGroupMutation();

  const checkChange = (before: string | boolean, after: string | boolean) => {
    if (before !== after) {
      return true;
    } else {
      return false;
    }
  };

  const handleUpdateButton = () => {
    const changedName = groupNameRef?.current?.value;
    let changedEnabled = undefined;
    if (groupEnabledTRef?.current?.checked) {
      changedEnabled = true;
    } else if (groupEnabledFRef?.current?.checked) {
      changedEnabled = false;
    }
    if (
      checkChange(name, changedName) ||
      checkChange(enabled, changedEnabled)
    ) {
      const input = {
        name: changedName,
        enabled: changedEnabled,
      };

      updateMutation
        .mutateAsync({ id, input })
        .then(clearForm)
        .then(() => alert("수정완료"))
        .catch((e) => alert("수정실패"));
    }
  };

  const handleDeleteButton = () => {
    deleteMutation
      .mutateAsync({ id })
      .then(clearForm)
      .then(() => alert("삭제완료"))
      .catch((e) => alert("삭제실패"));
  };

  const handleCreateButton = () => {
    const changedName = groupNameRef?.current?.value;
    let changedEnabled = undefined;
    if (groupEnabledTRef?.current?.checked) {
      changedEnabled = true;
    } else if (groupEnabledFRef?.current?.checked) {
      changedEnabled = false;
    }
    if (!changedName || changedEnabled === undefined) {
      alert("입력값을 확인해주세요.");
      return;
    }

    const input = {
      name: changedName,
      enabled: changedEnabled,
    };

    createMutation
      .mutateAsync({ input })
      .then(clearForm)
      .then(() => alert("생성완료"))
      .catch((e) => alert("생성실패"));
  };

  return (
    <>
      <div className="alg-right symbol-group-register">
        <div className="symbol-group-register-button">
          <button
            type="button"
            className="btn-basic mar-r5"
            onClick={clearForm}
          >
            신규등록
          </button>
          {id ? (
            <button
              type="button"
              className="btn-basic mar-r5"
              onClick={handleDeleteButton}
            >
              선택삭제
            </button>
          ) : (
            <></>
          )}
        </div>
        <label>심볼그룹명</label>
        <input type="text" defaultValue={name} ref={groupNameRef} />
        <label>사용여부</label>
        <div style={{ display: "inline" }}>
          <input
            id="group-enabled"
            type="radio"
            name="enabled"
            ref={groupEnabledTRef}
          />
          <label htmlFor={"group-enabled"} className="txt">
            사용
          </label>
          <input
            id="group-disabled"
            type="radio"
            name="enabled"
            ref={groupEnabledFRef}
          />
          <label htmlFor={"group-disabled"} className="txt">
            미사용
          </label>
        </div>
      </div>
      <div className="mar-t50 symbol-group-register-button-02">
        {id !== undefined ? (
          <button
            type="button"
            className="btn-l-save"
            onClick={handleUpdateButton}
          >
            수정
          </button>
        ) : (
          <button
            type="button"
            className="btn-l-save"
            onClick={handleCreateButton}
          >
            등록
          </button>
        )}
        <button type="button" className="btn-l-cancel" onClick={toListById}>
          목록
        </button>
      </div>
    </>
  );
}

export default GroupForm;

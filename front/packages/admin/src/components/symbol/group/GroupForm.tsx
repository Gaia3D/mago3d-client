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
    <section className="symbol-group-panel">
      <header className="symbol-group-header">
        <h3>{id ? '그룹 수정' : '그룹 생성'}</h3>
        <div className="header-actions">
          {id && (
            <button type="button" className="btn-outline danger" onClick={handleDeleteButton}>
              선택 그룹 삭제
            </button>
          )}
          <button type="button" className="btn-outline" onClick={toListById}>심볼 목록</button>
        </div>
      </header>

      <div className="form-group">
        <label htmlFor="group-name">심볼 그룹명</label>
        <input id="group-name" type="text" ref={groupNameRef} />
      </div>

      <div className="form-group">
        <label>사용 여부</label>
        <div className="form-radio-group">
          <label className="radio-label">
            <input type="radio" name="enabled" ref={groupEnabledTRef} />
            사용
          </label>
          <label className="radio-label">
            <input type="radio" name="enabled" ref={groupEnabledFRef} />
            미사용
          </label>
        </div>
      </div>

      <div className="symbol-group-footer">
        <button type="button" className="btn-secondary" onClick={clearForm}>
          초기화
        </button>
        {id ? (
          <button type="button" className="btn-primary" onClick={handleUpdateButton}>
            수정
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={handleCreateButton}>
            등록
          </button>
        )}
      </div>
    </section>
  );
}

export default GroupForm;

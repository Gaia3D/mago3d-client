import { SubmitHandler, useForm } from "react-hook-form";
import {
  CreateSymbolInput,
  SymbolGroup,
} from "@mnd/shared/src/types/bbs-gen-type";
import {
  symbolFileUpload,
  useCreateSymbolMutation,
  useSymbolGroups,
} from "../../../api/Symbol";
import { ChangeEvent, Key, useState } from "react";
import { UploadedSymbolFileType } from "../../../types/Symbol";
import { produce } from "immer";
import { useNavigate } from "react-router-dom";

function SymbolRegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [uploadedFileInfo, setUploadedFileInfo] =
    useState<UploadedSymbolFileType>({} as UploadedSymbolFileType);
  const [uploadState, setUploadState] = useState<boolean>(false)


  const {
    data: { symbolGroups },
  } = useSymbolGroups();

  const createMutation = useCreateSymbolMutation();

  const onSubmit: SubmitHandler<CreateSymbolInput> = (data) => {
    if (!uploadState) {
      alert("파일이 업로드 되지 않았습니다.");
      return
    }
    if (data && uploadedFileInfo.id) {
      const input = {
        groupId: data.groupId,
        name: data.name,
        uploadId: [uploadedFileInfo.id],
      };
      createMutation
        .mutateAsync({ input })
        .then(() => {
          navigate("/symbol/register");
          alert("심볼이 등록되었습니다");
        })
        .catch((e) => {
          alert("심볼 등록에 실패하였습니다.");
          console.error(e);
        });
    } else {
      alert('입력 값을 다시 확인해주세요')
      return
    }
  };

  const postFileUpload = async (data: File) => {
    const formData = new FormData();
    formData.append("files", data);
    try {
      const response = await symbolFileUpload({
        data: formData,
      });
      setUploadState(true)
      setUploadedFileInfo(
        produce((draft) => {
          draft.id = response.data[0].id;
          draft.src = response.data[0].download;
        })
      );
    } catch (error) {
      alert('파일 업로드에 실패했습니다.')
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        postFileUpload(file);
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = new Image();
          img.src = e.target?.result as string;

          img.onload = function () {
            setUploadedFileInfo(
              produce((draft) => {
                draft.size = (file.size / 1024).toFixed(2);
                draft.width = img.width;
                draft.height = img.height;
              })
            );
          };
        };
        reader.readAsDataURL(file);
      } else {
        alert("이미지 파일만 업로드 가능합니다.");
        return
      }
    }
  };

  const toListById = () => {
    navigate(`/symbol/list/${watch("groupId")}`);
  };

  return (
    <div className="contents">
      <h2>심볼 등록</h2>
      <div className="symbol-img">
        <img src={uploadedFileInfo.src || ""} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="symbol-write">
          <table>
            <caption>심볼 등록</caption>
            <thead>
              <tr>
                <td>심볼 그룹</td>
                <td>
                  <select
                    id="symbol-groups"
                    {...register("groupId", {
                      required: "심볼 그룹을 선택하세요.",
                    })}
                  >
                    {symbolGroups && symbolGroups.length > 0 ? (
                      symbolGroups.map((group: SymbolGroup, index: Key) => {
                        return (
                          <option key={index} value={group.id}>
                            {group.name}
                          </option>
                        );
                      })
                    ) : (
                      <option> 그룹이 없습니다. </option>
                    )}
                    <option>사용자정의 그룹</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>심볼명</td>
                <td>
                  <input
                    type="text"
                    id="symbol-name"
                    {...register("name", {
                      required: "심볼 명을 입력하세요",
                    })}
                  />
                  {errors.name && <span>심볼 명을 입력하세요.</span>}
                </td>
              </tr>
              <tr>
                <td>가로크기(px)</td>
                <td>
                  <input
                    type="text"
                    id="file-width"
                    defaultValue={uploadedFileInfo.width}
                  />
                </td>
              </tr>
              <tr>
                <td>세로크기(px)</td>
                <td>
                  <input
                    type="text"
                    id="file-height"
                    defaultValue={uploadedFileInfo.height}
                  />
                </td>
              </tr>
              <tr>
                <td>파일용량(KB)</td>
                <td>
                  <input
                    type="text"
                    id="file-size"
                    defaultValue={uploadedFileInfo.size}
                  />
                </td>
              </tr>
              <tr>
                <td>첨부파일</td>
                <td>
                  <input
                    type="file"
                    id="symbol-file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </td>
              </tr>
            </thead>
          </table>
        </div>
      </form>
      <div className="alg-right">
        <button
          type="button"
          className="btn-l-save"
          onClick={handleSubmit(onSubmit)}
        >
          등록
        </button>
        <button type="button" className="btn-l-cancel" onClick={toListById}>
          목록
        </button>
      </div>
    </div>
  );
}

export default SymbolRegisterForm;

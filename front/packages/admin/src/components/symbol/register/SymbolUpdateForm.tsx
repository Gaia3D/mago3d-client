import { useNavigate, useParams } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  SymbolGroup,
  UpdateSymbolInput,
} from "@mnd/shared/src/types/bbs-gen-type";
import { ChangeEvent, Key, useEffect, useState } from "react";
import {
  symbolFileUpload,
  useDeleteSymbolFileMutation,
  useSymbol,
  useSymbolGroups,
  useUpdateSymbolMutation,
} from "../../../api/Symbol";
import { produce } from "immer";
import { UploadedSymbolFileType } from "../../../types/Symbol";

function SymbolUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: symbolGroupsData, isError: symbolGroupsError } =
    useSymbolGroups();
  if (symbolGroupsError) return;
  const { symbolGroups } = symbolGroupsData;

  const {
    data: symbolData,
    isError: symbolError,
    refetch,
  } = useSymbol({ id: id });
  if (symbolError) return;
  const { symbol } = symbolData;
  const lastSymbolFileIndex = symbol.files.length - 1;

  const [uploadedFileInfo, setUploadedFileInfo] =
    useState<UploadedSymbolFileType>({} as UploadedSymbolFileType);
  const [uploadState, setUploadState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("groupId", symbol.group.id);
    setValue("name", symbol.name);

    setUploadedFileInfo(
      produce((draft) => {
        draft.name = symbol.name;
        draft.width = symbol.files[lastSymbolFileIndex].width;
        draft.height = symbol.files[lastSymbolFileIndex].height;
        draft.size = (
          parseInt(symbol.files[lastSymbolFileIndex].contentSize) / 1024
        ).toFixed(2);
        draft.src = symbol.files[lastSymbolFileIndex].download;
      })
    );
  }, []);

  const postFileUpload = async (data: File) => {
    const formData = new FormData();
    formData.append("files", data);
    try {
      const response = await symbolFileUpload({
        data: formData,
      });
      if (data) {
        setUploadState(true);
        setUploadedFileInfo(
          produce((draft) => {
            draft.id = response.data[0].id;
            draft.src = response.data[0].download;
          })
        );
      }
    } catch (error) {
      alert("파일 업로드에 실패했습니다.");
    }
  };

  const updateMutation = useUpdateSymbolMutation();
  const deleteMutation = useDeleteSymbolFileMutation();

  const onSubmit: SubmitHandler<UpdateSymbolInput> = (data) => {
    if (data && uploadedFileInfo) {
      // 파일 새로 업로드 한 경우 기존 심볼파일 삭제 처리
      if (
        uploadedFileInfo.id &&
        symbol.files[lastSymbolFileIndex].id !== uploadedFileInfo.id
      ) {
        if (!uploadState) {
          alert("파일이 업로드 되지 않았습니다.");
          return;
        }
        const id = symbol.files[lastSymbolFileIndex].id;
        deleteMutation
          .mutateAsync({ id })
          .then(() => {
            console.log("삭제 성공");
          })
          .catch((e) => {
            console.log("삭제 실패", e);
          });
      }
      const symbolInput = {
        id: symbol.id,
        input: {
          groupId: data.groupId,
          name: data.name,
          uploadId: uploadedFileInfo.id ? [uploadedFileInfo.id] : null,
        },
      };
      updateMutation
        .mutateAsync(symbolInput)
        .then(() => {
          refetch();
          alert("심볼이 수정되었습니다.");
        })
        .catch((e) => {
          console.error(e);
          alert("심볼 수정에 실패하였습니다.");
        });
    } else {
      alert("입력 값을 다시 확인해주세요");
      return;
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
      }
    }
  };

  const toListById = () => {
    navigate(`/symbol/list/${watch("groupId")}`);
  };

  return (
    <div className="contents">
      <h2>심볼 수정</h2>
      <div className="symbol-img">
        <img src={uploadedFileInfo.src} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="symbol-write">
          <table>
            <caption>심볼 등록</caption>
            <tbody>
              <tr>
                <td>심볼 그룹</td>
                <td>
                  <select
                    id="symbol-groups"
                    defaultValue={symbol.group.name}
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
                    defaultValue={uploadedFileInfo.name}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td>첨부파일</td>
                <td>
                  <input
                    type="file"
                    id="symbol-file"
                    onChange={handleFileChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
      <div className="alg-right">
        <button
          type="button"
          className="btn-l-save"
          onClick={handleSubmit(onSubmit)}
        >
          수정
        </button>
        <button type="button" className="btn-l-cancel" onClick={toListById}>
          목록
        </button>
      </div>
    </div>
  );
}

export default SymbolUpdateForm;

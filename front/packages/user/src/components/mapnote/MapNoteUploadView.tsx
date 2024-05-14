import { CreateMapNoteInput } from "@mnd/shared/src/types/bbs-gen-type";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { popupState } from "../MapPopup";
import {StyledDropzoneExcel} from "@/components/mapnote/Dropzone.tsx";
import {mapnoteExcelFileUpload as fileUpload} from "@/api/http.ts";
import {useRefetchMapNote} from "@/hooks/useMapNote.tsx";

interface UploadFile extends File {
  uuid: string
}

export const MapNoteUploadView = () => {
  const refetch = useRefetchMapNote();
  const setPopup = useSetRecoilState(popupState);
  const { register, handleSubmit, formState: { errors }, resetField} = useForm<CreateMapNoteInput>();

  const uploadedFilesState = useState<UploadFile[]>([]);
  const [uploadedFiles] = uploadedFilesState;
  const resetUploadFileState = useState<boolean>(false);
  const [resetUploadFile, setResetUploadFile] = resetUploadFileState;

  const reset = () => {
    setResetUploadFile(!resetUploadFile);
  }

  const upload = async () => {

    if (uploadedFiles.length === 0) {
      alert('등록할 파일이 없습니다. 확인 후 다시 시도해주세요.');
      return;
    }

    for (const file of uploadedFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([new Uint8Array(arrayBuffer)], { type : file.type} );
      const formData = new FormData();
      formData.append('files', blob, file.name);

      const response = await fileUpload({
        data: formData,
      }).then((res) => {
        alert('등록되었습니다.');
        refetch();
        console.log(res);
      }).catch((err) => {
        alert('등록에 실패했습니다.');
        console.error(err);
      });

    }
  }

  return (
    <div className="dialog-registerPoint darkMode">
      <div className="dialog-title">
          <h3>일괄등록</h3>
          <button className="close floatRight" onClick={()=>setPopup(null)}></button>						
      </div>
      <div className="dialog-content">
          <StyledDropzoneExcel uploadedFilesState={uploadedFilesState} reset={resetUploadFileState} acceptFile={{["application/vnd.ms-excel"]: [".xls", ".xlsx"]}}/>
      </div>
      <div className="darkMode-btn">
          <button type="submit" className="register" onClick={upload}><a>등록</a></button>
          <button type="button" className="cancel" onClick={reset}><a>초기화</a></button>
      </div>
    </div>
  )
}
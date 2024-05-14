import { useAnalResult } from "@/hooks/useAnalResult";

const ListViewButton = () => {
  const {resultLayers, setOpenResult,} = useAnalResult();

  const openListView = () => {
    if (Object.keys(resultLayers).length === 0) {
      alert('분석된 레이어가 없습니다. 분석 후 다시 시도해주세요.');
      return;
    }

    setOpenResult(true);
  }
  return (
    <div className="btn width-100" style={{textAlign:"center"}} onClick={openListView}>
      <button className="btn-cancel">분석 결과 목록 보기</button>
    </div>
  );
}
export default ListViewButton;

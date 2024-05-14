import {Suspense, useCallback} from "react";
import {AppLoader, dataFormatter, Pagination} from "@mnd/shared";
import {useNavigate} from "react-router-dom";

import SearchForm from "./SearchForm";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {dataCurrentPageState, dataSearchSelector} from "@src/recoils/Data";
import {classifyAssetTypeClassName, classifyAssetTypeName} from "@src/api/Data";
import {
  AssetType,
  DatasetAssetListDocument,
  DatasetAssetListQueryVariables,
  DatasetDeleteAssetDocument, ProcessTaskStatus
} from "@src/generated/gql/dataset/graphql";
import {ProcessStatus} from "../process/ProcessStatus";
import {useMutation, useQuery} from "@apollo/client";
import {toast} from "react-toastify";

const List = () => {
  const navigate = useNavigate();
  const setPage = useSetRecoilState<number>(dataCurrentPageState);
  const searchProps = useRecoilValue<DatasetAssetListQueryVariables>(dataSearchSelector);
  const toCreate = () => navigate('/dataset/asset/create/3d');

  // 발행 페이지로 이동
  const toPublish = useCallback((id:string) => navigate(`/layerset/publish/${id}`), [navigate]);

  const {data, loading} = useQuery(DatasetAssetListDocument, {
    variables: searchProps,
  });

  if(loading) return <AppLoader/>;

  const {items, pageInfo} = data.assets;

  return (
    <Suspense fallback={<AppLoader/>}>
      <div className="contents">
        <h2>데이터 관리</h2>
        <SearchForm/>
        <div className="alg-left mar-b10">
          <span className="result-list">검색결과 : 총 <span className="skyblue">{pageInfo.totalItems}</span>건</span>,
          <span className="result-page">
            <span className="skyblue">{pageInfo.page + 1}</span>/{pageInfo.totalPages} 페이지
          </span>
        </div>
        <div className="list07-sort">
          <table>
            <caption>데이터 관리</caption>
            <thead>
            <tr>
              {/* <th>데이터그룹 <a className="sort" href="#"></a></th> */}
              <th>타입 <a className="sort" href="#"></a></th>
              <th>데이터명 <a className="sort" href="#"></a></th>
              <th>상태 <a className="sort" href="#"></a></th>
              <th>발행</th>
              <th>수정</th>
              <th>삭제</th>
              <th>등록일 <a className="sort" href="#"></a></th>
            </tr>
            </thead>
            <tbody>
            {
              items.length > 0 ?
                items.map((asset, index) => {

                  const isDone = (asset.status === ProcessTaskStatus.Done) ||
                    (asset.assetType === AssetType.Imagery && ProcessTaskStatus.Ready);

                  return (
                    <tr key={index}>
                      {/* <td>group1</td> */}
                      <td><span
                        className={classifyAssetTypeClassName(asset.assetType)}>{classifyAssetTypeName(asset.assetType)}</span>
                      </td>
                      <AssetName id={asset.id} name={asset.name}/>
                      <td>
                        <ProcessStatus status={asset.status}/>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-s-edit"
                          onClick={() => toPublish(asset.id)}
                          disabled={!isDone}
                          style={!isDone ? {cursor: "not-allowed"} : undefined}
                        >
                          발행
                        </button>
                      </td>
                      <UpdateButton id={asset.id} assetType={asset.assetType}/>
                      <DeleteButton id={asset.id} name={asset.name}/>
                      <td>{dataFormatter(asset.createdAt ?? new Date().toISOString(), 'YYYY-MM-DD')}</td>
                    </tr>
                  )
                })
                :
                <tr>
                  <td colSpan={7}>데이터가 없습니다.</td>
                </tr>
            }
            </tbody>
          </table>
        </div>
        <div className="alg-right">
          <button type="button" className="btn-plus" onClick={toCreate}>업로드</button>
        </div>
        {
          pageInfo.totalPages > 0 ?
            <Pagination page={pageInfo.page} totalPages={pageInfo.totalPages} pagePerCount={pageInfo.size}
                        handler={setPage}/>
            : null
        }
      </div>
    </Suspense>
  )
}

function AssetName({id, name}: { id: string, name: string }) {
  const navigate = useNavigate();
  const toDetail = () => navigate(`/dataset/asset/${id}`);

  return (
    <td style={{cursor: 'pointer'}} onClick={toDetail}>{name}</td>
  );
}

function UpdateButton({id, assetType}: { id: string, assetType: AssetType }) {
  const navigate = useNavigate();
  const toUpdate = () => navigate(`/dataset/asset/update/${classifyAssetTypeName(assetType)}/${id}`);

  return (
    <td>
      <button type="button" className="btn-s-edit" onClick={toUpdate}>수정</button>
    </td>
  );
}

function DeleteButton({id, name}: { id: string, name: string }) {
  const [deleteMutation] = useMutation(DatasetDeleteAssetDocument, {
    refetchQueries: [DatasetAssetListDocument]
  });

  const toDelete = () => {
    if (window.confirm(`데이터 ${name}을 삭제하시겠습니까?`)) {
      deleteMutation({variables: {id}})
        .then(() => {
          toast('삭제되었습니다.');
        });
    }
  }

  return (
    <td>
      <button type="button" className="btn-s-delete" onClick={toDelete}>삭제</button>
    </td>
  );
}

export default List;
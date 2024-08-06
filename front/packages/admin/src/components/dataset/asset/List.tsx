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
import {useTranslation} from "react-i18next";

const List = () => {
  const {t} = useTranslation();
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
    <Suspense fallback={<AppLoader />}>
      <div className="contents">
        <h2>{t("data-management")}</h2>
        <SearchForm />
        <div className="alg-left mar-b10">
          <span className="result-list">
            {t("search-result")} : {t("total")}{" "}
            <span className="skyblue">{pageInfo.totalItems}</span>
            {t("cases")}
          </span>
          ,
          <span className="result-page">
            <span className="skyblue">{pageInfo.page + 1}</span>/
            {pageInfo.totalPages} {t("page")}
          </span>
        </div>
        <div className="list07-sort">
          <table>
            <caption>{t("data-management")}</caption>
            <thead>
              <tr>
                {/* <th>데이터그룹 <a className="sort" href="#"></a></th> */}
                <th>
                  {t("type")} <a className="sort" href="#"></a>
                </th>
                <th>
                  {t("data-name")} <a className="sort" href="#"></a>
                </th>
                <th>
                  {t("status")} <a className="sort" href="#"></a>
                </th>
                <th>{t("publish")}</th>
                <th>{t("edit")}</th>
                <th>{t("delete")}</th>
                <th>
                  {t("created-at")} <a className="sort" href="#"></a>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((asset, index) => {
                  const isDone =
                    asset.status === ProcessTaskStatus.Done ||
                    (asset.assetType === AssetType.Imagery &&
                      ProcessTaskStatus.Ready);

                  return (
                    <tr key={index}>
                      {/* <td>group1</td> */}
                      <td>
                        <span className={classifyAssetTypeClassName(asset.assetType)}>
                          {classifyAssetTypeName(asset.assetType)}
                        </span>
                      </td>
                      <AssetName id={asset.id} name={asset.name} />
                      <td>
                        <ProcessStatus status={asset.status} />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-s-edit"
                          onClick={() => toPublish(asset.id)}
                          disabled={!isDone}
                          style={
                            !isDone ? { cursor: "not-allowed" } : undefined
                          }
                        >
                          {t("publish")}
                        </button>
                      </td>
                      <UpdateButton id={asset.id} assetType={asset.assetType} />
                      <DeleteButton id={asset.id} name={asset.name} />
                      <td>
                        {dataFormatter(
                          asset.createdAt ?? new Date().toISOString(),
                          "YYYY-MM-DD"
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>{t("not-found.data")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="alg-right">
          <button type="button" className="btn-plus" onClick={toCreate}>
            {t("upload")}
          </button>
        </div>
        {pageInfo.totalPages > 0 ? (
          <Pagination
            page={pageInfo.page}
            totalPages={pageInfo.totalPages}
            pagePerCount={pageInfo.size}
            handler={setPage}
          />
        ) : null}
      </div>
    </Suspense>
  );
}

function AssetName({id, name}: { id: string, name: string }) {
  const navigate = useNavigate();
  const toDetail = () => navigate(`/dataset/asset/${id}`);

  return (
    <td style={{cursor: 'pointer'}} onClick={toDetail}>{name}</td>
  );
}

function UpdateButton({id, assetType}: { id: string, assetType: AssetType }) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const toUpdate = () => navigate(`/dataset/asset/update/${classifyAssetTypeName(assetType)}/${id}`);

  return (
    <td>
      <button type="button" className="btn-s-edit" onClick={toUpdate}>{t("edit")}</button>
    </td>
  );
}

function DeleteButton({id, name}: { id: string, name: string }) {
  const {t} = useTranslation();
  const [deleteMutation] = useMutation(DatasetDeleteAssetDocument, {
    refetchQueries: [DatasetAssetListDocument]
  });

  const toDelete = () => {
    if (window.confirm(t("data")+name+t("question.black-delete"))) {
      deleteMutation({variables: {id}})
        .then(() => {
          toast(t("success.deleted"));
        });
    }
  }

  return (
    <td>
      <button type="button" className="btn-s-delete" onClick={toDelete}>{t("delete")}</button>
    </td>
  );
}

export default List;
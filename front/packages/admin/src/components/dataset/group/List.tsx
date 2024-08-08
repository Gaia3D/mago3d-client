import {useState} from "react";
import CreatePopup from "./CreatePopup";
import {alertToast} from "@mnd/shared/src/utils/toast";
import {useNavigate} from "react-router-dom";
import {DatasetDeleteGroupDocument, DatasetGroupListDocument,} from "@src/generated/gql/dataset/graphql";
import {useMutation, useSuspenseQuery} from '@apollo/client';
import {useTranslation} from "react-i18next";

const List = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {data} = useSuspenseQuery(DatasetGroupListDocument);

  const [deleteMutation] = useMutation(DatasetDeleteGroupDocument, {
    refetchQueries: [DatasetGroupListDocument]
  });

  const toDetail = (id:string) => navigate(`/dataset/group/update/basic/${id}`);

  const handleDelete = (id:string) => {
    if (!confirm(t('question.delete'))) return;
    deleteMutation({
      variables: {
        id,
      }
    }).then(() => {
      alertToast(t('success.delete'));
    });
  };

  const {groups: {items}} = data;

  return (
    <>
      <div className="contents">
        <h2>{t("data-group-management")}</h2>
        <div className="list02 blue-title-inner">
          <table>
            <caption>{t("data-group-management")}</caption>
            <thead>
              <tr>
                <th>{t("group")}</th>
                <th>{t("delete")}</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="list02 inner">
          <table>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td className="group" onClick={() => toDetail(item.id)}>
                        <span className="folder-close"></span> {item.name}
                      </td>
                      <td>
                        <button type="button" className="btn-s-delete" onClick={() => handleDelete(item.id)}>
                          {t("delete")}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="group" style={{ textAlign: "center" }} colSpan={2}>
                    {t("not-found.group")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="alg-right">
          <button type="button" className="btn-plus" onClick={() => setIsOpen(true)}>
            {t("add-group")}
          </button>
        </div>
      </div>
      {isOpen && <CreatePopup onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default List;
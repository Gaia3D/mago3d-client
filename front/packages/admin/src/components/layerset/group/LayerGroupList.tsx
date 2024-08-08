import {Suspense, useCallback, useState} from "react";
import CreatePopup from "./CreatePopup";
import {getQueryClient} from "@src/api/QueryClient";
import {LayerAccess, LayersetDeleteGroupDocument, LayersetGroupListDocument, LayersetUpdateGroupDocument} from "@src/generated/gql/layerset/graphql";
import {useMutation, useSuspenseQuery} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {alertToast} from "@mnd/shared/src/utils/toast";
import {useTranslation} from "react-i18next";

const LayerGroupList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [onCreate, setOnCreate] = useState<boolean>(false);
  const {data} = useSuspenseQuery(LayersetGroupListDocument);

  const [updateMutation] = useMutation(LayersetUpdateGroupDocument, {
    refetchQueries: [LayersetGroupListDocument]
  });

  const [deleteMutation] = useMutation(LayersetDeleteGroupDocument, {
    refetchQueries: [LayersetGroupListDocument]
  });

  const toDetail = (id:string) => navigate(`/layerset/group/update/basic/${id}`);

  const invalidateQueries = () => getQueryClient().invalidateQueries({queryKey: ['layerGroups']});

  const toggleAccess = useCallback((group) => {
    const access = group.access === LayerAccess.Public ? LayerAccess.Private : LayerAccess.Public;
    updateMutation({
      variables: {
        id: group.id,
        input: {
          access
        }
      }
    });
  }, [updateMutation]);

  const deleteGroup = useCallback((group) => {
    if (!confirm(t("question.delete"))) return;
    deleteMutation(
      {variables: {id: group.id}}
    ).then((data) => {
      alertToast(t("success.delete"));
    }).catch((e) => {
      alert(e.message);
    });
  }, [deleteMutation, invalidateQueries]);

  const {groups} = data;

  return (
      <Suspense fallback>
      <div className="contents">
        <h2>{t("layer-group-management")}</h2>
        <div className="list type-04 blue-title-inner">
          <table>
            <caption>{t("layer-group-management")}</caption>
            <thead>
            <tr>
              <th>{t("layer-group")}</th>
              <th>{t("authority")}</th>
              <th>{t("delete")}</th>
            </tr>
            </thead>
          </table>
        </div>
        <div className="list type-04 inner">
          <table>
            <tbody>
            {
              groups && groups.length > 0 ? groups.map(group => {
                    return (
                        <tr key={group.id}>
                          <td className="group" onClick={() => toDetail(group.id)}>
                            <span className="folder-close"></span> {group.name}
                          </td>
                          <td className="tleft">
                            <label className="switch">
                              <input type={"checkbox"} defaultChecked={group.access === LayerAccess.Public}
                                     id={`access-${group.id}`}
                                     onChange={() => toggleAccess(group)}/>
                              <span className="slider"></span>
                            </label>
                            <label htmlFor={`access-${group.id}`} style={{cursor: "pointer", marginLeft: "5px"}}>
                              {group.access === LayerAccess.Public ? t("public") : t("private")}
                            </label>
                          </td>
                          <td>
                            <button type="button" className="btn-s-delete" onClick={() => deleteGroup(group)}>
                              {t("delete")}
                            </button>
                          </td>
                        </tr>
                    )
                  })
                  :
                  (
                      <tr>
                        <td className="group" style={{textAlign: 'center'}} colSpan={3}>{t("not-found.group")}</td>
                      </tr>
                  )
            }
            </tbody>
          </table>
        </div>
        <div className="alg-right">
          <button type="button" className="btn-plus" onClick={() => setOnCreate(true)}>{t("add-group")}</button>
        </div>
      </div>
      {
        onCreate && <CreatePopup onClose={() => setOnCreate(false)}/>
      }
      </Suspense>
  )
};

export default LayerGroupList;
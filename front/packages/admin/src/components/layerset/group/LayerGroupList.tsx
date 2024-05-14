import {Suspense, useCallback, useState} from "react";
import CreatePopup from "./CreatePopup";
import {getQueryClient} from "@src/api/QueryClient";
import {LayerAccess, LayersetDeleteGroupDocument, LayersetGroupListDocument, LayersetUpdateGroupDocument} from "@src/generated/gql/layerset/graphql";
import {useMutation, useSuspenseQuery} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {alertToast} from "@mnd/shared/src/utils/toast";

const LayerGroupList = () => {
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
    if (!confirm('삭제하시겠습니까?')) return;
    deleteMutation(
      {variables: {id: group.id}}
    ).then((data) => {
      alertToast('삭제되었습니다.');
    }).catch((e) => {
      alert(e.message);
    });
  }, [deleteMutation, invalidateQueries]);

  const {groups} = data;

  return (
      <Suspense fallback>
      <div className="contents">
        <h2>레이어 그룹 관리</h2>
        <div className="list type-04 blue-title-inner">
          <table>
            <caption>레이어 그룹 관리</caption>
            <thead>
            <tr>
              <th>레이어 그룹</th>
              <th>권한</th>
              <th>삭제</th>
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
                              {group.access === LayerAccess.Public ? '공개' : '비공개'}
                            </label>
                          </td>
                          <td>
                            <button type="button" className="btn-s-delete" onClick={() => deleteGroup(group)}>
                              삭제
                            </button>
                          </td>
                        </tr>
                    )
                  })
                  :
                  (
                      <tr>
                        <td className="group" style={{textAlign: 'center'}} colSpan={3}>그룹이 없습니다.</td>
                      </tr>
                  )
            }
            </tbody>
          </table>
        </div>
        <div className="alg-right">
          <button type="button" className="btn-plus" onClick={() => setOnCreate(true)}>그룹 추가</button>
        </div>
      </div>
      {
        onCreate && <CreatePopup onClose={() => setOnCreate(false)}/>
      }
      </Suspense>
  )
};

export default LayerGroupList;
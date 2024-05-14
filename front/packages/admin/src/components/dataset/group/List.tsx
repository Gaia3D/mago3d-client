import {useState} from "react";
import CreatePopup from "./CreatePopup";
import {alertToast} from "@mnd/shared/src/utils/toast";
import {useNavigate} from "react-router-dom";
import {DatasetDeleteGroupDocument, DatasetGroupListDocument,} from "@src/generated/gql/dataset/graphql";
import {useMutation, useSuspenseQuery} from '@apollo/client';

const List = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {data} = useSuspenseQuery(DatasetGroupListDocument);

  const [deleteMutation] = useMutation(DatasetDeleteGroupDocument, {
    refetchQueries: [DatasetGroupListDocument]
  });

  const toDetail = (id:string) => navigate(`/dataset/group/update/basic/${id}`);

  const handleDelete = (id:string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    deleteMutation({
      variables: {
        id,
      }
    }).then(() => {
      alertToast('삭제되었습니다.');
    });
  };


  const {
    groups: {items}
  } = data;

  return (
    <>
    <div className="contents">
      <h2>데이터 그룹 관리</h2>
      <div className="list02 blue-title-inner">
        <table>
          <caption>데이터 그룹 관리</caption>
          <thead>
          <tr>
            <th>그룹</th>
            <th>삭제</th>
          </tr>
          </thead>
        </table>
      </div>
      <div className="list02 inner">
        <table>
          <tbody>
          {
            items.length > 0 ? items.map(item => {
                  return (
                      <tr key={item.id}>
                        <td className="group" onClick={() => toDetail(item.id)}>
                          <span className="folder-close"></span> {item.name}
                        </td>
                        <td>
                          <button type="button" className="btn-s-delete" onClick={() => handleDelete(item.id)}>삭제
                          </button>
                        </td>
                      </tr>
                  );
                })
                :
                <tr>
                  <td className="group" style={{textAlign: 'center'}} colSpan={2}>등록된 그룹이 없습니다.</td>
                </tr>
          }
          </tbody>
        </table>
    </div>
    <div className="alg-right">
          <button type="button" className="btn-plus" onClick={() => setIsOpen(true)}>그룹 추가</button>
        </div>
      </div>
      {
        isOpen && <CreatePopup onClose={() => setIsOpen(false)}/>
      }
    </>
  )
}

export default List;
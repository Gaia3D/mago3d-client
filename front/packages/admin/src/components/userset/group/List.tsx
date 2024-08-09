import {useKcAdminClient} from "@src/provider/KeycloakAdminClientProvider";
import {Suspense, useState} from "react";
import {AppLoader} from "@mnd/shared";
import {CreatePopup, ListItem} from "./index";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

export const List = () => {
  const {t} = useTranslation();
  const [onCreate, setOnCreate] = useState<boolean>(false);
  const kcAdminClient = useKcAdminClient();
  const changeOnCreate = () => setOnCreate(!onCreate);

  const {data, refetch} = useSuspenseQuery({
    queryKey: ['groups'],
    queryFn: () => kcAdminClient.groups.find(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 0,
    gcTime: 0,
  });

  return (
    <Suspense fallback={<AppLoader />}>
      <div className="contents">
        <h2>{t("user-group-management")}</h2>
        <div className="list type-04 blue-title-inner">
          <table>
            <caption>{t("user-group-management")}</caption>
            <thead>
              <tr>
                <th>{t("group-name")}</th>
                {/*<th>수정</th>*/}
                <th>{t("delete")}</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="list type-04 inner">
          <table>
            <tbody>
              {data && data.length > 0 ? (
                data.map((group) => (
                  <ListItem key={group.id} group={group} refetch={refetch} />
                ))
              ) : (
                <tr>
                  <td className="group" style={{ textAlign: "center" }} colSpan={3}>
                    {t("not-found.group")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="alg-right">
          <button type="button" className="btn-plus" onClick={changeOnCreate}>
            {t("add-group")}
          </button>
        </div>
      </div>
      {onCreate && <CreatePopup popupToggle={setOnCreate} refetch={refetch} />}
    </Suspense>
  );
}

import {IUserInfo} from "@mnd/shared";
import {useCallback, useEffect} from "react";
import {useRecoilValueLoadable} from "recoil";
import {currentUserProfileSelector} from "../recoils/Auth";
import {useMutation} from "@apollo/client";
import {
  UsersetEnableUser03Document,
  UsersetEnableUser10Document,
  UsersetEnableUser30Document,
  UsersetEnableUserDocument
} from "@src/generated/gql/userset/graphql";
import {chunk} from "lodash";

export const useChangeUserProfileEvent = (callback: (contents: IUserInfo) => void) => {
  const loadable = useRecoilValueLoadable<IUserInfo | null>(currentUserProfileSelector);
  const {state, contents} = loadable;
  useEffect(() => {
    if (state !== 'loading' && contents) callback(contents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, contents]);
}

export const useUpdateUserEnabled = () => {
  const [updateMutation01] = useMutation(UsersetEnableUserDocument);
  const [updateMutation03] = useMutation(UsersetEnableUser03Document);
  const [updateMutation10] = useMutation(UsersetEnableUser10Document);
  const [updateMutation30] = useMutation(UsersetEnableUser30Document);

  return useCallback(async (values: string[], enabled: boolean) => {
    // @formatter:off
    const chunked = chunk(values, 30);
    for (const ids of chunked) {
        if (ids.length === 30) {
            await updateMutation30({
                variables: {
                    id0: ids[0], id1: ids[1], id2: ids[2], id3: ids[3], id4: ids[4], id5: ids[5], id6: ids[6], id7: ids[7], id8: ids[8], id9: ids[9],
                    id10: ids[10], id11: ids[11], id12: ids[12], id13: ids[13], id14: ids[14], id15: ids[15], id16: ids[16], id17: ids[17], id18: ids[18], id19: ids[19],
                    id20: ids[20], id21: ids[21], id22: ids[22], id23: ids[23], id24: ids[24], id25: ids[25], id26: ids[26], id27: ids[27], id28: ids[28], id29: ids[29],
                    enabled
                }
            })
        } else {
            const chunked = chunk(ids, 10);
            for (const ids of chunked) {
              if (ids.length === 10) {
                await updateMutation10({
                  variables: {
                    id0: ids[0], id1: ids[1], id2: ids[2], id3: ids[3], id4: ids[4], id5: ids[5], id6: ids[6], id7: ids[7], id8: ids[8], id9: ids[9],
                    enabled
                  }
                })
              } else {
                const chunked = chunk(ids, 3);
                for (const ids of chunked) {
                  if(ids.length === 3) {
                    await updateMutation03({
                      variables: {
                        id0: ids[0], id1: ids[1], id2: ids[2],
                        enabled
                      }
                    })
                  } else {
                    for (const id of ids) {
                      await updateMutation01({variables: {id, enabled}});
                    }
                  }
                }
              }
            }
        }
    }
    // @formatter:on
  }, [updateMutation01, updateMutation03, updateMutation10, updateMutation30]);
};
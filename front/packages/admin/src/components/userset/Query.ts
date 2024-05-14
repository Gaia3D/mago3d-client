import gql from "graphql-tag";

gql`
  query UsersetGroups @api(name: userset) {
    userGroups {
        items {
            id
            name
        }
    }
  }
`

gql`
    mutation UsersetEnableUser($id: ID!, $enabled: Boolean!) @api(name: userset) {
        updateUser(id: $id, input: {enabled: $enabled}) {id}
    }

    mutation UsersetEnableUser03($id0: ID!, $id1: ID!, $id2: ID!, $enabled: Boolean!) @api(name: userset) {
        a0: updateUser(id: $id0, input: {enabled: $enabled}) {id}
        a1: updateUser(id: $id1, input: {enabled: $enabled}) {id}
        a2: updateUser(id: $id2, input: {enabled: $enabled}) {id}
    }

    mutation UsersetEnableUser10($id0: ID!, $id1: ID!, $id2: ID!, $id3: ID!, $id4: ID!, $id5: ID!, $id6: ID!, $id7: ID!, $id8: ID!, $id9: ID!, $enabled: Boolean!) @api(name: userset) {
        a0: updateUser(id: $id0, input: {enabled: $enabled}) {id}
        a1: updateUser(id: $id1, input: {enabled: $enabled}) {id}
        a2: updateUser(id: $id2, input: {enabled: $enabled}) {id}
        a3: updateUser(id: $id3, input: {enabled: $enabled}) {id}
        a4: updateUser(id: $id4, input: {enabled: $enabled}) {id}
        a5: updateUser(id: $id5, input: {enabled: $enabled}) {id}
        a6: updateUser(id: $id6, input: {enabled: $enabled}) {id}
        a7: updateUser(id: $id7, input: {enabled: $enabled}) {id}
        a8: updateUser(id: $id8, input: {enabled: $enabled}) {id}
        a9: updateUser(id: $id9, input: {enabled: $enabled}) {id}
    }

    mutation UsersetEnableUser30(
        $id0: ID!, $id1: ID!, $id2: ID!, $id3: ID!, $id4: ID!, $id5: ID!, $id6: ID!, $id7: ID!, $id8: ID!, $id9: ID!,
        $id10: ID!, $id11: ID!, $id12: ID!, $id13: ID!, $id14: ID!, $id15: ID!, $id16: ID!, $id17: ID!, $id18: ID!, $id19: ID!,
        $id20: ID!, $id21: ID!, $id22: ID!, $id23: ID!, $id24: ID!, $id25: ID!, $id26: ID!, $id27: ID!, $id28: ID!, $id29: ID!,
        $enabled: Boolean!) @api(name: userset) {
        a0: updateUser(id: $id0, input: {enabled: $enabled}) {id}
        a1: updateUser(id: $id1, input: {enabled: $enabled}) {id}
        a2: updateUser(id: $id2, input: {enabled: $enabled}) {id}
        a3: updateUser(id: $id3, input: {enabled: $enabled}) {id}
        a4: updateUser(id: $id4, input: {enabled: $enabled}) {id}
        a5: updateUser(id: $id5, input: {enabled: $enabled}) {id}
        a6: updateUser(id: $id6, input: {enabled: $enabled}) {id}
        a7: updateUser(id: $id7, input: {enabled: $enabled}) {id}
        a8: updateUser(id: $id8, input: {enabled: $enabled}) {id}
        a9: updateUser(id: $id9, input: {enabled: $enabled}) {id}
        a10: updateUser(id: $id10, input: {enabled: $enabled}) {id}
        a11: updateUser(id: $id11, input: {enabled: $enabled}) {id}
        a12: updateUser(id: $id12, input: {enabled: $enabled}) {id}
        a13: updateUser(id: $id13, input: {enabled: $enabled}) {id}
        a14: updateUser(id: $id14, input: {enabled: $enabled}) {id}
        a15: updateUser(id: $id15, input: {enabled: $enabled}) {id}
        a16: updateUser(id: $id16, input: {enabled: $enabled}) {id}
        a17: updateUser(id: $id17, input: {enabled: $enabled}) {id}
        a18: updateUser(id: $id18, input: {enabled: $enabled}) {id}
        a19: updateUser(id: $id19, input: {enabled: $enabled}) {id}
        a20: updateUser(id: $id20, input: {enabled: $enabled}) {id}
        a21: updateUser(id: $id21, input: {enabled: $enabled}) {id}
        a22: updateUser(id: $id22, input: {enabled: $enabled}) {id}
        a23: updateUser(id: $id23, input: {enabled: $enabled}) {id}
        a24: updateUser(id: $id24, input: {enabled: $enabled}) {id}
        a25: updateUser(id: $id25, input: {enabled: $enabled}) {id}
        a26: updateUser(id: $id26, input: {enabled: $enabled}) {id}
        a27: updateUser(id: $id27, input: {enabled: $enabled}) {id}
        a28: updateUser(id: $id28, input: {enabled: $enabled}) {id}
        a29: updateUser(id: $id29, input: {enabled: $enabled}) {id}
    }
`
import gql from "graphql-tag";

export const DELETE_MAP_NOTE_FILE = gql`
    mutation DELETE_MAP_NOTE_FILE($id:ID!) {
        deleteMapNoteFile (
            id: [$id]
        )
    }
`;

export const DELETE_ALL_MAP_NOTES = gql`
    mutation DELETE_ALL_MAP_NOTES {
        deleteAllMapNotes
    }
`

export const DELETE_MAP_NOTE = gql`
    mutation DELETE_MAP_NOTE($id:ID!) {
        deleteMapNote (
            id: [$id]
        )
    }
`

export const CREATE_MAP_NOTE = gql`
    mutation CREATE_MAP_NOTE($input: CreateMapNoteInput!) {
        createMapNote (
            input: $input
        )
        {
            id
            title
            content
        }
    }
`;

export const UPDATE_MAP_NOTE = gql`
    mutation UPDATE_MAP_NOTE($id: ID!, $input: UpdateMapNoteInput!) {
        updateMapNote (
            id: $id
            input: $input
        )
        {
            id
            title
            content
        }
    }
`;
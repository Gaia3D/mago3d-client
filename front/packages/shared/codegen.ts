import {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
  //schema: 'https://mdtp.gaia3d.com/app/api',
  ignoreNoDocuments: true,
  generates: {
    "src/types/dataset/gql/": {
      schema: "https://mdtp.gaia3d.com/app/api/dataset/graphql",
      documents: "src/types/dataset/doc/*.graphql",
      plugins: [],
      preset: "client",
    },
    "src/types/layerset/gql/": {
      schema: "https://mdtp.gaia3d.com/app/api/layerset/graphql",
      documents: "src/types/layerset/*.{ts,tsx,graphql}",
      plugins: [],
      preset: "client",
    },
    "src/types/userset/gql/": {
      schema: "https://mdtp.gaia3d.com/app/api/userset/graphql",
      documents: "src/types/userset/doc/*.{ts,tsx,graphql}",
      plugins: [],
      preset: "client",
    },
  },
};

export default config;

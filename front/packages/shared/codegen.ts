import {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
  //schema: 'https://mdtp.gaia3d.com/app/api',
  ignoreNoDocuments: true,
  generates: {
    "src/types/bbs-gen-type.ts": {
      schema: "https://mdtp.gaia3d.com/app/api/bbs/graphql?path=/app/api/bbs/graphql",
      plugins: ["typescript", "typescript-operations", "typescript-graphql-request"],
    },
    "src/types/dataset-gen-type.ts": {
      schema: "https://mdtp.gaia3d.com/app/api/dataset/graphql?path=/app/api/dataset/graphql",
      plugins: ["typescript", "typescript-operations", "typescript-graphql-request"],
    },
    "src/types/dataset/gql/": {
      schema: "https://mdtp.gaia3d.com/app/api/dataset/graphql",
      documents: "src/types/dataset/doc/*.graphql",
      plugins: [],
      preset: "client",
    },
    "src/types/layerset/gql/": {
      schema: "https://mdtp.gaia3d.com/app/api/layerset/graphql",
      documents: "src/types/layerset/*.graphql",
      plugins: [],
      preset: "client",
    },
    "src/types/userset/gql/": {
      schema: "https://mdtp.gaia3d.com/app/api/userset/graphql",
      documents: "src/types/userset/doc/*.graphql",
      plugins: [],
      preset: "client",
    },
    "src/types/timeseries/gql/": {
      schema: "https://mdtp.gaia3d.com/app/api/timeseries/graphql",
      documents: "src/types/timeseries/*.graphql",
      plugins: [],
      preset: "client",
    },
    "src/types/bbs/gql/": {
      schema: "https://mdtp.gaia3d.com/app/api/bbs/graphql",
      documents: "src/types/bbs/*.graphql",
      plugins: [],
      preset: "client",
    },
    "src/types/search/gql/": {
      schema: "https://mdtp.gaia3d.com/app/api/search/graphql",
      documents: "src/types/search/*.graphql",
      plugins: [],
      preset: "client",
    },
    "src/types/search-gen-type.ts": {
        schema: "https://mdtp.gaia3d.com/app/api/search/graphql?path=/app/api/bbs/graphql",
        plugins: ["typescript", "typescript-operations", "typescript-graphql-request"],
    },
    "src/types/timeseries-gen-type.ts": {
        schema: "https://mdtp.gaia3d.com/app/api/timeseries/graphql?path=/app/api/bbs/graphql",
        plugins: ["typescript", "typescript-operations", "typescript-graphql-request"],
    },
  },
};

export default config;

import {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
  //schema: 'https://mdtp.gaia3d.com/app/api',
  ignoreNoDocuments: true,
  generates: {
    "src/generated/gql/bbs/": {
      schema: "https://mdtp.gaia3d.com/app/api/bbs/graphql",
      documents: ["src/{graphql,components,pages}/article/**/*.{ts,tsx,graphql}", "src/graphql/bbs/doc/*"],
      plugins: [],
      preset: "client",
    },
    "src/generated/gql/dataset/": {
      schema: "https://mdtp.gaia3d.com/app/api/dataset/graphql",
      documents: ["src/{components,graphql,pages}/dataset/**/*.{ts,tsx,graphql}", 'src/api/**/*.{ts,tsx,graphql}'],
      plugins: [],
      preset: "client",
    },
    "src/generated/gql/layerset/": {
      schema: "https://mdtp.gaia3d.com/app/api/layerset/graphql",
      documents: ["src/{components,graphql,pages}/layerset/**/*.{ts,tsx,graphql}"],
      plugins: [],
      preset: "client",
    },
    "src/generated/gql/userset/": {
      schema: "https://mdtp.gaia3d.com/app/api/userset/graphql",
      documents: ["src/{components,pages}/userset/**/*.{ts,tsx,graphql}"],
      plugins: [],
      preset: "client",
    },
    "src/generated/gql/timeseries/": {
      schema: "https://mdtp.gaia3d.com/app/api/timeseries/graphql",
      documents: "src/graphql/timeseries/**/*.{ts,tsx,graphql}",
      plugins: [],
      preset: "client",
    },
  },
};

export default config;

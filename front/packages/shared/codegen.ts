import type { CodegenConfig } from "@graphql-codegen/cli";
import * as https from "https";
import type { RequestInit, Response } from "node-fetch";

const fetchWithAgent = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  const fetch = (await import("node-fetch")).default;
  return fetch(url, {
    ...options,
    agent: new https.Agent({ rejectUnauthorized: false }),
  });
};

const config: CodegenConfig = {
  ignoreNoDocuments: true,
  generates: {
    "src/types/dataset/gql/": {
      schema: {
        "https://59.27.63.245/app/api/dataset/graphql": {
          customFetch: fetchWithAgent,
        },
      } as unknown as string,
      documents: "src/types/dataset/doc/*.graphql",
      plugins: [],
      preset: "client",
    },
    "src/types/layerset/gql/": {
      schema: {
        "https://59.27.63.245/app/api/layerset/graphql": {
          customFetch: fetchWithAgent,
        },
      } as unknown as string,
      documents: "src/types/layerset/doc/*.{ts,tsx,graphql}",
      plugins: [],
      preset: "client",
    },
    "src/types/userset/gql/": {
      schema: {
        "https://59.27.63.245/app/api/userset/graphql": {
          customFetch: fetchWithAgent,
        },
      } as unknown as string,
      documents: "src/types/userset/doc/*.{ts,tsx,graphql}",
      plugins: [],
      preset: "client",
    },
  },
};

export default config;

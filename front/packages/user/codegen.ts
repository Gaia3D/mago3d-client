import {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
    ignoreNoDocuments: true,
    generates: {
        "src/generated/gql/dataset/": {
            schema: "https://mdtp.gaia3d.com/app/api/dataset/graphql",
            documents: ["src/graphql/dataset/**/*.{ts,tsx,graphql}", 'src/api/**/*.{ts,tsx,graphql}'],
            plugins: [],
            preset: "client",
        },
    }
}

export default config;
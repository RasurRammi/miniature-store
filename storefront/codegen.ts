
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    './app/gql/shop/': {
      schema: 'http://localhost:3001/shop-api',
      documents: ['app/queries/shop/**/*.graphql', 'app/queries/fragments/**/*.graphql'],
      preset: 'client',
      config: {
        useTypeImports: true,
        scalars: {
          Money: 'number',
          DateTime: 'string',
        },
        namingConvention: {
          enumValues: 'keep',
        },
      }
    },
    './app/gql/admin/': {
      schema: 'http://localhost:3001/admin-api',
      documents: ['app/queries/admin/**/*.graphql', 'app/queries/fragments/**/*.graphql'],
      preset: 'client',
      config: {
        useTypeImports: true,
        scalars: {
          Money: 'number',
          DateTime: 'string',
        },
        namingConvention: {
          enumValues: 'keep',
        },
      }
    }
  }
};

export default config;

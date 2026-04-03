import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    '../../apps/storefront/app/gql/': {
      schema: 'http://localhost:3099/shop-api',
      documents: [
        '../../apps/storefront/app/queries/**/*.graphql',
        '../shared/src/queries/**/*.graphql'
      ],
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
        scalars: {
          Money: 'number',
          DateTime: 'string',
        },
        namingConvention: {
          enumValues: 'keep',
        },
      },
    },
    '../../apps/admin/app/gql/': {
      schema: 'http://localhost:3099/admin-api',
      documents: [
        '../../apps/admin/app/queries/**/*.graphql',
        '../shared/src/queries/**/*.graphql'
      ],
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
        scalars: {
          Money: 'number',
          DateTime: 'string',
        },
        namingConvention: {
          enumValues: 'keep',
        },
      },
    },
  },
}

export default config
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    overwrite: true,
    generates: {
        './app/gql/shop/': {
            schema: 'http://localhost:3001/shop-api',
            documents: ['app/queries/shop/**/*.graphql', 'app/queries/fragments/**/*.graphql'],
            preset: 'client',
            config: {
                useTypeImports: true,
                disableFragmentMasking: true,
                scalars: {
                    Money: 'number',
                    DateTime: 'string',
                },
                namingConvention: {
                    enumValues: 'keep',
                },
            },
        },
        './app/gql/admin/': {
            schema: 'http://localhost:3001/admin-api',
            documents: ['app/queries/admin/**/*.graphql', 'app/queries/fragments/**/*.graphql'],
            preset: 'client',
            config: {
                useTypeImports: true,
                disableFragmentMasking: true,
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
};
exports.default = config;

import { bootstrap, DefaultJobQueuePlugin, type InitialData, LanguageCode } from '@vendure/core'
import { populate, populateCollections } from '@vendure/core/cli'
import { InMemoryJobQueueStrategy } from '@vendure/core/dist/job-queue/in-memory-job-queue-strategy'
import { config } from './vendure-config'

// -- Source: https://docs.vendure.io/current/core/reference/typescript-api/import-export/populate
// https://github.com/vendurehq/vendure/blob/master/packages/create/build.ts
// https://github.com/vendurehq/vendure/blob/master/packages/core/mock-data/data-sources/initial-data.ts

const seedConfig = {
    ...config,
    plugins: config.plugins ?? [],
}

const initialData: InitialData = {
    defaultLanguage: LanguageCode.en,
    defaultZone: 'Europe',
    countries: [
        { name: 'Germany', code: 'DE', zone: 'Europe' },
    ],
    taxRates: [],
    shippingMethods: [],
    paymentMethods: [],
    collections: [
        {
            name: 'Releases',
            slug: 'releases',
            filters: [],
            assetPaths: [],
        },
    ],
}

// Note: populateCollections is NOT called by populate() automatically —
// it only runs when a productsCsvPath is passed. Must be called explicitly.
populate(() => bootstrap(seedConfig), initialData)
    .then(app => populateCollections(app, initialData).then(() => app))
    .then(app => app.close())
    .then(() => process.exit(0))
    .catch((e) => {
        console.error('Seed failed:', e.message)
        console.error(e.stack)
        process.exit(1)
    })
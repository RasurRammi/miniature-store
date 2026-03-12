declare module '@vendure/core/dist/entity/custom-entity-fields' {
    interface CustomProductVariantFields {
        isDigital: boolean;
    }
    interface CustomShippingMethodFields {
        isDigital: boolean;
    }
    interface CustomFulfillmentFields {
        downloadUrls: string[] | null;
    }
}
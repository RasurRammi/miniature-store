import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import {WishlistItem} from "./entities/wishlist-item.entity";
import {WishlistService} from "./services/wishlist.service";
import {shopApiExtensions} from "./api/api-extensions";
import {WishlistShopResolver} from "./api/wishlist.resolver";
import './types';

@VendurePlugin({
    compatibility: '^3.5.5',
    imports: [PluginCommonModule],
    providers: [WishlistService],
    entities: [WishlistItem],
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [WishlistShopResolver],
    },
    configuration: config => {
        config.customFields.Customer.push({
            name: 'wishlistItems',
            type: 'relation',
            list: true,
            entity: WishlistItem,
            internal: true,
        });
        return config;
    },
})
export class WishlistPlugin {}
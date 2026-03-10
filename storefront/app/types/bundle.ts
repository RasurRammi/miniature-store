import type {RProduct} from "~/types/product";

export type RBundle = {
  id: string,
  name: string,
  description: string,
  price: Number,
  productIds: string[],
  products: RProduct[],
  images: [],
}

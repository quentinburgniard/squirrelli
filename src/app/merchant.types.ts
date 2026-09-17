import type { Modules } from '@strapi/types';
import type { MerchantCategory } from './merchant-category.types';

export type Merchant = Modules.EntityService.Result<'api::merchant.merchant'> & {
  category?: MerchantCategory | null;
};

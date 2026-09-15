import type { Modules } from '@strapi/types';

export type MerchantCategory =
  Modules.EntityService.Result<'api::merchant-category.merchant-category'>;

export type MerchantCategoryWithRelations = MerchantCategory & {
  children?: MerchantCategory[];
  parent?: MerchantCategory | null;
};

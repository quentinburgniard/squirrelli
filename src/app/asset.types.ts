import type { Modules } from '@strapi/types';

export type AssetCategory = Modules.EntityService.Result<'api::asset-category.asset-category'>;

export type Asset = Modules.EntityService.Result<'api::asset.asset'> & {
  category?: AssetCategory | null;
};

export type AssetInput = Omit<Modules.EntityService.Params.Data.Input<'api::asset.asset'>, 'user'>;

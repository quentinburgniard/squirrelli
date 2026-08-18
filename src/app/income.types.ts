import type { Modules } from '@strapi/types';

export type Income = Modules.EntityService.Result<'api::income.income'>;

export type IncomeInput = Omit<
  Modules.EntityService.Params.Data.Input<'api::income.income'>,
  'user'
>;

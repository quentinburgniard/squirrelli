import type { Modules } from '@strapi/types';
import type { Dayjs } from 'dayjs/esm';
import type { MerchantCategory } from './merchant-category.types';
import type { Merchant } from './merchant.types';

export type RawExpense = Modules.EntityService.Result<'api::expense.expense'> & {
  merchant?: Merchant | null;
  category?: MerchantCategory | null;
};

export type Expense = Omit<RawExpense, 'date'> & {
  date?: Dayjs;
};

export type ExpensePartner = Modules.EntityService.Result<'api::expense-partner.expense-partner'>;

export type ExpensePartnerInput = Omit<
  Modules.EntityService.Params.Data.Input<'api::expense-partner.expense-partner'>,
  'user'
>;

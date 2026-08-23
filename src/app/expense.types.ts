import type { Modules } from '@strapi/types';
import type { Dayjs } from 'dayjs/esm';
import type { MerchantCategory } from './merchant-category.types';
import type { Merchant } from './merchant.types';

export type RawExpense = Modules.EntityService.Result<'api::expense.expense'> & {
  merchant?: Merchant | null;
  category?: MerchantCategory | null;
  allocations?: RawExpenseAllocation[];
};

export type Expense = Omit<RawExpense, 'date'> & {
  date?: Dayjs;
};

export type ExpensePartner = Modules.EntityService.Result<'api::expense-partner.expense-partner'>;

export type ExpenseAllocationType =
  Modules.EntityService.Result<'api::expense-allocation-type.expense-allocation-type'>;

export type RawExpenseAllocation =
  Modules.EntityService.Result<'api::expense-allocation.expense-allocation'> & {
    type?: ExpenseAllocationType | null;
    partner?: ExpensePartner | null;
  };

type ExpenseAllocationTarget =
  | {
      type: null;
      partner: string;
      countsAsPaid: boolean;
    }
  | {
      type: string;
      partner: null;
      countsAsPaid: null;
    };

type ExpenseAllocationQuantity =
  | {
      amount: number;
      rate: null;
    }
  | {
      amount: null;
      rate: number;
    };

export type ExpenseAllocationValue = {
  documentId?: string;
} & ExpenseAllocationTarget &
  ExpenseAllocationQuantity;

export type ExpensePartnerInput = Omit<
  Modules.EntityService.Params.Data.Input<'api::expense-partner.expense-partner'>,
  'user'
>;

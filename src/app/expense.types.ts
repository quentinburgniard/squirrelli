import type { Modules } from '@strapi/types';
import type { Dayjs } from 'dayjs/esm';
import type { MerchantCategory } from './merchant-category.types';
import type { Merchant } from './merchant.types';

export type RawExpense = Modules.EntityService.Result<'api::expense.expense'> & {
  merchant?: Merchant | null;
  category?: MerchantCategory | null;
  allocations?: RawExpenseAllocation[];
};

export type Expense = Omit<RawExpense, 'date' | 'allocations'> & {
  date?: Dayjs;
  allocations?: ExpenseAllocation[];
};

export type ExpenseFriend = Modules.EntityService.Result<'api::expense-partner.expense-partner'>;

export type ExpenseAllocationType =
  Modules.EntityService.Result<'api::expense-allocation-type.expense-allocation-type'>;

export type RawExpenseAllocation =
  Modules.EntityService.Result<'api::expense-allocation.expense-allocation'> & {
    type?: ExpenseAllocationType | null;
    partner?: ExpenseFriend | null;
  };

export type ExpenseAllocation = Omit<RawExpenseAllocation, 'partner'> & {
  friend?: ExpenseFriend | null;
};

type ExpenseAllocationTarget =
  | {
      type: null;
      friend: string;
      countsAsPaid: boolean;
    }
  | {
      type: string;
      friend: null;
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

export type ExpenseFriendInput = Omit<
  Modules.EntityService.Params.Data.Input<'api::expense-partner.expense-partner'>,
  'user'
>;

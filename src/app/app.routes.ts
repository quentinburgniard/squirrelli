import { Routes } from '@angular/router';
import { assetResolver } from './asset.resolver';
import { Assets } from './assets/assets';
import { Categories } from './categories/categories';
import { Category } from './category/category';
import { EditAsset } from './edit-asset/edit-asset';
import { EditExpense } from './edit-expense/edit-expense';
import { EditIncome } from './edit-income/edit-income';
import { EditPartner } from './edit-partner/edit-partner';
import { ExpensesImport } from './expenses-import/expenses-import';
import { Expenses } from './expenses/expenses';
import { expenseResolver } from './expense.resolver';
import { Home } from './home/home';
import { incomeResolver } from './income.resolver';
import { Incomes } from './incomes/incomes';
import { Partners } from './partners/partners';
import { partnerResolver } from './partner.resolver';
import { settingsResolver } from './settings.resolver';
import { Settings } from './settings/settings';

export const routes: Routes = [
  {
    path: '',
    resolve: { settings: settingsResolver },
    children: [
      { path: '', component: Home },
      { path: 'expenses', component: Expenses },
      { path: 'expenses/categories', component: Categories },
      { path: 'expenses/categories/:id', component: Category },
      { path: 'expenses/import', component: ExpensesImport },
      { path: 'expenses/edit', component: EditExpense },
      {
        path: 'expenses/edit/:id',
        component: EditExpense,
        resolve: { expense: expenseResolver },
      },
      { path: 'incomes', component: Incomes },
      { path: 'incomes/edit', component: EditIncome },
      {
        path: 'incomes/edit/:id',
        component: EditIncome,
        resolve: { income: incomeResolver },
      },
      { path: 'assets', component: Assets },
      { path: 'assets/edit', component: EditAsset },
      {
        path: 'assets/edit/:id',
        component: EditAsset,
        resolve: { asset: assetResolver },
      },
      { path: 'expenses/partners', component: Partners },
      { path: 'expenses/partners/edit', component: EditPartner },
      {
        path: 'expenses/partners/edit/:id',
        component: EditPartner,
        resolve: { partner: partnerResolver },
      },
      { path: 'settings', component: Settings },
    ],
  },
];

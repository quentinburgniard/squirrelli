import { Routes } from '@angular/router';
import { assetResolver } from './asset.resolver';
import { Assets } from './assets/assets';
import { AssetCategories } from './asset-categories/asset-categories';
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
import { IncomeSources } from './income-sources/income-sources';
import { Partners } from './partners/partners';
import { Projects } from './projects/projects';
import { partnerResolver } from './partner.resolver';
import { settingsResolver } from './settings.resolver';
import { Settings } from './settings/settings';

export const routes: Routes = [
  {
    path: '',
    resolve: { settings: settingsResolver },
    children: [
      { path: '', component: Home, data: { title: 'dashboard' } },
      { path: 'expenses', component: Expenses, data: { title: 'expenses' } },
      { path: 'expenses/categories', component: Categories, data: { title: 'expenseCategories' } },
      { path: 'expenses/categories/:id', component: Category, data: { title: 'category' } },
      { path: 'expenses/import', component: ExpensesImport, data: { title: 'importExpenses' } },
      { path: 'expenses/edit', component: EditExpense, data: { title: 'addExpense' } },
      {
        path: 'expenses/edit/:id',
        component: EditExpense,
        data: { title: 'editExpense' },
        resolve: { expense: expenseResolver },
      },
      { path: 'incomes', component: Incomes, data: { title: 'incomes' } },
      { path: 'incomes/sources', component: IncomeSources, data: { title: 'incomeSources' } },
      { path: 'incomes/edit', component: EditIncome, data: { title: 'addIncome' } },
      {
        path: 'incomes/edit/:id',
        component: EditIncome,
        data: { title: 'editIncome' },
        resolve: { income: incomeResolver },
      },
      { path: 'assets', component: Assets, data: { title: 'assets' } },
      { path: 'assets/categories', component: AssetCategories, data: { title: 'assetCategories' } },
      { path: 'assets/edit', component: EditAsset, data: { title: 'addAsset' } },
      {
        path: 'assets/edit/:id',
        component: EditAsset,
        data: { title: 'editAsset' },
        resolve: { asset: assetResolver },
      },
      { path: 'expenses/partners', component: Partners, data: { title: 'partners' } },
      { path: 'expenses/projects', component: Projects, data: { title: 'projects' } },
      { path: 'expenses/partners/edit', component: EditPartner, data: { title: 'addPartner' } },
      {
        path: 'expenses/partners/edit/:id',
        component: EditPartner,
        data: { title: 'editPartner' },
        resolve: { partner: partnerResolver },
      },
      { path: 'settings', component: Settings, data: { title: 'settings' } },
    ],
  },
];

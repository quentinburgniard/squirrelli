import { Routes } from '@angular/router';
import { assetResolver } from './asset.resolver';
import { expenseResolver } from './expense.resolver';
import { friendSharingResolver } from './friend-sharing/friend-sharing.resolver';
import { Home } from './home/home';
import { incomeResolver } from './income.resolver';
import { friendResolver } from './friend.resolver';

export const routes: Routes = [
  {
    path: 'sharing/friends/:id',
    loadComponent: () =>
      import('./friend-sharing/friend-sharing').then((module) => module.FriendSharing),
    data: { title: 'friends', hideShell: true },
    resolve: { sharing: friendSharingResolver },
  },
  {
    path: '',
    children: [
      { path: '', component: Home, data: { title: 'dashboard' } },
      {
        path: 'expenses',
        loadComponent: () => import('./expenses/expenses').then((m) => m.Expenses),
        data: { title: 'expenses' },
      },
      {
        path: 'expenses/categories',
        loadComponent: () => import('./categories/categories').then((m) => m.Categories),
        data: { title: 'expenseCategories' },
      },
      {
        path: 'expenses/categories/:id',
        loadComponent: () => import('./category/category').then((m) => m.Category),
        data: { title: 'category' },
      },
      {
        path: 'expenses/import',
        loadComponent: () =>
          import('./expenses-import/expenses-import').then((m) => m.ExpensesImport),
        data: { title: 'importExpenses' },
      },
      {
        path: 'expenses/edit',
        loadComponent: () => import('./edit-expense/edit-expense').then((m) => m.EditExpense),
        data: { title: 'addExpense' },
      },
      {
        path: 'expenses/edit/:id',
        loadComponent: () => import('./edit-expense/edit-expense').then((m) => m.EditExpense),
        data: { title: 'editExpense' },
        resolve: { expense: expenseResolver },
      },
      {
        path: 'incomes',
        loadComponent: () => import('./incomes/incomes').then((m) => m.Incomes),
        data: { title: 'incomes' },
      },
      {
        path: 'incomes/sources',
        loadComponent: () => import('./income-sources/income-sources').then((m) => m.IncomeSources),
        data: { title: 'incomeSources' },
      },
      {
        path: 'incomes/edit',
        loadComponent: () => import('./edit-income/edit-income').then((m) => m.EditIncome),
        data: { title: 'addIncome' },
      },
      {
        path: 'incomes/edit/:id',
        loadComponent: () => import('./edit-income/edit-income').then((m) => m.EditIncome),
        data: { title: 'editIncome' },
        resolve: { income: incomeResolver },
      },
      {
        path: 'assets',
        loadComponent: () => import('./assets/assets').then((m) => m.Assets),
        data: { title: 'assets' },
      },
      {
        path: 'assets/categories',
        loadComponent: () =>
          import('./asset-categories/asset-categories').then((m) => m.AssetCategories),
        data: { title: 'assetCategories' },
      },
      {
        path: 'assets/edit',
        loadComponent: () => import('./edit-asset/edit-asset').then((m) => m.EditAsset),
        data: { title: 'addAsset' },
      },
      {
        path: 'assets/edit/:id',
        loadComponent: () => import('./edit-asset/edit-asset').then((m) => m.EditAsset),
        data: { title: 'editAsset' },
        resolve: { asset: assetResolver },
      },
      {
        path: 'expenses/friends',
        loadComponent: () => import('./friends/friends').then((m) => m.Friends),
        data: { title: 'friends' },
      },
      {
        path: 'expenses/projects',
        loadComponent: () => import('./projects/projects').then((m) => m.Projects),
        data: { title: 'projects' },
      },
      {
        path: 'expenses/friends/edit',
        loadComponent: () => import('./edit-friend/edit-friend').then((m) => m.EditFriend),
        data: { title: 'addFriend' },
      },
      {
        path: 'expenses/friends/:id',
        loadComponent: () => import('./friend/friend').then((m) => m.Friend),
        data: { title: 'friends' },
        resolve: { friend: friendResolver },
      },
      {
        path: 'expenses/friends/edit/:id',
        loadComponent: () => import('./edit-friend/edit-friend').then((m) => m.EditFriend),
        data: { title: 'editFriend' },
        resolve: { friend: friendResolver },
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings').then((m) => m.Settings),
        data: { title: 'settings' },
      },
    ],
  },
];

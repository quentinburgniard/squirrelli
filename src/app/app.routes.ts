import { Routes } from '@angular/router';
import { EditExpense } from './edit-expense/edit-expense';
import { ExpensesImport } from './expenses-import/expenses-import';
import { Expenses } from './expenses/expenses';
import { expenseResolver } from './expense.resolver';
import { Home } from './home/home';
import { settingsResolver } from './settings.resolver';
import { Settings } from './settings/settings';

export const routes: Routes = [
  {
    path: '',
    resolve: { settings: settingsResolver },
    children: [
      { path: '', component: Home },
      { path: 'expenses', component: Expenses },
      { path: 'expenses/import', component: ExpensesImport },
      { path: 'expenses/edit', component: EditExpense },
      {
        path: 'expenses/edit/:id',
        component: EditExpense,
        resolve: { expense: expenseResolver },
      },
      { path: 'settings', component: Settings },
    ],
  },
];

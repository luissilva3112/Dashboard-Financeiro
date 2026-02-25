import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { Transactions } from './pages/transactions/transactions';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: DashboardComponent  },
  { path: 'transactions', component: Transactions  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
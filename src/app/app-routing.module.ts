import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricesComponent } from './components/prices/prices.component';
import { ConfigComponent } from './components/config/config.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { OrderComponent } from './components/order/order.component';

const routes: Routes = [
  { path: '', component: PricesComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'policies', component: PoliciesComponent },
  { path: 'order', component: OrderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

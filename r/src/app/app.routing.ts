
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AuthGuard } from './User Role Management/AuthGuard';
import { AdminModule } from './admin/admin.module';

const routes: Routes = [
  { path: '', redirectTo: '/Home', pathMatch: 'full', },
  // { path: 'ErrorPage',component: ErrorPageComponent},
  {
    path: '', component: AdminComponent, children: [
      { path: '', loadChildren: './admin/admin.module#AdminModule', canLoad: [AuthGuard] }
    ]
  },
  { path: '**', redirectTo: "/ErrorPage", pathMatch: 'full' },
  { path: 'ErrorPage', component: ErrorPageComponent },

];

@NgModule({
  imports: [
    AdminModule,
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }

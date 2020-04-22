import { Routes, ROUTES } from '@angular/router';


import { UsersComponent } from '../User Role Management/users/users.component';
import { RolesComponent } from '../User Role Management/roles/roles.component';
import { AuthGuard } from '../User Role Management/AuthGuard';
import { HomeComponent } from '../home/home.component';

export const AdminRoutes: Routes = [


    { path: 'Home', component: HomeComponent },


    { path: 'System User', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'Roles', component: RolesComponent, canActivate: [AuthGuard] },

];

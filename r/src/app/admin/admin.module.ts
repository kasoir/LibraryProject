import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutes } from './admin.routing';
import {  HttpClientModule } from '@angular/common/http';
import { UsersComponent } from '../User Role Management/users/users.component';
import { RolesComponent } from '../User Role Management/roles/roles.component'
import { UsersService } from '../User Role Management/users/users.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';


import { RoleService } from '../User Role Management/roles/roles.service';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { CdkTableModule } from '@angular/cdk/table';


import { AuthGuard } from '../User Role Management/AuthGuard';
import { FilterUserPipe, FilterPrivilegesPipe } from '../User Role Management/users/filter.pipe';
import { KeysPipe } from '../Auxliary-Files/KeysPipe';
import { FilterValueOfKeyPipe } from '../User Role Management/filter-value-of-key.pipe';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Http } from '@angular/http';




@NgModule({
  imports: [

    CommonModule,
    RouterModule.forChild(AdminRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    MatListModule,
    MatPaginatorModule,
    MatRadioModule,
    MatTableModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
    MatMenuModule,
    CdkTableModule,
    MatSlideToggleModule,
    MatStepperModule,
    NgbModule,
    MatCardModule,
  ],

  declarations: [
    UsersComponent,
    RolesComponent,
    FilterUserPipe,
    FilterPrivilegesPipe,
    KeysPipe,
    FilterValueOfKeyPipe,
  ],

  providers: [
    UsersService, RoleService, AuthGuard,
     DatePipe, CurrencyPipe, NgbActiveModal,
    FilterValueOfKeyPipe
  ],

  exports: [FilterUserPipe,
    FilterPrivilegesPipe,
    KeysPipe,
    FilterValueOfKeyPipe],

  entryComponents: []


})

export class AdminModule { }

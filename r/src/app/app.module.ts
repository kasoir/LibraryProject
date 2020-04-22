import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './component/component.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkTableModule } from '@angular/cdk/table';
import { AuthGuard } from './User Role Management/AuthGuard';
import { ConfigService, API_BASE_URL, ConfigFactory } from './config.service';
 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AdminComponent } from './admin/admin.component';
import { AdminModule } from './admin/admin.module';
import { Http } from '@angular/http';



@NgModule({
  imports: [
    BrowserModule,
    AdminModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
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

    

    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSelectModule,

    MatCardModule,
    CdkTableModule,

    // Ng2SmartTableModule,

    // DataTableModule,

     NgbModule,
    // .forRoot(),
   
  ],
  declarations: [
    AppComponent,
    ErrorPageComponent,
    AdminComponent,
  ],




  providers: [
    AuthGuard, ConfigService,
    { provide: 'CONFIG.JSON', useValue: 'assets/config.json' },
    { provide: 'BASE-API-VARIABLE', useValue: 'Root_Url' },
    {
      provide: API_BASE_URL, useFactory: ConfigFactory,
      deps: [ConfigService, 'CONFIG.JSON', 'BASE-API-VARIABLE']
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

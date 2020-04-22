import { Component } from '@angular/core';
import { AuthGuard } from './User Role Management/AuthGuard';
import { showNotification } from './Auxliary-Functions/auxliary-functions';
import { ConfigService } from './config.service';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';


@Component({
  selector: 'app-root',
  // encapsulation : ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {



  errorPage: boolean = false;
  loading: boolean = true;
  constructor(private Auth: AuthGuard, private config: ConfigService, private router: Router, ) {




        this.router.events.subscribe((event: any) => {

          if (event instanceof NavigationStart) {

            this.loading = true;

          } else if (event instanceof NavigationEnd) {
            this.loading = false;
          }
          else if (event instanceof NavigationCancel || event instanceof NavigationError) {

            this.loading = false;
          }

        });

  }


}

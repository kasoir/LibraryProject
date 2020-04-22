import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../User Role Management/AuthGuard';

declare const $:any;

const appTitle: string = "Library";
  export class RouteInfo {
  strPath?: string;
  strTitle: string;
  strIcon: string;
  strClass: string;
  //strAuthname:string='';
  boolHidden: boolean = false;
  items: RouteInfo[];




  constructor(title: string, path?: string, icon?: string, _class?: string,/*strAuthname?:string,*/boolHidden?: boolean, childItems: RouteInfo[] = null) {
    this.strTitle = title;
    this.strIcon = icon;
    this.strPath = path;
    this.strClass = _class;

    this.boolHidden = boolHidden;
    // if(this.strAuthname==null){this.boolHidden=false;}
    //  else
    //   this.boolHidden=this.auth.IsAutharized(this.strAuthname);

    if (childItems) {
      this.items = childItems;
    } else {
      this.items = [];
    }
  }
}



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  _appTitle_: string = appTitle;


  menuItems: any[];

  constructor(private auth: AuthGuard) {

  }

  ROUTES: RouteInfo[];

  DD: boolean = false;

  update() {

    this.DD = !this.DD;
  }



  ngOnInit() {

    // this.getSidebaritems();
    this.auth.getUserPrivileges().subscribe(res => {
      this.ROUTES = [
        new RouteInfo("Home", "/Home", "assets/img/Home.png ", "", false),
        new RouteInfo("First Calls", "/FirstCalls", "assets/img/call_log.png", "", res["UserPrivileges"].includes('FirstCalls') ? false : true, null),
        new RouteInfo("Second Calls", "/SecondCalls", "assets/img/second_call.png", "", res["UserPrivileges"].includes('SecondCalls') ? false : true, null),
        new RouteInfo("Approval Tasks", "/ApprovalTasks", "assets/img/approve.png", "", res["UserPrivileges"].includes('ApprovalTasks') ? false : true, null),
        new RouteInfo("Prize", "/Prize", "assets/img/Prize.png", "", res["UserPrivileges"].includes('PRIZE') ? false : true, null),
        new RouteInfo("General Report", "/general", "assets/img/report.png", "", res["UserPrivileges"].includes('GeneralReport') ? false : true, null),
        new RouteInfo("User Trace", "/Logs", "assets/img/trace.png", "", res["UserPrivileges"].includes('Logs') ? false : true, null),
        new RouteInfo("Settings", "DropDown1", "assets/img/gears.png", "", false,
          [
            new RouteInfo("Game Management", "/Game", "assets/img/game.png", "", res["UserPrivileges"].includes('GAME') ? false : true, null),
            new RouteInfo("Configuration ", "/Settings", "assets/img/config.png", "", res["UserPrivileges"].includes('SETTINGS') ? false : true, null),

          ]),
        new RouteInfo("User Role Management", "DropDown2", "assets/img/UserRoleM.png ", "", false,
          [
            new RouteInfo("Users", "/System User", "assets/img/users.png ", "", res["UserPrivileges"].includes("System User") ? false : true),
            new RouteInfo("Roles", "/Roles", "assets/img/Roles.png", "", res["UserPrivileges"].includes('Show Role') ? false : true),

          ]),
      ];


      this.menuItems = this.ROUTES.filter(menuItem => menuItem);

      //* get Checkers and Push them in Sidebaritems ;

      this.menuItems.forEach(item => {
        if (item.strPath.includes('DropDown') && item.items != null) {
          if (item.items.length == 0) {
            item.boolHidden = true;
          }
          else {

            let i = 0;
            item.items.forEach(ele => {
              if (ele.boolHidden == false) {
                i = 1;
              }
            })

            if (i == 1) {
              item.boolHidden = false;
            }
            else {
              item.boolHidden = true;
            }

          }
        }

      })



    })

  }



  isMobileMenu() { // Fit The Window With Mobile Screen
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

}

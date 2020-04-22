import { UsersService } from './users/users.service';
import { Injectable, Inject } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, CanDeactivate, ActivatedRoute, CanActivateChild } from "@angular/router";
import { httpGetOptions } from '../Authentication Setting/authSetting';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
// import { of } from 'rxjs/observable/of';
import { Resolve } from '@angular/router';
import { API_BASE_URL } from '../config.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

    Privileges: string[] = new Array<string>();
    activate: boolean;

    apiUrl: string = null;
    constructor(private route: Router, private http: HttpClient, @Inject(API_BASE_URL) _apiUrl_: string) {
        this.apiUrl = _apiUrl_;
       
    }







    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    debugger
        this.activate = null;
        let res = await this.getUserPrivileges().toPromise();
       

        let c = next.url[0].path.trim();

        this.activate = res["UserPrivileges"].includes(c)


        console.log("Is activate??", this.activate);
        return this.activate;
    }


    async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        debugger
        this.activate = null;
        let res = await this.getUserPrivileges().toPromise();
       
        this.activate = res["UserPrivileges"].includes(childRoute.routeConfig.path.trim())
       
        console.log("Is activate??", this.activate);
        return this.activate;
    }
    saveLastLogin(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + "UserRoleManagement/SaveLastLogin", httpGetOptions);
    }


    // async canDeactivate(component: someComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {

    //     let HEle: HTMLElement = document.getElementById("MainLoader");
    //     HEle.style.display = "none";

    //     var temp = component.thereIsChange;
    //     if (temp == true) {
    //         var result = await confirm(`you haven't saved your changes.<br>Are you sure you want to leave this page ?`, 'Confirm message').then();
    //         console.log(result)
    //         if (result == true) {
    //             component.thereIsChange = false;
    //             console.log("canDeactivate : true");

    //             HEle.style.removeProperty('display');

    //             return true;
    //         }
    //         else {
    //             component.thereIsChange = true;
    //             console.log("canDeactivate : false");

    //             HEle.style.removeProperty('display');

    //             return false;
    //         }
    //     } else {

    //         HEle.style.removeProperty('display');

    //         return true;
    //     }
    // }


    async canLoad(route: Route) {

        debugger;
        this.saveLastLogin().toPromise();
        let activate = null;

        activate = true;
        console.log("Can Load :", activate);
        return activate;
    }



    //TODO : Comment Method getUserConfig()

    getUserPrivileges(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + "UserRoleManagement/GetUserPrivileges", httpGetOptions);
    }

}

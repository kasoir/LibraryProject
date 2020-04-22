import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { userModel } from '../../Models/userModel';
import { httpPostOptions, httpGetOptions, } from '../../Authentication Setting/authSetting';
import { objectToString } from '../../Auxliary-Files/auxliary-functions';
import { API_BASE_URL } from '../../config.service';







@Injectable()
export class UsersService {

  private strUserRoleURL: string = 'UserRoleManagement/';

  // constructor of SystemUserService Class
  // PS : the 'http' parameter Have to be PRIVATE and Declared as parameter in Constructor Otherwise Dosn't Work  
  apiUrl: string = null;
  // Constructor : We Declare Http Client Object To Use it For Prepare and Send Requests
  // PS : the 'http' parameter Have to be PRIVATE and Declared as parameter in Constructor Otherwise Dosn't Work  

  constructor(private http: HttpClient, @Inject(API_BASE_URL) _apiUrl_: string) {
    this.apiUrl = _apiUrl_;

  }





  // Show All Users
  // URL : /api/SystemUsers/GetSystemUsers

  getAllSysUsers(): Observable<any[]> {
debugger
    return this.http.get<any[]>(this.apiUrl + this.strUserRoleURL + "GetUsers", httpGetOptions);
  }






  // Show Filterd Users
  // userfilteruser : user object contain Filter Fields to search
  // URL : /api/SystemUsers/ShowSystemUsers

  getFilterdSystemUsers(userfilteruser: userModel): Observable<User[]> {

    let anybody = objectToString(userfilteruser);
    return this.http.post<User[]>(this.apiUrl + this.strUserRoleURL + "ShowSystemUsers", anybody, httpPostOptions);

  }



  // Show Filterd Users
  // parameter : userFilter => user object contain Filter Fields to Filter
  // URL : /api/SystemUsers/ShowSystemUsers
  // Can Be ModiFied ( with Backend API ) to Send PageNum & PageSize for Server Side pagenation proccess .

  getSystemUsers(/*PageNum:number,PageSize:number,*/userFilter: userModel): Observable<User[]> {
debugger
    let anybody = objectToString(userFilter);
    return this.http.post<User[]>(this.apiUrl + this.strUserRoleURL + "ShowSystemUsers", userFilter);
  }



  // Add new User
  // parameter : user =>  user contain required Fields which System Client fill them
  // URL : /api/SystemUsers/PostSystemUser


  PostSystemUser(user: any): Observable<any> {
debugger

    let anybody = objectToString(user);
    console.log(anybody);

    let u: string = JSON.stringify(user);

    return this.http.post<any>(this.apiUrl + this.strUserRoleURL + `PostUser?user=${u}`, null, httpPostOptions);
  }


  // Deactivate User
  // parameter : Id =>  user Id that We want to Deactivate it
  // URL : /api/SystemUsers/DeactivateSystemUser

  DeactivateSystemUser(Id: number): Observable<any> {

    return this.http.get<any>(this.apiUrl + this.strUserRoleURL + "DeactivateUser/" + Id, httpPostOptions);//PUT
  }


  ActivateSystemUser(Id: number): Observable<any> {

    return this.http.get<any>(this.apiUrl + this.strUserRoleURL + "ActivateUser/" + Id, httpPostOptions);//PUT
  }


  // Delete User
  // parameter : Id =>  user Id that We want to Delete it
  // URL : /api/SystemUsers/DeleteSystemUser
  // TEMPORARY METHOD

  DeleteSystemUser(Id: number): Observable<{}> {
    return this.http.get(this.apiUrl + this.strUserRoleURL + "DeleteSystemUser/" + Id, httpGetOptions);
  }



  // Edit User Info
  // parameter : user =>  user contain new Updated required Fields which System Client fill them
  // URL : /api/SystemUsers/DeleteSystemUser

  updateUser(user: User): Observable<User> {


    // Stringify User Attributes to Be Able To Sent Them in my Request via Request option => 'Content-Type':  'application/x-www-form-urlencoded'


    let u: string = JSON.stringify(user);

    return this.http.post<any>(this.apiUrl + this.strUserRoleURL + `EditUser?user=${u}`, null, httpPostOptions);//PUT
  }



  getUserDetails(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + this.strUserRoleURL + "getUserDetails/" + id, httpGetOptions);
  }



}
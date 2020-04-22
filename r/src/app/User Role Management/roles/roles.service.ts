import { Injectable, Inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from './role';
import { httpPostOptions,httpGetOptions, } from '../../Authentication Setting/authSetting';
import { objectToString } from '../../Auxliary-Functions/auxliary-functions';
import { API_BASE_URL } from '../../config.service';


@Injectable()



export class RoleService {

      // Data Memebers
      strRoleURL:string='UserRoleManagement/';
      apiUrl: string = null;
      // Constructor : We Declare Http Client Object To Use it For Prepare and Send Requests
      // PS : the 'http' parameter Have to be PRIVATE and Declared as parameter in Constructor Otherwise Dosn't Work  

      constructor(private http: HttpClient, @Inject(API_BASE_URL) _apiUrl_: string) {
        this.apiUrl = _apiUrl_;

       }

     

      // Get All Roles to Show it in List
      // URL : /api/Roles/GetRoles

      getAllRoles():Observable<any[]>
      {
         return this.http.get<any[]>(this.apiUrl + this.strRoleURL+"GetRoles/",httpGetOptions );
      }


     
      // Get Role Details (Name - Description - Users - Privileges)
      // parameter : numRoleId =>  numRoleId is Role ID For get it's Details
      // URL : /api/Roles/GetRole

      getRoleDetails(numRoleId:number): Observable<any[]> {
       
        return this.http.get<any[]>(this.apiUrl+this.strRoleURL+"GetRole/"+numRoleId,httpGetOptions);
      }



      // Edit Role Info
      // parameter : anyNewRole =>  Role contain new Updated required Fields which System Client fill them
      // URL : /api/Roles/PostRole

      PostRole(anyNewRole:any):Observable<any>
      {debugger
        //Get Just Ids from Array of systemUsers Objects
       
        if(anyNewRole.users ){
          anyNewRole.users = anyNewRole.users.map(function(item) {
              return item['Id'];
            });
          }
       
          //Get Just Ids from Array of privileges Objects
       
          if(anyNewRole.privileges){
          anyNewRole.privileges = anyNewRole.privileges.map(function(item) {
              return item['Id'];
            });
          }

          if(anyNewRole.managedBy){
            anyNewRole.managedBy = anyNewRole.managedBy.map(function(item) {
                return item['Id'];
              });
            }
       
        // strNewRole : Stringify of Role Object we want to Send With Request
        //let strNewRole = JSON.stringify(anyNewRole).toString().replace(/"/g,"");
        let strNewRole = objectToString(anyNewRole);


        let strPostRoleApi= this.apiUrl + this.strRoleURL+"PostRole/";
        console.log(strPostRoleApi);

        console.log(strNewRole);
        return this.http.post<Role>(strPostRoleApi,strNewRole,httpPostOptions );
     
      }

     




      // Edit Role Info
      // parameter : anyNewRole =>  Role contain new Updated required Fields which System Client fill them
      // URL : /api/Roles/DeleteSystemUser

      updateRole (anyNewRole: any): Observable<Role> {

        // Get Just Ids from Array of systemUsers Objects
        if(anyNewRole.Users ){
        anyNewRole.Users = anyNewRole.Users.map(function(item) {
            return item['Id'];
          });
        }
        // Get Just Ids from Array of privileges Objects
        if(anyNewRole.Privileges){
        anyNewRole.Privileges = anyNewRole.Privileges.map(function(item) {
            return item['Id'];
          });
        }

        if(anyNewRole.Managedby){
          anyNewRole.Managedby = anyNewRole.Managedby.map(function(item) {
              return item['Id'];
            });
          }

         // strNewRole : Stringify of Role Object we want to Send With Request
          let strNewRole = objectToString(anyNewRole);
         
          return this.http.post<Role>(this.apiUrl+this.strRoleURL+"EditRole/",strNewRole, httpPostOptions);
     
      }






      // Deactivate Role  
      // parameter : RoleId => Role Id Which we want to Deactivate  
      // URL : /api/Roles/DeactivateRole

      DeactivateRole(numRoleId:number):Observable<any>
      {
        return this.http.get<any>(this.apiUrl + this.strRoleURL+"DeactivateRole/"+numRoleId,httpGetOptions );//PUT
      }





      // Delete Role  
      // parameter : RoleId => Role Id Which we want to Delete  
      // URL : /api/SystemUsers/DeleteRole

      // TEMP METHOD
      DeleteRole(numRoleId:number):Observable<Role>
      {
        return this.http.get<Role>(this.apiUrl + this.strRoleURL+"DeleteRole/"+numRoleId ,httpGetOptions);//DELETE
      }

     
     
      // Get User Roles    
      // parameter : user_id => User Id Which we want to Get its Roles  
      // URL : /api/Roles/GetUserRoles
      // Called in System User Component If we want to Show User Roles When we Browse User List
   
      getUserRoles(numUserId:number){
        return this.http.get<Role[]>(this.apiUrl + this.strRoleURL+"GetUserRoles/"+numUserId,httpGetOptions);
      }
     
     

      // Get Privileges to Show List of it When we Want to add/edit Role    
      // URL : /api/Privileges/GetPrivileges

      getPrivileges():Observable<any[]>{

        let strGetPrivilegesApi= this.apiUrl + this.strRoleURL+"GetPrivileges";
        return this.http.get<any[]>(strGetPrivilegesApi,httpGetOptions);
      }
     



     

}

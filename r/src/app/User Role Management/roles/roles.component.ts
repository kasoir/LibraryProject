import { Component, OnInit } from '@angular/core';
import { RoleService } from './roles.service';
import { Role } from './role';
import { UsersService } from '../users/users.service';
import { showNotification } from '../../Auxliary-Files/auxliary-functions';
import { strPattern } from '../../Auxliary-Files/Auxliary-data';
import { AuthGuard } from '../AuthGuard';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  constructor(private roleService: RoleService, private SysUserS: UsersService, private auth: AuthGuard) {
    this.auth.getUserPrivileges().subscribe(res => {
      this.myPrivileges = res['UserPrivileges'];
      console.log(this.myPrivileges);
    })
  }


  IsAutharized(str: string): boolean {
    if (this.myPrivileges.includes(str.trim())) {
      return true;
    }
    return false;

  }


  //******* Data Members ********************************************************************************************** */


  myPrivileges: any[] = [];

  Users: any[] = new Array();
  Privileges: any[] = new Array();
  RolesM :any[] = new Array();

  Roles: any[] = new Array();
  // RolesRes: Role[] = new Array();
  RoleUsers: any = new Array();
  RolePrivileges: any[] = new Array();
  RoleManagers :any[] = new Array();
 

  // to Get User and Privileges For some Role When I get it's Details

  RolePrivilegesDatails: any[] = new Array();
  RoleUsersDatails: any[] = new Array();
  RoleManagerssDatails: any[] = new Array();




  newRole: Role = new Role();

  filterUserWord: string = '';
  filterPrivilegeWord: string = '';
  filterRolesManager:string='';

  editedRoleId: number = undefined;

  numErrorCode: number = 0;
  numPageCount: number = 1;
  numPageNumber: number = 0;
  numPageSize: number = 10;




  RoleDetails: Role = new Role();
  showDetails: boolean = false;
  boolShowDeactivateButton = true;



  strPattern = strPattern;







  //******* Methods ********************************************************************************************** */









  // Get Roles and Load them to LocalStorage

  showRoles() {
    //  this.Roles=new Array();

    this.roleService.getAllRoles().subscribe(
      result => {
debugger
        this.Roles = [];
        this.Roles = result['Roles'];
        this.Roles.forEach(et => {

          et.ManagedbyRoles = typeLisAsHTML(et.Managedby, "strName");
 
        });
      },
      err => {
        debugger
        if (err.status === 500 || err.status === 400 || err.status === 409 || err.status === 406 || err.status !== 0) {
          showNotification('top', 'center', "ERROR IS : " + err.status, 'danger');
        }
      });
  }
 
  getFirstLineFromHtmlList(htmlList: string): string {
    let res = "";
    if (htmlList && htmlList.length > 0) {
      let from = htmlList.indexOf("<li>") + 4;
      let length = htmlList.indexOf("</li>") - from;
      res = "- " + htmlList.substr(from, length);
    }

    return res;
  }
  // Get Role Details ( Name - Description - Users - Privileges )
  // showDetails = True => for Show Details Section in HTML file

  showRoleDetails(ID): void {
debugger

    let element = this.Roles.find(item => item.Id == ID);
    if (element.strStatus == 'InActive') {
      this.boolShowDeactivateButton = false;
    }

    else {
      this.boolShowDeactivateButton = true;
    }

    // Assign Current Event Data To RoleDetails to Show it in Role Details Section
    // this.RoleDetails=element;


    this.strEditableRolName = element.strName;
    debugger
    Object.assign(this.RoleDetails, element);

    this.roleService.getRoleDetails(element.Id).subscribe(res => {
      debugger
      this.RolePrivilegesDatails = res['Privileges'];
      this.RoleUsersDatails = res['Users'];
      this.RoleManagerssDatails= res['Managers'];
      // CHECKED USERS


      this.SysUserS.getAllSysUsers().subscribe(result => {

        this.Users = [];
        // users contain all Users returned from the API
        let users: any[] = result['Users'];
        // Get Just Active Users

        this.Users = users.filter(ele => ele.strStatus.trim().toUpperCase() == "ACTIVE")

debugger
        this.Users.forEach(item => {


          if (this.RoleUsersDatails.find(ele => ele.Id == item.Id) !== undefined) {
            item.checked = true;
          }
          else {
            item.checked = false;
          }
        })
      })

      // CHECKED PRIVILEGES
      this.Privileges.forEach(item => {


        if (this.RolePrivilegesDatails.find(ele => ele.Id == item.Id) !== undefined) {
          item.checked = true;
        }
        else {
          item.checked = false;
        }
      })
      debugger
        // CHECKED managed roles
        this.RolesM.forEach(item => {


          if (this.RoleManagerssDatails.find(ele => ele.Id == item.Id) !== undefined) {
            item.Checked = true;
          }
          else {
            item.Checked = false;
          }
        })



      this.showDetails = true;
    });

  }





  // POST new Role when Click "Submit" Button
  // PS :  'strName' is Mandatory Field

  addRole() {
debugger

    this.showDetails = false;

    // Empty Role Users And Privileges
    this.newRole.users = [];
    this.newRole.privileges = [];
    this.newRole.managedBy =[];

    // Assign Checked Users and Checked Privileges and checked Manager Roles from Checkboxes List to new Role Users and Privileges and Roles managers
    this.newRole.users = this.RoleUsers;
    this.newRole.privileges = this.RolePrivileges;
    this.newRole.managedBy = this.RoleManagers;

    this.newRole.strName = this.newRole.strName.trim();
    if (this.newRole.strDescription) {
      this.newRole.strDescription = this.newRole.strDescription.trim();

    }
    // Check if Mandatory Fields are Filled For Continue the Proccess
    if (this.checkReqiredFields(this.newRole)) {
      //  ;
      this.roleService.PostRole(this.newRole).subscribe(
        res => {
debugger
          let RoleResult: Role = res['Role'];
          this.numErrorCode = res['ErrorCode'];
          if (RoleResult !== null && res['ErrorCode'] == 0) {
            this.Roles.push(RoleResult);
            showNotification('bottom', 'center', 'Added successfully', 'success');
          }
          // Handle the Errors Based on 'ErrorCode' Value
          else if (res['ErrorCode'] == 1) {
            showNotification('bottom', 'center', 'Error text : Can Not Add Role due to duplicated Name', 'danger');
          }
        },
        err => {
          if (err)
            showNotification('bottom', 'center', 'Error text : ' + err.message.toString() +
              "</br>A problem occurred while completing this action. Kindly try again and contact application support if the problem still appears", 'danger');
        }
      );
    }
    // Uncheck All Checkboxes in Users And Privileges List Even If Add Procces Complete OR not Complete
    this.resetAll();
    // Clear All Fields When Finish Add Role Process Even If Add Procces Complete OR not Complete
    this.clearFields();

    // Close modal in
    document.getElementById('close_modal').click();

  }




  // Deactivate Role when Click 'Deactivate' Button
  // event parameter is 'Role' type object
  deAvtivateRole(event) {

    if (event.strStatus.trim() == "Active") {
      if (window.confirm("Are you sure you want to deactivate the below role? " + event.strName)) {

        let u = this.Roles.find(x => x.Id == event.Id);

        this.roleService.DeactivateRole(event.Id).subscribe(res => {
          ;
          let result = res['Role'];
          const ix = result ? this.Roles.findIndex(h => h.Id === result.Id) : -1;
          if (ix > -1 || ix != -1) {
            result.ManagedbyRoles = typeLisAsHTML(result.Managedby, "strName");

            this.Roles[ix] = result;
            this.Roles[ix].strStatus = 'InActive';
            this.boolShowDeactivateButton = false;
            this.showDetails = false;
            showNotification('bottom', 'center', 'Deactivated successfull', 'success');
          }

        });

      }
      else {

        showNotification('bottom', 'center', 'Deavtivated failed', 'danger');
        //event.confirm.reject();
      }
    }
    else {
      showNotification('bottom', 'center', 'Deavtivated failed because the Role is alreade Deavtivated', 'danger');
      // alert("deavtivated failed because the User is alreade deavtivated");
    }

    document.getElementById('close_modal1').click();

  }




  // For Show All Users When Add or Edit Role
  getAllSystemUsers() {

    this.Users = new Array();
    this.SysUserS.getAllSysUsers().subscribe(result => {
debugger
      this.Users = [];
      // users contain all Users returned from the API
      let users: any[] = result['Users'];
      // Get Just Active Users

      // this.Users = users.map(ele => ele.strStatus.trim().toUpper() == "ACTIVE")
      for (let i = 0; i < users.length; i++) {
        let ix = users[i];
        ix.strStatus.trim();
        if (ix.strStatus === "Active")
          this.Users.push(ix);
      }
 
    })
    this.getallRolesForAdd();
  }

  getallRolesForAdd(){
    this.RolesM = new Array();
    this.roleService.getAllRoles().subscribe(
      result => {
        this.RolesM=result['Roles'];
      this.RolesM.forEach(ele => {
        ele["Checked"] = false;
      })

      },
      err => {
        debugger
        if (err.status === 500 || err.status === 400 || err.status === 409 || err.status === 406 || err.status !== 0) {
          showNotification('top', 'center', "ERROR IS : " + err.status, 'danger');
        }
      });
  }


  // List Privileges to Show it when Add/Edit  Role

  getAllPrivileges() {
    this.Privileges = new Array();
    this.roleService.getPrivileges().subscribe(result => {
      this.Privileges = result;
    })
  }




  //**** Edit Section    *************************************************************************************/

  // Get Edited Role id then will show inputs to be Editable ability

  strEditableRolName: string;
  edit(roleId) {
    // this.strEditableRolName = this.RoleDetails.strName;
    this.editedRoleId = roleId;
    this.RoleUsers = [];
    this.RolePrivileges = [];
    this.RoleManagers =[];

  }

  // To Store Old Users and Privileges in case System Client Press 'Cancel' then We want to Back to Old Data
  oldRoleUsers: any[];
  oldRolePrivileges: any[];
  oldRoleManagers:any[];




  // Update Role Process

  update(updatedRole: Role) {
debugger
    if (this.editedRoleId !== undefined) {
      let u: any = updatedRole;
      this.oldRolePrivileges = u.Privileges;
      this.oldRoleUsers = u.Users;
     this.oldRoleManagers =u.Managedby;

      u.Users = [];
      u.Privileges = [];
      u.Managedby=[];

      // Fill the Arraies With Fresh Data

      u.Users = this.RoleUsersDatails;
      u.Privileges = this.RolePrivilegesDatails;
      u.Managedby =this.RoleManagerssDatails;

      // Call the Method Which It Call requiered API
      this.roleService.updateRole(u).subscribe(res => {
        debugger
        let updated = res['Role'];
        let intErrorCode: number = res['ErrorCode'];
        const index = updated ? this.Roles.findIndex(h => h.Id === updated.Id) : -1;

        // If this id Exist in Roles
        if (index > -1) {
          updated.ManagedbyRoles = typeLisAsHTML(updated.Managedby, "strName");
          this.Roles[index] = updated;
          showNotification('bottom', 'center', updated.strName + ' Role Updated Succesfully', 'success');
        }
        else {
          if (intErrorCode == 1) {
            showNotification('bottom', 'center', 'Can Not update role due to duplicated Name', 'danger');
          }
          else {
            showNotification('bottom', 'center',
              'A problem occurred while completing this action. Kindly try again and contact application support if the problem still appears',
              'danger');
          }
        }
      });

      // Return To Undefined State to Initiate The Input Fields Status in Edit Section
      this.editedRoleId = undefined;
    }

    this.showDetails = false;


    document.getElementById('close_modal1').click();

  }


  // Event When 'Cancel' Button has Clicked

  cancelEdit(roleId) {

    if (roleId == this.editedRoleId) {

      let u: any = this.Roles.find(x => x.Id == roleId);

      if (u !== undefined) {
        u.Privileges = this.oldRolePrivileges;
        u.Users = this.oldRoleUsers;
        this.editedRoleId = undefined;
        this.RoleUsers = [];
        this.RolePrivileges = [];
        this.RoleManagers =[];
      }
    }

  }





  //****     *************************************************************************************/






  //***** Axuliary Methods ********************************************************************************* */



  //Clear All fields When Finishing Add/Edit Role Process

  clearFields() {
    this.RolePrivileges = [];
    this.RoleUsers = [];
    this.RoleManagers=[];
    this.resetAll();
    this.newRole.strName = undefined;
    this.newRole.strDescription = undefined;
    this.newRole.privileges = [];
    this.newRole.users = [];
    this.checkedRoles=[];
  }

  // When Un/Check checkbox From Users list

  updateCheckedUsers(_user: any) {

    if (_user !== null) {

      _user.checked = !_user.checked;
      this.Users.find(item => item.Id == _user.Id).checked = _user.checked;

      this.RoleUsersDatails = [];
      this.RoleUsers = [];
      this.Users.forEach(item => {
        if (item.checked == true) {
          this.RoleUsers.push(item);
          this.RoleUsersDatails.push(item);
        }
      })
    }

  }



  // When Un/Check checkbox From Privileges list

  updateCheckedPrinileges(Privilege: any) {

    if (Privilege !== null) {


      Privilege.checked = !Privilege.checked;

      this.Privileges.find(item => item.Id == Privilege.Id).checked = Privilege.checked;

      this.RolePrivileges = [];
      this.RolePrivilegesDatails = [];
      this.Privileges.forEach(item => {
        if (item.checked == true) {
          this.RolePrivileges.push(item);
          this.RolePrivilegesDatails.push(item);
        }
      })

    }
  }
  checkedRoles:any[]=[];

  // updateCheckedRoles(item) {
  //   let v = this.RolesM.find(ele => ele.Id == item.Id);
  //   v.Checked = !v.Checked;
  //   let c = this.RolesM;
  //   this.checkedRoles = this.RolesM.filter(ele=>ele["Checked"]==true)
  // }
  updateCheckedRoles(item) {
    debugger
     if (item !== null) {


      item.Checked = !item.Checked;

    this.RolesM.find(ele => ele.Id === item.Id).Checked = item.Checked;
this.RoleManagerssDatails=[];
    this.RoleManagers = [];
    this.RolesM.forEach(item => {
      if (item.Checked == true) {
        this.RoleManagers.push(item);
        this.RoleManagerssDatails.push(item);
      }
    })

  }
  debugger
    this.checkedRoles = this.RolesM.filter(ele=>ele["Checked"]==true)
  }




  // UnCheck All Checkboxes

  resetAll() {
    this.Users.forEach((item) => {
      item.checked = false;
    });
    this.Privileges.forEach((item) => {
      item.checked = false;
    });
    this.updateCheckedUsers(null);
    this.updateCheckedPrinileges(null);
  }



  // check Reqired Fields
  checkReqiredFields(role: Role): boolean {
    ;
    if (role) {
      if (!role.strName || role.strName == "") {
        showNotification('bottom', 'center', 'Please fill the Required Role Name Field', 'danger');
        // alert("Please fill the Required Role Name Field");
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }


  // determine Error Type via Error Code
  errorHandling(numErrorCode: number) {

    if (numErrorCode == 1) {
      showNotification('top', 'center', 'Error text : Can Not update user due to duplicated HR ID ', 'danger');
      //  alert("Error text : Can Not update user due to duplicated HR ID ");
    }
    if (numErrorCode == 2) {
      showNotification('top', 'center', 'Error text : Can Not update user due to duplicated Alias ', 'danger');
      // alert("Error text : Can Not update user due to duplicated Alias ");
    }
    if (numErrorCode == 3) {
      showNotification('top', 'center', 'Error text : Can Not update user due to duplicated HR ID and duplicated Alias  ', 'danger');
      // alert("Error text : Can Not update user due to duplicated HR ID and duplicated Alias ");
    }
  }





  //******************************************************************************************************************/

  ngOnInit() {

    this.showRoles();
    this.getAllPrivileges();
  }

}
export function typeLisAsHTML(list: any[], toTypeKey: string): string {
  let result: string = "";
  if (list && list.length > 0) {
    result += "<ul>";
    list.forEach(ele => {
      result += `<li>${ele[toTypeKey]}</li>`;
    })

    result += "</ul>";
  }

  return result;
}

import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import { userModel } from '../../Models/userModel';
import { RoleService } from '../roles/roles.service';
import { showNotification } from '../../Auxliary-Files/auxliary-functions';
import { strPattern, numPattern ,ExtentionPattern } from '../../Auxliary-Files/Auxliary-data';
import { AuthGuard } from '../AuthGuard';
import { FilterValueOfKeyPipe } from '../filter-value-of-key.pipe';
import { typeLisAsHTML } from '../roles/roles.component';




// Component Attributes
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {



  // Users : user type Array to Store Data from API
  Users: any[] = new Array();

  // Array to store Every User Roles
  anyUserRoles: any[] = new Array();

  // User object to input Fields When Adding new User
  inputUser: User = new User();

  // User to Filter Users List according on it's values
  filterTempUser: userModel = new userModel();

  // User Id we want to edit
  editUserId: number = undefined;


  Roles: any[] = [];
  RolesCopy: any[] = [];
  selectedRoles: any[] = [];


  numPageCount: number = 1;

  numPageNumber: number = 0;

  numPageSize: number = 5;

  errorMessage: string = '';

  errorCode: number = 0;

  strJustNumberPattern = '[0-9]+';

  boolShowDetails = false;
  checked:boolean = false;
  theCheckbox:boolean = false;
  myPrivileges: any[] = [];

  strPattern = strPattern;
  numPattern =numPattern;
  ExtentionPattern = ExtentionPattern;
  public ShowActions: string[] = ['<i class="ti-pencil text-info m-r-10"> Edit </i> ', '', 'none']

  //*********************************************************************************************************************** */

  constructor(private userService: UsersService,
    private RS: RoleService,
    private auth: AuthGuard,
    private KVPipe: FilterValueOfKeyPipe) {

    // this.auth.getUserPrivileges().subscribe(res => {
    //   this.myPrivileges = res['UserPrivileges'];
    // })

  }


  IsAutharized(str: string): boolean {
   
    if (this.myPrivileges.includes(str.trim())) {
      return true;
    }
    return false;

  }


  editedUserId: number;

  UserDetails: User = new User();



  //*** User Management ******************************************************************************************************** */



  getUserRoles(numUserId: number) {

    this.RS.getUserRoles(numUserId).subscribe(
      result => {
        this.anyUserRoles = result;
      }
    );
  }

  getAllRoles() {
   
    this.RS.getAllRoles().subscribe(res => {
      debugger
      this.checked=false;
      this.RolesCopy = res["Roles"];

      this.Roles = this.RolesCopy = this.RolesCopy.filter(ele=>ele.strStatus.trim().toUpperCase()=="ACTIVE");

      this.RolesCopy.forEach(ele => {
        ele["Checked"] = false;
      })
    })
  }

  checkedRoles:any[]=[];

  updateCheckedRoles(item) {
    let v = this.RolesCopy.find(ele => ele.Id == item.Id);
    v.Checked = !v.Checked;
    let c = this.RolesCopy;
    this.checkedRoles = this.RolesCopy.filter(ele=>ele["Checked"]==true)
  }


  //  
  //  void : showUsers(void) =>  get All Users From Service And Store it in Local Storage (dateSourceUsers) To Show it in View                              
  //
  showUsers(): void {
    this.userService.getAllSysUsers()
      .subscribe(
        result => {
          debugger
          this.Users = [];
          this.Users = result['Users'];
          this.Users.forEach(et=>{
            et.Roles = typeLisAsHTML(et.userRoles, "strName");
          });
          // this.Users=result;
        },
        err => {

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

  // Filter Users According on filter User object
  // parameter : user =>  user contains Fields to Search

  filterUsers(): void {

    this.filterTempUser.PageNum = 1;
    this.userService.getFilterdSystemUsers(this.filterTempUser)
      .subscribe(result => {

        this.Users = result['Users'];


        this.numPageNumber = result['pages'];

      });
  }



  // Filter Users According on filter User object
  // parameter : user =>  user contains Fields to Search

  onSubmit() {

    let g = this.Users;
    this.editUserId = undefined;
    this.errorCode = undefined;

    if (this.inputUser.strFirstName !== undefined
      && this.inputUser.strLastName !== undefined
      && this.inputUser.intHRId !== undefined
      && this.inputUser.strAlias !== undefined
      && this.inputUser.strGSM !== undefined
      && this.inputUser.strExtensionID !== undefined
    ) {
      this.inputUser.datCreationDate = new Date();
      this.inputUser.strStatus = "Active";
      this.inputUser.strFirstName.trim();
      this.inputUser.strLastName.trim();
      this.inputUser.strAlias.trim();
      this.inputUser.strGSM.trim();
     


      let roles_ :any []= [];
      roles_ = this.KVPipe.transform(this.RolesCopy, "Checked", true);

      if(roles_.length == 0){
        showNotification("bottom","center","you must select one role at least ","warning");
      }

      else{

        this.inputUser["Roles"] = roles_;


        this.userService.PostSystemUser(this.inputUser)
          .subscribe(result => {
            debugger
            let user: any = result['User'];
 
            if (user !== null) {
 
              this.Users.concat(user, this.Users);
 
              this.showUsers();
              console.log(user)
              showNotification('bottom', 'center', 'Added successfully', 'success');
            }
            else {
 
              this.errorCode = result['ErrorCode'];
              this.errorHandling(this.errorCode, 'Add');
            }
 
          }
 
          );
 
        this.inputUser = new User();
        this.inputUser.strFirstName = undefined;
        this.inputUser.strLastName = undefined;
        this.inputUser.intHRId = undefined;
        this.inputUser.strAlias = undefined;
        this.inputUser.datCreationDate = undefined;
        this.inputUser.strStatus = undefined;
        this.inputUser.strGSM =undefined;
        this.inputUser.strExtensionID=undefined;

      }



    }
    else {
      this.checkReqiredFields(this.inputUser);
    }

    document.getElementById('close_modal').click();


  }





  /**************************************************************************************************************************************/



  //======= deavtivate User ===========================================================================================


  deAvtivateUser(user: User) {


    if (user.strStatus)
      user.strStatus.trim();
    if (user.strStatus.trim() == "Active") {
      if (window.confirm("Are you sure you want to deactivate the ' " + user.strAlias + " ' User? ")) {

        let u = this.Users.find(x => x.Id == user.Id);

        this.userService.DeactivateSystemUser(user.Id).subscribe(res => {
          let result = res['User'];
          const ix = result ? this.Users.findIndex(h => h.Id === result.Id) : -1;
          if (ix > -1 || ix != -1) {
            this.Users[ix] = result;
            this.showUsers();
            showNotification('bottom', 'center', 'Deactivated successfully', 'success');
          }

        });

      }
      else {
        //  alert("deavtivated failed");
        showNotification('bottom', 'center', 'Deavtivated failed', 'danger');
        // event.confirm.reject();
      }
    }
    else {
      showNotification('bottom', 'center', 'Deavtivated failed because the User is alreade Deavtivated', 'danger');
      // alert("deavtivated failed because the User is alreade deavtivated");
    }


    this.boolShowDetails = false;
    document.getElementById('close_modal_1').click();


  }



  //======= Avtivate User ===========================================================================================


  ActivateUser(user: User) {

debugger
    if (user.strStatus)
      user.strStatus.trim();
    if (user.strStatus.trim() == "InActive") {
      if (window.confirm("Are you sure you want to Activate the ' " + user.strAlias + " ' User? ")) {

        let u = this.Users.find(x => x.Id == user.Id);

        this.userService.ActivateSystemUser(user.Id).subscribe(res => {
          let result = res['User'];
          const ix = result ? this.Users.findIndex(h => h.Id === result.Id) : -1;
          if (ix > -1 || ix != -1) {
            this.Users[ix] = result;
            this.showUsers();
            showNotification('bottom', 'center', 'Activated successfully', 'success');
          }

        });

      }
      else {
        //  alert("deavtivated failed");
        showNotification('bottom', 'center', 'Activated failed', 'danger');
        // event.confirm.reject();
      }
    }
    else {
      showNotification('bottom', 'center', 'Activated failed because the User is alreade Active', 'danger');
      // alert("deavtivated failed because the User is alreade deavtivated");
    }


    this.boolShowDetails = false;
    document.getElementById('close_modal_1').click();


  }


  //====== Datails User (Temp) ===============================================================================================


  showUserDetails(ID: number): void {

    this.RS.getAllRoles().subscribe(
      r_res => {

        this.RolesCopy = r_res["Roles"];
        this.RolesCopy = this.RolesCopy.filter(ele_ => ele_.strStatus.trim().toUpperCase() == "ACTIVE");


        this.userService.getUserDetails(ID).subscribe(
          res => {


            Object.assign(this.UserDetails, res);
            Object.assign(this.oldUserData, this.UserDetails);

            this.RolesCopy.forEach(ele => {
              if (this.UserDetails["Roles"].find(t => t.Id == ele.Id)) {
                ele["Checked"] = true;

              }
              else {
                ele["Checked"] = false;
              }
            })
            this.checkedRoles=this.RolesCopy;
            this.boolShowDetails = true;


          },
          err => {
            showNotification('bottom', 'center', 'Error : ' + err.statusText, 'danger')
          }
        )

      }
    );


    // this.check('Details');

  }


  edit(ID: number) {
    debugger
    this.editUserId = ID;
    // this.check('Edit');
  }




  oldUserData: User = new User();

  // Update Role Process

  update(UserDetails) {

    if (this.editUserId !== undefined) {

      let u: User = this.Users.find(x => x.Id == this.editUserId);

      let roles_ = this.KVPipe.transform(this.RolesCopy, "Checked", true);

      UserDetails["Roles"] = roles_;

      this.userService.updateUser(UserDetails)
        .subscribe(userResult => {
debugger
          this.errorCode = userResult['ErrorCode'];
          let user = userResult['User'];



          if (this.errorCode == 0) {
            const ix = user ? this.Users.findIndex(h => h.Id === user.Id) : -1;
            if (ix > -1) {
              debugger
              this.Users[ix] = user;
              showNotification('bottom', 'center', user.strAlias + ' Updated Successfully', 'success');
            }
            // this.dateSourceUsers.refresh();
          }
          else {
            this.showUsers();
            this.errorHandling(this.errorCode, 'Update');

          }

        });

      // Return To Undefined State to Initiate The Input Fields Status in Edit Section
      this.boolShowDetails = false;
      this.editUserId = undefined;
    }

    document.getElementById('close_modal_1').click();

  }


  // Event When 'Cancel' Button has Clicked

  cancelEdit(ID) {

    if (ID == this.editUserId) {

      this.editUserId = undefined;
      const ix = this.oldUserData ? this.Users.findIndex(h => h.Id === ID) : -1;

      if (ix > -1) {
        Object.assign(this.Users[ix], this.oldUserData)
      }
    }

    document.getElementById('close_modal_1').click();
  }







  //****     *************************************************************************************/


  //******** END Of  Smart table settings  ********************************************************************************/


  //********  Auxliary Methods  ********************************************************************************/



  //=====  to ensure that all mandatory fields are filled  =================================================================================================


  checkReqiredFields(user: User) {
    if (user.strFirstName == "" || user.strFirstName == undefined) {
      showNotification('bottom', 'center', 'Error text : Please fill the field FirstName correctly. ', 'danger');
      // alert("Error text : Please fill the field FirstName correctly. ");
    }
    if (user.strLastName == "" || user.strLastName == undefined) {
      showNotification('bottom', 'center', 'Error text : Please fill the field LastName correctly. ', 'danger');
      // alert("Error text : Please fill the field LastName correctly. ");

    }
    if (user.intHRId == undefined) {
      showNotification('bottom', 'center', 'Error text : Please fill the field HRId correctly. ', 'danger');
      // alert("Error text : Please fill the field HRId correctly. ");

    }
    if (user.strAlias == "" || user.strAlias == undefined) {
      showNotification('bottom', 'center', 'Error text : Please fill the field Alias correctly. ', 'danger');
      // alert("Error text : Please fill the field Alias correctly. ");

    }
  }


  //=====  to type Error messeges according on Error Code   =================================================================================================


  errorHandling(numErrorCode: number, type: string) {


    if (numErrorCode == 1) {
      showNotification('bottom', 'center', 'Error text : Can Not ' + type + ' user due to duplicated HR ID ', 'danger');
      //  alert("Error text : Can Not update user due to duplicated HR ID ");
    }
    if (numErrorCode == 2) {
      showNotification('bottom', 'center', 'Error text : Can Not ' + type + ' user due to duplicated Alias ', 'danger');
      // alert("Error text : Can Not update user due to duplicated Alias ");
    }
    if (numErrorCode == 3) {
      showNotification('bottom', 'center', 'Error text : Can Not ' + type + ' user due to duplicated HR ID and duplicated Alias  ', 'danger');
      // alert("Error text : Can Not update user due to duplicated HR ID and duplicated Alias ");
    }
    if (numErrorCode == 4) {
      showNotification('bottom', 'center', 'Error text : Can Not ' + type + ' user because Name fields can not be more than 50 characters  ', 'danger');
      // alert("Error text : Can Not update user due to duplicated HR ID and duplicated Alias ");
    }
    if (numErrorCode == 5) {
      showNotification('bottom', 'center', 'Error text : Can Not ' + type + ' user due to duplicated GSM ', 'danger');
      // alert("Error text : Can Not update user due to duplicated HR ID and duplicated Alias ");
    }
    if (numErrorCode == 6) {
      showNotification('bottom', 'center', 'Error text : Can Not ' + type + ' user due to duplicated Extention Number ', 'danger');
      // alert("Error text : Can Not update user due to duplicated HR ID and duplicated Alias ");
    }
  }

  // Reset All Input Fields after Add User Case

  resetAll() {

    this.inputUser.intHRId = undefined;
    this.inputUser.strAlias = undefined;
    this.inputUser.strFirstName = undefined;
    this.inputUser.strLastName = undefined;
    this.inputUser.strExtensionID = undefined;
    this.inputUser.strGSM =undefined;
  }


  ngOnInit() {
    // this.ShowActions = new Array<boolean>();
    this.auth.getUserPrivileges().subscribe(res => {
      debugger
      this.myPrivileges = res['UserPrivileges'];
      this.showUsers();
    },
    err=>{
      showNotification("bottom","center","Error : "+err.statusText,"danger")
    })
  }
  updateExtention(e){

    if(this.inputUser.strExtensionID==null){
      this.inputUser.strExtensionID="9";
    }
    this.checked= e.checked;
    if(this.checked && this.inputUser.strExtensionID!=null && this.inputUser.strExtensionID.length==4){
      this.inputUser.strExtensionID= "9"+this.inputUser.strExtensionID.trim();

    }else{
      if(this.inputUser.strExtensionID.length==5){
        this.inputUser.strExtensionID= this.inputUser.strExtensionID.trim().substr(1);
      }
      if(this.inputUser.strExtensionID.length==1 && this.inputUser.strExtensionID=="9"){
        this.inputUser.strExtensionID= null;
      }
    }
  }
  updateExtention1(e){

    if(this.UserDetails.strExtensionID==null){
      this.UserDetails.strExtensionID="9";
    }
    this.checked= e.checked;
    if(this.checked && this.UserDetails.strExtensionID!=null && this.UserDetails.strExtensionID.length==4){
      this.UserDetails.strExtensionID= "9"+this.UserDetails.strExtensionID.trim();

    }else{
      if(this.UserDetails.strExtensionID.length==5){
        this.UserDetails.strExtensionID= this.UserDetails.strExtensionID.trim().substr(1);
      }
      if(this.UserDetails.strExtensionID.length==1 && this.UserDetails.strExtensionID=="9"){
        this.UserDetails.strExtensionID= null;
      }
    }
  }
  // check(action:string){
  //   if(action == 'Add'){

  //     if(this.inputUser.strExtensionID == null || this.inputUser.strExtensionID.trim().charAt(0) != "9"){
  //       this.checked=false;
  //     }
  //     else{
  //       this.checked=true;
  //     }
  //   }
  //   if(action == 'Edit' || action == 'Details')
  //   if(this.UserDetails.strExtensionID)
  //   if(this.UserDetails.strExtensionID.length == 5 && this.UserDetails.strExtensionID.trim().charAt(0) == "9"){
  //     this.checked=true;
  //   }else{
  //     this.checked=false;
  //   }
  // }
}// End Of component Class Scope



///////////////////// users service

/*
*
* DEFINTION : THIS SERVICE FOR SYSTEM USER MANAGMENT ADD/DELETE/DEACTIVATE/EDIT/FILTER
* PS 1.0      : COMMENTS SHOWS UP EVERY METHOD EXPLAIN FUNCTIONALITY OF THE METHOD
* PS 2.0      : 2.1 :  'str' With Begining of Variable Names Means that it's Type is String
*               2.2 :  'num' With Begining of Variable Names Means that it's Type is Number
*               2.3 :  'any' With Begining of Variable Names Means that it's Type is Any
*
*/


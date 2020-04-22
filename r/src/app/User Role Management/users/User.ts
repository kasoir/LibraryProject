export class User{
 
    //data Members
   
    Id:number;
    intHRId:number
    strAlias:string;
    strFirstName:string;
    strLastName:string;
    datCreationDate:Date;  
    strGSM:string;
    strStatus:string;
    strExtensionID:string;
    datDeactivationDate:Date=undefined;
 
 
    constructor(intHRId?:number,FirstName?:string,LastName?:string,
        strAlias?:string,strStatus?:string,
        datCreationDate?:Date,datDeactivationDate?:Date
      ){};
  }

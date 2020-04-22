export class Role{

    Id:number;
    strName:string;
    strDescription:string;
    strStatus:string;
    users ?:any[];
    privileges ?:any[];
    managedBy ?:any[];
    childs ?:Role[];
 
}

import { Injectable } from '@angular/core';

import { HttpClient,HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()

export class PrivilegeService {

  constructor(private http: HttpClient) { }

  Privilege_Url:string="RolePrivileges";

}

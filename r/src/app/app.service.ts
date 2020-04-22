
// import { Injectable } from '@angular/core';
// import { Http, Headers, RequestOptions } from '@angular/http';
// import { map } from 'rxjs/operators';

// @Injectable()
// export class AppService {

//     private url: string = "http://localhost:4100/user/get_all";
//     private url2: string = "http://localhost:4100/user/add_user";
//     private url3: string = "http://localhost:4100/books/get_kind/";



//     constructor(private http: Http) {
//         this.http = http;
//     }

//     kind: string;
//     getcatBooks(kind) {
//         this.kind=kind;
//         return this.http.get(
//             this.url3 + kind
//         ).pipe(map((res) => res));
//     }


//     addUser(first_name, password, last_name) {
//         return this.http.post(
//             this.url2, {
//                 'first_name': first_name,
//                 'last_name': last_name,
//                 'password': password
//             }
//         ).pipe(map((res) => res));
//     }
// }

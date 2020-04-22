import { HttpHeaders } from '@angular/common/http';

//* Windows Authentication POST methos
export const httpPostOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/x-www-form-urlencoded',
    }),
    withCredentials: true,
  }
 
//* Windows Authentication GET methos
export const httpGetOptions =
  {  
     withCredentials: true,
  };
 


  export const httpGetOptions2 =
  {  
     withCredentials: false,
  };


export const httpPostOptions2 ={

  headers: new HttpHeaders({
    // 'Access-Control-Allow-Origin': '*',
   'Content-Type':  'application/json',
  }),
 
  withCredentials: true,
}
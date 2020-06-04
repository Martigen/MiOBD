import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  
  baseUriHah:string = 'http://localhost:4000/api';
  baseUriUser:string = 'http://localhost:4000/users';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Create
  createHaH(data): Observable<any> {
    let url = this.baseUriHah +'/create';
    console.log(url)
    return this.http.post(url, data,{headers: this.headers})
      .pipe(
        map((res: Response) => {
          return res || {}    
        }),
        catchError(this.errorMgmt)
      )
  }

  // Get all HaHs
  getHaHs() {
    return this.http.get(this.baseUriHah);
  }

  // Get HaH
  getHaH(id): Observable<any> {
    let url = this.baseUriHah+'/read/'+id;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update HaH
  updateHaH(id, data): Observable<any> {
    let url = this.baseUriHah+'/update/'+id;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete HaH
  deleteHaH(id): Observable<any> {
    let url = this.baseUriHah+'/delete/'+id;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }


  createUser(data): Observable<any> {
    let url = this.baseUriUser+'/create';;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all HaHs
  getUsers() {
    return this.http.get(this.baseUriUser);
  }

  // Get HaH
  getUser(id): Observable<any> {
    let url = this.baseUriUser+'/read/'+id;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update HaH
  updateUser(id, data): Observable<any> {
    let url = this.baseUriUser+'/update/'+id;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete HaH
  deleteUser(id): Observable<any> {
    let url = this.baseUriUser+'/delete/'+id;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  getUserByEmailAndPassword(email,password): Observable<any> {
    let url = this.baseUriUser+'/EM';
    let data = {email : email,password : password};
    return this.http.post(url,data, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}    
      }),
      catchError(this.errorMgmt)
    )
  }

  addView(id): Observable<any> {
    let url = this.baseUriHah+'/view/'+id;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  getUserHotelsAndHostels(id): Observable<any> {
    let url = this.baseUriHah+'/user/'+id;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = 'Error Code: ${error.status}\nMessage: ${error.message}';
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) {
  }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    // return {...this.user}; shadow  clone
    return structuredClone(this.user); // deep clones
  }


  login(email: string, password: string): Observable<User> {
    //http.post('login', {email,password});
    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        tap(user => localStorage.setItem('token', user.id))
      )
  }

/**
 * Solicitud HTTP: Se realiza una solicitud GET al endpoint ${this.baseUrl}/users/1.
    tap: Se ejecuta para realizar una acción (asignar user a this.user) sin modificar el flujo de datos.
    map: Transforma el objeto user en un valor booleano (true si user tiene un valor, false si es null o undefined).
    catchError: Maneja cualquier error que pueda ocurrir durante la solicitud HTTP y emite false en lugar de propagar el error.
**/
  checkAutentication(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);
    const token= localStorage.getItem('token');
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap(user=> this.user=user),
      map(user=> !!user),
      catchError(err=>of(false))
    )
  }


  logout() {
    this.user = undefined;
    localStorage.clear();
  }







}

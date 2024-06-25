import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, catchError, map, of } from 'rxjs';

import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';


@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError(error => of(undefined))
      );
  }
  /*
  EXPLICACIÓN:       error => of(undefined):

  Cuando ocurre un error, retorna un nuevo Observable que emite undefined en lugar de propagar el error. Esto evita que la aplicación falle debido a errores no manejados en la solicitud HTTP.


  Capturar el error y devolver undefined como un Observable es la mejor práctica en Angular y RxJS, ya que mantiene la consistencia del tipo devuelto, facilita el manejo de datos asíncronos y permite el uso continuo de operadores de RxJS. Devolver un string undefined rompería estas ventajas y podría causar problemas en la lógica de la aplicación.

  Devolver un string undefined puede parecer más simple, pero presenta varias desventajas:

  Inconsistencia:

  Si el método está tipado para devolver Observable<Hero | undefined>, devolver un string undefined introduce inconsistencia tipográfica.
  Los consumidores del método podrían no estar preparados para manejar un string en lugar de un Observable.
  Interrupción del Flujo Reactivo:

  RxJS se basa en el flujo continuo de Observables. Devolver un valor fuera de este flujo puede interrumpir la cadena de operadores y complicar la lógica de manejo de datos.
  */



  /* para usar la siguiente funcion tendriamos que instalar la version anterior de json-serve,
              npm i -save-dev json-server@0.17.4 */


  // getSuggestions(query: string): Observable<Hero[]> {
  //   return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
  // }

            /*con nuestra version de json server*/

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
      .pipe(
        map(heroes => heroes
          .filter(hero => hero.superhero.toLowerCase()
            .includes(query.toLowerCase())
          ))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }


  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error('Hero id is required');

    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }


  deleteHeroById(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        map(resp => true),
        catchError(err => of(false)),
      );
  }


}

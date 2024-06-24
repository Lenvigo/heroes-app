import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }


}

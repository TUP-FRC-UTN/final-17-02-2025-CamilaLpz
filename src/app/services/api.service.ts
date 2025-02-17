import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Score, User, Word } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http : HttpClient = inject(HttpClient);

  login(username: string, password: string): Observable<User[]>{
    return this.http.get<User[]>(`https://679b8dc433d31684632448c9.mockapi.io/users?${username}&password=${password}`);
  }

  getAllWords(): Observable<Word[]>{
    return this.http.get<Word[]>('https://671fe287e7a5792f052fdf93.mockapi.io/words');
  }

  getAllScores(): Observable<Score[]>{
    return this.http.get<Score[]>('https://671fe287e7a5792f052fdf93.mockapi.io/scores');
  }

  getScoreByPlayerName(name: string): Observable<Score[]>{
    return this.http.get<Score[]>(`https://671fe287e7a5792f052fdf93.mockapi.io/scores?playerName=${name}`);
  }

  postScore(score: Score): Observable<Score>{
    return this.http.post<Score>('https://671fe287e7a5792f052fdf93.mockapi.io/scores', score);
  }
}

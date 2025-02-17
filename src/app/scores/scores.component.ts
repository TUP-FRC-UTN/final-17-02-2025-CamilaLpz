import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Score } from '../models/models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-scores',
  imports: [],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent implements OnInit {
  scores: Score[] = [];
  name : string = '';

  private api: ApiService = inject(ApiService);
  private router : Router = inject(Router);
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadScores();
    this.showName();
  }

  showName(){
    this.route.params.subscribe(params => {
      const name = params['name'];
      console.log(name);
      
      this.name = name;
    });
  }

  loadScores() {
    this.api.getAllScores().subscribe({
      next: (scores: Score[]) => {
        let role = localStorage.getItem('actualRole');
        let name = this.showName();
        if(role === 'student'){
          let name : string = this.showName() + '';
          
          this.scores = scores.filter(score => score.playerName === name);
        }
        else{
          this.scores = scores;
        }
      },
      error: () => { 
        alert('Error al cargar los puntajes');
      }
    });
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

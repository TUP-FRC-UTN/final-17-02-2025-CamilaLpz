import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Score } from '../models/models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-scores',
  imports: [RouterLink],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent implements OnInit {
  scores: Score[] = [];
  name : string = '';
  role : string = localStorage.getItem('actualRole') + '';

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
    if(this.role === 'student'){
      this.api.getScoreByPlayerName(this.name).subscribe({
        next: (scores: Score[]) => {
          this.scores = scores;
        },
        error: () => {
          alert('Error al cargar los puntajes');
        }
      })
    }
    else{
      this.api.getAllScores().subscribe({
        next: (scores: Score[]) => {
          this.scores = scores;
        },
        error: () => {
          alert('Error al cargar los puntajes');
        }
      });
    }
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

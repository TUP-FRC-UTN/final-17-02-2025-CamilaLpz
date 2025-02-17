import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Score, Word } from '../models/models';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-game',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit{
  
  tries : number = 6;
  gameForm : FormGroup;
  word : string = '';
  onPlay : boolean = true;
  win: boolean = false;

  private api : ApiService = inject(ApiService);

  constructor(private route: ActivatedRoute,) { 
    this.gameForm = new FormGroup({
      word : new FormControl(''),
      tryLetter : new FormControl('')
    });
  }

  ngOnInit(): void {
      this.tries = 6;
      this.gameForm.get('word')?.setValue('');

      this.loadWords();
  }

  getPlayerName(){
    this.route.params.subscribe(params => {
      const name = params['name'];
      console.log(name);
      
      return name;
    });
  }

  generateId(){
    let name = localStorage.getItem('name') + '';
    console.log(name);
    
    let cant = 0;
    
    this.api.getScoreByPlayerName(name).subscribe({
      next: (score: Score[]) => {
        cant = score.length
      },
      error: () => {
        alert('Error al cargar los puntajes');
      }
    })

    const initials = name.split(' ').map(word => word[0].toUpperCase()).join('');
    const identifier = initials + cant;

    return identifier;
  }

  loadWords(){
    this.api.getAllWords().subscribe({
      next: (words: Word[]) => {
        const randomIndex = Math.floor(Math.random() * words.length);
        this.word = words[randomIndex].word;
        this.gameForm.get('word')?.setValue(this.word.replace(/[a-z]/gi, '_ '));
      },
      error: () => {
        alert('Error al cargar las palabras')
      }
    });
  }

  checkTurns(){
    if(this.tries === 0){
      this.onPlay = false;
    }
  }

  checkWin(){
    let w = this.gameForm.get('word')?.value.replace(/\s/g, '');
    console.log('Incluye ' + w.includes('_'));
    
    if(!w.includes('_')){
      this.win = true;
      return true;
    } else {
      this.win = false;
      return false;
    }
  }

  play(){
    if(!this.checkWin()){
      const tryLetter = this.gameForm.get('tryLetter')?.value.toLowerCase();
    
    console.log('Palabra: ' + this.word);
    
    this.tries--;
    this.checkTurns();

    let w : string = '';

    this.gameForm.get('word')?.setValue(this.gameForm.get('word')?.value.replace(/\s/g, ''));
    console.log(this.gameForm.get('word')?.value);
    

    for (let index = 0; index < this.word.length; index++) {
      console.log(this.word[index]);
      
      if(this.word[index].toLowerCase() === tryLetter){
        w += this.word[index];
        console.log('LETRA ENCONTRADA');
        
      }
      else if(this.gameForm.get('word')?.value[index] !== '_'){
        w += this.gameForm.get('word')?.value[index];
      }
      else{
        w += '_ ';
      }
    }
    
    this.gameForm.get('word')?.setValue(w);
    }
  }
}




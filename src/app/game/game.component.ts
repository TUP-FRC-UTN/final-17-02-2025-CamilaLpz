import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Score, Word } from '../models/models';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
      tryLetter : new FormControl('', [Validators.maxLength(1)])
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
    console.log('CHECK WIN: ', w);
    
    if(!w.includes('_')){
      this.win = true;
      this.onPlay = false;
      this.postGame();
    } else {
      this.win = false;
      this.play();
    }
  }

  play(){

    const tryLetter = this.gameForm.get('tryLetter')?.value.toLowerCase();
    
    console.log('Palabra: ' + this.word);
    
    
    this.checkTurns();
    this.tries--;

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

  showErrors(controlName: string) {
    let control = this.gameForm.get(controlName)!;
    if (control.touched || control.dirty) {
        if (control && control.errors) {
            const errorKey = Object.keys(control!.errors!)[0];
            switch (errorKey) {
                case 'required':
                    return 'Este campo no puede estar vacío.';
                case 'maxlength':
                  return 'Este campo debe tener al menos ' + control.errors![errorKey].requiredLength + ' caracteres.';
                case 'minlength':
                  return 'Este campo debe tener al menos ' + control.errors![errorKey].requiredLength + ' caracteres.';
            }
        }
    }
    return '';
}
  calculateScore(){
    switch(this.tries){
      case 6:
        return 100;

      case 5:
        return 80;
      case 4:
        return 60;
      case 3:
        return 40;
      case 2:
        return 20;
      case 1:
        return 10;
      case 0:
        return 0;
    }
    return 0;
  }

  postGame(){
    let name = localStorage.getItem('name') + '';
    let id = this.generateId();
    let score = this.calculateScore();
    let date = new Date();
    let idGame = id;

    let newScore : Score = {
      id : id,
      playerName : name,
      word : this.word,
      attemptsLeft : this.tries,
      score : score,
      date : date,
      idGame : idGame
    }

    this.api.postScore(newScore).subscribe({
      next: () => {
        alert('Juego guardado');
      },
      error: () => {
        alert('Error al guardar el puntaje');
      }
    });
  }
}




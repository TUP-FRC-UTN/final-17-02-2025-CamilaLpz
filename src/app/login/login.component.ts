import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { User } from '../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy{
  loginForm: FormGroup;
  error : boolean = false;

  private api : ApiService = inject(ApiService);
  private router: Router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnDestroy(): void {
    this.loginForm.reset();
    localStorage.clear();
  }

  showErrors(controlName: string) {
      let control = this.loginForm.get(controlName)!;
      if (control.touched || control.dirty) {
          if (control && control.errors) {
              const errorKey = Object.keys(control!.errors!)[0];
              switch (errorKey) {
                  case 'required':
                      return 'Este campo no puede estar vacío.';
                  case 'minlength':
                    return 'Este campo debe tener al menos ' + control.errors![errorKey].requiredLength + ' caracteres.';
              }
          }
      }
      return '';
  }

  login(){
    if(this.loginForm.valid){
      let username = this.loginForm.get('username')!.value;
      let password = this.loginForm.get('password')!.value;
      this.api.login(username, password).subscribe({
        next: (user : User[]) => {
          console.log(user);
          console.log(user[0].role);
          
          let role = user[0].role;
          let id = user[0].id;

          //localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('actualRole', role);
          localStorage.setItem('userId', id);
          localStorage.setItem('name', user[0].name);

          this.error = false;
          this.loginForm.reset();
          this.router.navigate(['/game', { name: user[0].name }]);
          
        },
        error: (error) => {
          this.error = true;
        }
      })
    }
  }
}

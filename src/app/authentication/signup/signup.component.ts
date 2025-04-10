import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from "../auth.service";  

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  Loading = false;

  constructor(public authService: AuthService) {}  

  onSignup(form: NgForm) {  
    if (form.invalid) {  
      return;  
    }  
    
    this.Loading = true;

    const email = form.value.email;
    const password = form.value.password;

    console.log('Signup Email:', email);
    console.log('Signup Password:', password);

    this.authService.CreateUser(email, password);

    // Optional simulation or loading state
    setTimeout(() => {
      this.Loading = false;
      alert("Signed up successfully (simulation)");
    }, 1500);
  }  
}

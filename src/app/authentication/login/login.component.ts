import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  Loading = false;

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.Loading = true;
    
    const email = form.value.email;
    const password = form.value.password;

    console.log('Email:', email);
    console.log('Password:', password);

    // Simulate API call
    setTimeout(() => {
      this.Loading = false;
      alert("Logged in successfully (simulation)");
    }, 1500);
  }
}

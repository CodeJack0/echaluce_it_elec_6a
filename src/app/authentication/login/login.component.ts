import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';  // Import AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  Loading = false;

  // Inject AuthService into the constructor
  constructor(private authService: AuthService) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.Loading = true;

    const email = form.value.email;
    const password = form.value.password;

    console.log('Email:', email);
    console.log('Password:', password);

    // Call the loginUser method from AuthService
    this.authService.loginUser(email, password);

    // Simulate API call completion
    setTimeout(() => {
      this.Loading = false;
      alert("Logged in successfully (simulation)");
    }, 1500);
  }
}

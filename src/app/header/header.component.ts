import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'; // ✅ Needed for managing subscription
import { AuthService } from '../authentication/auth.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs!: Subscription; 

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout(); // ✅ Call logout method
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe(); 
  }
}

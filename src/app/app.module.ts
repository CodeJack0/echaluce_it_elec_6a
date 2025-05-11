import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';  
import { AppComponent } from './app.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { PostsService } from './posts/posts.service';
import { AuthInterceptor } from './authentication/auth-interceptor'; 
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {ReactiveFormsModule} from '@angular/forms'; 
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';   
import { AuthService } from './authentication/auth.service';
import { ErrorInterceptor } from './error-interceptor'; 
import{MatDialogModule} from '@angular/material/dialog'; 
import { ErrorComponent } from './error/error.component';


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    FormsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [
    AuthService,
    {
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
   
   ],

  bootstrap: [AppComponent],

})
export class AppModule {}

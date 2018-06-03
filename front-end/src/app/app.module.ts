import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, 
         MatCardModule, 
         MatToolbarModule, 
         MatInputModule, 
         MatListModule,
         MatMenuModule,
         MatGridListModule,
         MatSelectModule,
         MatDatepickerModule,
         MatNativeDateModule } from '@angular/material';


import { AuthInterceptorService } from './auth-interceptor.service';
import { AppComponent } from './app.component';
import { MessagesComponent } from './messages.component';
import { PostComponent } from './post.component';
import { UsersComponent } from './users.component';
import { ProfileComponent } from './profile.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PortalComponent } from './portal/portal.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MainComponent } from './main/main.component';
import { ConfirmComponent } from './sign-up/confirm/confirm.component';
import { TaskAddComponent } from './main/task-add/task-add.component';
import { TaskDetailsComponent } from './main/task-details/task-details.component';


const routes: Routes = [
  { path: '', redirectTo: '/portal', pathMatch: 'full' },
  { path: 'portal', component: PortalComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up/confirm', component: ConfirmComponent },
  { path: 'users', component: UsersComponent },
  { path: 'main', component: MainComponent },
  { path: 'main/task-details/:id', component: TaskDetailsComponent },
  { path: 'profile/:id', component: ProfileComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PortalComponent,
    SignInComponent,
    SignUpComponent,
    MessagesComponent,
    UsersComponent,
    PostComponent,
    ProfileComponent,
    MainComponent,
    ConfirmComponent,
    TaskAddComponent,
    TaskDetailsComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatGridListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule
  ],
  providers: [ApiService, {
    provide: HTTP_INTERCEPTORS, 
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

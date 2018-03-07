import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Services
import { AuthService } from './auth.service';
import { TimedRedirectService } from './timed-redirect.service';

// Route guards
import { AuthGuardService } from './auth-guard.service';
import { HomeGuardService } from './home-guard.service';
import { LoginGuardService } from './login-guard.service';
import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';

// General routes
import { SplashComponent } from './routes/splash/splash.component';
import { LogInComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
import { VideoComponent } from './routes/video/video.component';
import { ProgramComponent } from './routes/program/program.component';
import { VerifyComponent } from './routes/verify/verify.component';
import { ResetComponent } from './routes/reset/reset.component';
import { ChangePasswordComponent } from './routes/change-password/change-password.component';

// Admin routes
import { FeedComponent } from './routes/admin/feed/feed.component';
import { VideosComponent } from './routes/admin/videos/videos.component';
import { ClientsComponent } from './routes/admin/clients/clients.component';

// Client routes
import { ProgramsComponent } from './routes/client/programs/programs.component';
import { RequestsComponent } from './routes/client/requests/requests.component';

// Error routes
import { NotFoundComponent } from './routes/error/not-found/not-found.component';
import { UnauthorizedComponent } from './routes/error/unauthorized/unauthorized.component';
import { AlreadyLoggedInComponent } from './routes/error/already-logged-in/already-logged-in.component';

// Shared components
import { SiteNavBarComponent } from './_shared/site-nav-bar/site-nav-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    LogInComponent,
    RegisterComponent,
    VideoComponent,
    ProgramComponent,
    FeedComponent,
    VideosComponent,
    ClientsComponent,
    ProgramsComponent,
    RequestsComponent,
    NotFoundComponent,
    AlreadyLoggedInComponent,
    UnauthorizedComponent,
    SiteNavBarComponent,
    VerifyComponent,
    ResetComponent,
    ChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
  ],
  providers: [
    AuthService,
    TimedRedirectService,
    AuthGuardService,
    HomeGuardService,
    LoginGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

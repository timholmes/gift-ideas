import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';

import { IdeaListComponent } from './ideas/idea-list/idea-list.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { HomeComponent } from './home/home.component';
import { IdeaCreateComponent } from './ideas/idea-create/idea-create.component';


@NgModule({
  declarations: [
    AppComponent,
    IdeaListComponent,
    LogoutComponent,
    HomeComponent,
    IdeaCreateComponent
  ],
  imports: [
    AmplifyUIAngularModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

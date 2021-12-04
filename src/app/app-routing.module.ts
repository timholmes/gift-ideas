import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './auth/logout/logout.component';
import { HomeComponent } from './home/home.component';
import { IdeaCreateComponent } from './ideas/idea-create/idea-create.component';
import { IdeaListComponent } from './ideas/idea-list/idea-list.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  // {path: 'login', component: LoginComponent }
  {path: 'ideas', component: IdeaListComponent },
  // {path: 'ideas/create', component: IdeaCreateComponent },
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
// {path: '**', component: PageNotFoundComponent}
  {path: 'signout', component: LogoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

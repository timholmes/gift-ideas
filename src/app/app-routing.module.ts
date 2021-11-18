import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './auth/logout/logout.component';
import { IdeaListComponent } from './ideas/idea-list/idea-list.component';

const routes: Routes = [
  // {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  // {path: 'login', component: LoginComponent }
  // {path: 'ideas', component: IdeaListComponent }
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
// {path: '**', component: PageNotFoundComponent}
  {path: 'signout', component: LogoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

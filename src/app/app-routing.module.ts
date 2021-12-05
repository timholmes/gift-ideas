import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LogoutComponent } from './auth/logout/logout.component';
import { HomeComponent } from './home/home.component';
import { IdeaCreateComponent } from './ideas/idea-create/idea-create.component';
import { IdeaListComponent } from './ideas/idea-list/idea-list.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  // {path: 'login', component: LoginComponent }
  { path: 'ideas/create', component: IdeaCreateComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'ideas', component: IdeaListComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
  // {path: '**', component: PageNotFoundComponent}
  { path: 'signout', component: LogoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

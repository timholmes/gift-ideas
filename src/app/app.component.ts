import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { AuthenticateService } from './auth/authenticate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gift-ideas';
  isAuthenticated = false;

  constructor(private authenticateService: AuthenticateService) {
    this.isAuthenticated = authenticateService.isAuthenticated()
  }

  ngOnInit(): void {

    // Auth.currentAuthenticatedUser().then(user => {
    // //   console.log(user.attributes.email);
    //   console.log('authenticated? yes');
    //   this.isAuthenticated = true;
    // //   sessionStorage.setItem('isAuthenticated', 'true');
    // //   // this.router.navigate(['/home'])
    // //   // sessionStorage.setItem('user', user);
    // }).catch(e => {
    // //   console.log(e);
    // //   console.log('authenticated? no');
    //   this.isAuthenticated = false;
    //   sessionStorage.setItem('isAuthenticated', 'false');
    // })

  }

}

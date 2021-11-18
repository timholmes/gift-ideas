import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gift-ideas';
  isAuthenticated = false;

  ngOnInit(): void {
    Auth.currentAuthenticatedUser().then(user => {
      console.log('authenticated? yes');
      this.isAuthenticated = true;
      // sessionStorage.setItem('isAuthenticated', 'true');
      // sessionStorage.setItem('user', user);
    }).catch(e => {
      console.log(e);
      console.log('authenticated? no');
      this.isAuthenticated = false;
      // sessionStorage.setItem('isAuthenticated' 'false');
    })
  }
}

import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor() { }

  isAuthenticated(): boolean {
    Auth.currentAuthenticatedUser().then(user => {
      //   console.log(user.attributes.email);
          // console.log('guard authenticated? yes');
          // this.isAuthenticated = true;
      //   sessionStorage.setItem('isAuthenticated', 'true');
      //   // this.router.navigate(['/home'])
      //   // sessionStorage.setItem('user', user);
          return true;
      }).catch(e => {
      //   console.log(e);
        // console.log('guard authenticated? no');
          // this.isAuthenticated = false;
          // sessionStorage.setItem('isAuthenticated', 'false');
          return false;
      })
      return true;
  }
}

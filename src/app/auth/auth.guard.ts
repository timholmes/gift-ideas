import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthenticateService } from "./authenticate.service";


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authenticationService: AuthenticateService) {

    }

    canActivate(): boolean {
        let isAuthed = this.authenticationService.isAuthenticated();
        console.log('guard authenticated? ' + isAuthed);
        return isAuthed;
    }

}
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({template: ''})
export class LogoutComponent {

    constructor(private router: Router, private authService: AuthService) {
        authService.logout();
        router.navigate(['/landing']);
    }

}

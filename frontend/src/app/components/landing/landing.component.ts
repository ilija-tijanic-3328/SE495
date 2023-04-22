import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LayoutService} from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html'
})
export class LandingComponent {

    enterCodeDialog: boolean = false;
    code?: string;

    constructor(public layoutService: LayoutService, public router: Router) {
    }

    openQuiz() {
        if (this.code && this.code.length == 5) {
            this.enterCodeDialog = false;
            this.router.navigate(['/quiz', this.code]);
        }
    }

}

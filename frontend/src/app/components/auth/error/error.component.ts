import {Component} from '@angular/core';
import {LayoutService} from "../../../layout/service/app.layout.service";

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
})
export class ErrorComponent {

    constructor(protected layoutService: LayoutService) {
    }

}

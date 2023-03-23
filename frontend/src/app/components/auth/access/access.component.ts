import {Component} from '@angular/core';
import {LayoutService} from "../../../layout/service/app.layout.service";

@Component({
    selector: 'app-access',
    templateUrl: './access.component.html',
})
export class AccessComponent {

    constructor(protected layoutService: LayoutService) {
    }

}

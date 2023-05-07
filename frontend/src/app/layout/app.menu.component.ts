import {Component, OnInit} from '@angular/core';
import {LayoutService} from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) {
    }

    ngOnInit() {
        this.model = [
            {
                items: [
                    {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/app']},
                    {label: 'My Quizzes', icon: 'pi pi-fw pi-book', routerLink: ['/app/quizzes']},
                    {label: 'My Attempts', icon: 'pi pi-fw pi-file', routerLink: ['/app/attempts']},
                    {label: 'Take Quiz', icon: 'pi pi-fw pi-file-edit', routerLink: ['/app/invitations']},
                    {label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/app/pages/crud']}
                ]
            },
            {
                items: [
                    {
                        label: 'Log out', icon: 'pi pi-fw pi-sign-out', routerLink: ['/auth/logout']
                    }
                ]
            }
        ];
    }
}

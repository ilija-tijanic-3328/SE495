import {Component, OnInit} from '@angular/core';
import {LayoutService} from './service/app.layout.service';
import {AuthService} from "../services/auth.service";

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(protected layoutService: LayoutService, private authService: AuthService) {
    }

    ngOnInit() {
        let adminItems;

        if (this.authService.isAdmin()) {
            adminItems = [
                {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin']},
                {label: 'Users', icon: 'pi pi-fw pi-users', routerLink: ['/admin/users']},
                {label: 'Quizzes', icon: 'pi pi-fw pi-book', routerLink: ['/admin/quizzes']},
                {label: 'Notification', icon: 'pi pi-fw pi-envelope', routerLink: ['/admin/notification']},
                {label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/admin/pages/crud']}
            ];
        }

        this.model = [
            {
                items: adminItems
            },
            {
                items: [
                    {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/app']},
                    {label: 'My Quizzes', icon: 'pi pi-fw pi-book', routerLink: ['/app/quizzes']},
                    {label: 'My Attempts', icon: 'pi pi-fw pi-file', routerLink: ['/app/attempts']},
                    {label: 'Take Quiz', icon: 'pi pi-fw pi-file-edit', routerLink: ['/app/invitations']}
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

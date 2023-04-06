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
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/app/pages/crud']
                    }
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

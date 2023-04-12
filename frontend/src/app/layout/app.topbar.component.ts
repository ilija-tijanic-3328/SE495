import {Component, ElementRef, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {LayoutService} from "./service/app.layout.service";
import {NotificationsComponent} from "./notifications/notifications.component";
import {interval} from "rxjs";
import {NotificationService} from "../services/notification.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    @ViewChild(NotificationsComponent) notificationsPanel!: NotificationsComponent;

    unseenCount: number = 0;

    constructor(public layoutService: LayoutService, private notificationService: NotificationService) {
        this.updateUnseenCount();
        interval(10000).subscribe(() => {
            this.updateUnseenCount();
        });
    }

    onConfigButtonClick() {
        this.layoutService.openConfig();
    }

    private updateUnseenCount() {
        this.notificationService.getUnseenCount()
            .subscribe({
                next: data => {
                    if (this.unseenCount != data.unseen_count) {
                        this.notificationsPanel.updateNotifications();
                    }
                    this.unseenCount = data.unseen_count;
                }
            });
    }

    protected readonly String = String;

    onNotificationSeen(seenCount: number) {
        this.unseenCount -= seenCount;
    }

}

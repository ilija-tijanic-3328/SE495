import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {LayoutService} from "./service/app.layout.service";
import {NotificationsComponent} from "./notifications/notifications.component";
import {interval, Subscription} from "rxjs";
import {NotificationService} from "../services/notification.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnDestroy {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    @ViewChild(NotificationsComponent) notificationsPanel!: NotificationsComponent;

    unseenCount: number = 0;

    private notificationsSubscription: Subscription;

    constructor(public layoutService: LayoutService, private notificationService: NotificationService) {
        this.updateUnseenCount();
        this.notificationsSubscription = interval(10000).subscribe(() => {
            this.updateUnseenCount();
        });
    }

    onConfigButtonClick(): void {
        this.layoutService.openConfig();
    }

    private updateUnseenCount(): void {
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

    onNotificationSeen(seenCount: number): void {
        this.unseenCount -= seenCount;
    }


    ngOnDestroy(): void {
        this.notificationsSubscription.unsubscribe();
    }

}

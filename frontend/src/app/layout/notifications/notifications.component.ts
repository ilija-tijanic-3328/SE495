import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {LayoutService} from "../service/app.layout.service";
import {OverlayPanel} from "primeng/overlaypanel";
import {NotificationService} from "../../services/notification.service";

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {

    @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;

    @Output() notificationSeen = new EventEmitter<number>();

    protected notifications: any[] = [];

    constructor(protected layoutService: LayoutService, private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.updateNotifications();
    }

    toggleNotificationsOverlay(event: any) {
        this.overlayPanel.toggle(event);
    }

    markAsSeen(notification: any) {
        if (notification.seen_time == null) {
            this.notificationService.markNotificationAsSeen(notification.id)
                .subscribe({
                    next: data => {
                        if (data.length > 0) {
                            notification.seen_time = data[0].seen_time;
                            this.notificationSeen.emit(1);
                        }
                    }
                });
        }
    }

    updateNotifications() {
        this.notificationService.getUserNotifications()
            .subscribe({
                next: notifications => {
                    this.notifications = notifications;
                }
            });
    }

}

import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {NotificationService} from "../../../services/notification.service";
import {UserService} from "../../../services/user.service";
import {AutoCompleteUser} from "../../../models/response/auto-complete-user";

@Component({
    templateUrl: './admin-notification.component.html',
    styles: [`
        ::ng-deep .p-autocomplete .p-inputtext {
            padding-left: 30px;
        }
    `]
})
export class AdminNotificationComponent implements OnInit {

    users: AutoCompleteUser[] = [];
    suggestions: AutoCompleteUser[] = [];
    recipients: AutoCompleteUser[] = [];
    message: string = '';
    deepLink: string = '';
    allRecipients: boolean = false;

    constructor(private messageService: MessageService, private notificationService: NotificationService,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService.getActiveUsers()
            .subscribe({
                next: users => {
                    this.users = users.map(user => {
                        user.display = user.name + ' - ' + user.email;
                        return user;
                    });
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't load users",
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

    searchUsers(event: any) {
        const query = event.query;
        this.suggestions = [...this.users.filter(u => u.display?.includes(query))]
    }

    sendMessage() {
        let recipientIds = this.allRecipients ? this.users.map(u => u.id)
            : this.recipients.map(r => r.id);
        this.notificationService.sendMessage(recipientIds, this.message, this.deepLink)
            .subscribe({
                next: response => {
                    if (response.failed_for.length > 0) {
                        let recipientNames = this.users
                            .filter(u => response.failed_for.includes(u.id))
                            .map(u => u.display);
                        this.messageService.add({
                            severity: 'warn',
                            summary: "Message sent to some recipients",
                            detail: `Message failed for recipients: ${recipientNames}`,
                            sticky: true
                        });
                    } else {
                        this.messageService.add({
                            severity: 'success',
                            summary: "Message Sent",
                            detail: "Successfully sent message",
                            sticky: true
                        });
                    }
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't send message",
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

}

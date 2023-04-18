import {Component} from '@angular/core';
import {Account} from "../../models/response/account";
import {MessageService} from "primeng/api";
import {UserService} from "../../services/user.service";

@Component({
    templateUrl: './account.component.html'
})
export class AccountComponent {

    protected account: Account;

    constructor(private messageService: MessageService, private userService: UserService) {
        this.account = {"name": '', "email": ''};
        this.loadAccountData();
    }

    onSubmit() {
        this.userService.updateUser(this.account)
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: "Account info updated",
                        detail: 'Your account info has been updated',
                        sticky: true
                    });
                    this.loadAccountData();
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Account update failed",
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

    private loadAccountData() {
        this.userService.getUser()
            .subscribe({
                next: user => {
                    this.account.name = user.name;
                    this.account.email = user.email;
                    this.account.phoneNumber = user.phone_number;
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't load account data",
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

}

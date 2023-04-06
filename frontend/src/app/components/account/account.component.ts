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
        // TODO load account info from backend
        this.account = {name: "", email: ""};
    }

    onSubmit() {
        // TODO
    }

}

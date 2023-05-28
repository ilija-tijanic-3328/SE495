import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {User} from "../../../models/response/user";
import {UserService} from "../../../services/user.service";
import {Table} from "primeng/table";

@Component({
    templateUrl: './admin-user-list.component.html'
})
export class AdminUserListComponent implements OnInit {

    deleteUserDialog: boolean = false;

    users: User[] = [];

    selectedUser: User | null = null;

    columns: any = [
        {field: 'name', header: 'Name'},
        {field: 'email', header: 'Email'},
        {field: 'phone_number', header: 'Phone Number'},
        {field: 'role', header: 'Role'},
        {field: 'status', header: 'Status'}
    ];

    changeStatusDialog: boolean = false;
    selectedStatus: string | null = null;

    constructor(private messageService: MessageService, private userService: UserService) {
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    deleteUser(user: User, event: Event) {
        event.stopPropagation();
        this.deleteUserDialog = true;
        this.selectedUser = {...user};
    }

    confirmDelete() {
        this.deleteUserDialog = false;
        if (this.selectedUser) {
            this.userService.deleteUser(this.selectedUser)
                .subscribe({
                    next: () => {
                        this.users = this.users.filter(val => val.id !== this.selectedUser?.id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'User Deleted',
                            life: 3000
                        });
                        this.selectedUser = null;
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: "User deletion failed",
                            detail: message,
                            life: 4000
                        });
                    }
                });
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getSeverity(user: User) {
        switch (user.status) {
            case 'ACTIVE':
                return 'success';
            case 'LOCKED':
                return 'help';
            case 'DISABLED':
                return 'danger';
            case 'UNCONFIRMED':
                return 'warn';
            default:
                return '';
        }
    }

    private loadUsers() {
        this.userService.getAllUsers()
            .subscribe({
                next: userList => {
                    this.users = userList;
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't load users",
                        detail: message,
                        life: 4000
                    });
                }
            });
    }

    onUserClicked(user: User) {

    }

    openChangeStatusDialog(user: User) {
        if (user.role != 'ADMIN') {
            this.selectedUser = user;
            this.changeStatusDialog = true;
            this.selectedStatus = user.status;
        }
    }

    changeStatus() {
        this.changeStatusDialog = false;
        if (this.selectedUser && this.selectedStatus) {
            this.userService.changeStatus(this.selectedUser.id, this.selectedStatus)
                .subscribe({
                    next: () => {
                        this.users = [...this.users.map(u => {
                            if (this.selectedUser != null && this.selectedStatus != null && u.id == this.selectedUser.id) {
                                u.status = this.selectedStatus;
                            }
                            return u;
                        })]

                        this.messageService.add({
                            severity: 'success',
                            summary: "Status Updated",
                            detail: `Status of user ${this.selectedUser?.name} set to ${this.selectedStatus}`,
                            life: 3000
                        });
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: "Couldn't change status",
                            detail: message,
                            life: 4000
                        });
                    }
                });
        }
    }

}

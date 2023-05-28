import {Component} from '@angular/core';
import {Message, MessageService} from "primeng/api";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-delete-account',
    templateUrl: './delete-account.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class DeleteAccountComponent {

    messages: Message[] = [{
        severity: 'error',
        detail: 'Account deletion is a permanent and irreversible action that removes all your personal data ' +
            'on QuickQuiz.Ninja. Your quiz scores will still be visible to other users, but will no longer be ' +
            'associated with your account. If you want to continue using QuickQuiz.Ninja after deleting your account, ' +
            'you will have to register a new one.'
    }];

    protected password: string | null = null;
    deleteAccountDialog: boolean = false;

    constructor(private messageService: MessageService, private authService: AuthService, private router: Router) {
    }

    deleteAccount() {
        this.deleteAccountDialog = true;
    }

    confirmDelete() {
        if (this.password) {
            this.authService.deleteAccount(this.password)
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Account deleted',
                            detail: 'All your personal data has been deleted.',
                            sticky: true
                        });
                        this.authService.logout();
                        this.router.navigate(['/auth/login']);
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Account deletion failed',
                            detail: message,
                            sticky: true
                        });
                    }
                });
        }
    }

}

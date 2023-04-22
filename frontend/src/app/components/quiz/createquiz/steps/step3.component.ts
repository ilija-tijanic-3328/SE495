import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MessageService} from "primeng/api";
import {QuizService} from "../../../../services/quiz.service";
import {Quiz} from "../../../../models/response/quiz";
import {Participant} from "../../../../models/response/participant";
import {UserService} from "../../../../services/user.service";
import {AutoCompleteUser} from "../../../../models/response/auto-complete-user";
import {Router} from "@angular/router";

@Component({
    selector: 'app-step3',
    templateUrl: './step3.component.html',
    styles: [`
        ::ng-deep .p-autocomplete .p-inputtext {
            padding-left: 30px;
        }
    `]
})
export class Step3Component implements OnChanges {

    @Input() quiz: Quiz = {};
    @Output() indexChange = new EventEmitter<number>();
    allDisabled: Boolean = false;
    touched: boolean = false;
    totalParticipants: number = 0;
    selectedUsers: AutoCompleteUser[] = [];
    enteredEmails: string[] = [];
    enteredNames: string[] = [];
    suggestions: AutoCompleteUser[] = [];
    users: AutoCompleteUser[] = [];
    userParticipants: Participant[] = [];
    emailParticipants: Participant[] = [];
    manualParticipants: Participant[] = [];
    selectedParticipant: Participant | null = null;
    private readonly codeCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    private readonly emailRegex: RegExp = new RegExp('^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$');
    // @ts-ignore
    separatorRegex: string = /[,;\t]/;

    constructor(private messageService: MessageService, private quizService: QuizService,
                private userService: UserService, private router: Router) {
    }

    ngOnChanges(): void {
        if (this.quiz.id) {
            let now = new Date();

            if (this.quiz.status == 'ARCHIVED' || (this.quiz.end_time && now > this.quiz.end_time)) {
                this.allDisabled = true;
            }

            this.loadParticipants();
        }
        this.loadUsers();
    }

    onPrevStep() {
        this.indexChange.emit(1);
    }

    onPublish() {
        let participants = this.userParticipants.concat(this.emailParticipants).concat(this.manualParticipants);

        this.quizService.updateParticipants(this.quiz.id, participants)
            .subscribe({
                next: response => {
                    if (response.not_sent.length > 0) {
                        const action = this.quiz.status == 'DRAFT' ? 'Published' : 'Saved';
                        this.messageService.add({
                            severity: 'warning',
                            summary: `${action} quiz but couldn't send invitation to these participants:`,
                            detail: response.not_sent.join(', '),
                            sticky: true
                        });
                    }

                    if (response.not_deleted.length > 0) {
                        this.messageService.add({
                            severity: 'warning',
                            summary: "Couldn't delete these participants because they have already attempted the quiz:",
                            detail: response.not_deleted.join(', '),
                            sticky: true
                        });
                    }

                    if (response.not_sent.length == 0 && response.not_deleted.length == 0) {
                        const action = this.quiz.status == 'DRAFT' ? 'Published' : 'Saved';
                        this.messageService.add({
                            severity: 'success',
                            summary: "Successful",
                            detail: `${action} quiz and sent invitations to participants`,
                            sticky: true
                        });
                        this.router.navigate(['/app/quizzes']);
                    }
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    const action = this.quiz.status == 'DRAFT' ? 'publish' : 'save';
                    this.messageService.add({
                        severity: 'error',
                        summary: `Couldn't ${action} quiz`,
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

    private loadParticipants() {
        this.quizService.getParticipants(this.quiz.id)
            .subscribe({
                next: participants => {
                    this.totalParticipants = participants.length;
                    this.userParticipants = participants.filter(p => p.invitation_type == 'NOTIFICATION');
                    this.emailParticipants = participants.filter(p => p.invitation_type == 'EMAIL');
                    this.manualParticipants = participants.filter(p => p.invitation_type == 'MANUAL');
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't load participants",
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

    private loadUsers() {
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

    deleteUserParticipant(item: any, event: Event) {
        event.stopPropagation();
        this.userParticipants = this.userParticipants.filter(p => p.id != item.id || p.code != item.code);
        this.totalParticipants--;
        this.touched = true;
    }

    deleteEmailParticipant(item: any, event: Event) {
        event.stopPropagation();
        this.emailParticipants = this.emailParticipants.filter(p => p.id != item.id || p.code != item.code);
        this.totalParticipants--;
        this.touched = true;
    }

    deleteManualParticipant(item: any, event: Event) {
        event.stopPropagation();
        this.manualParticipants = this.manualParticipants.filter(p => p.id != item.id || p.code != item.code);
        this.totalParticipants--;
        this.touched = true;
    }

    addUserParticipants() {
        this.selectedUsers.forEach(selectedUser => {
            const alreadyAdded = this.userParticipants.find(up => up.user_id == selectedUser.id);
            if (!alreadyAdded) {
                let participant: Participant = {
                    user_id: selectedUser.id,
                    name: selectedUser.name,
                    invitation_type: 'NOTIFICATION',
                    code: this.generateCode(),
                    email: selectedUser.email
                };
                this.userParticipants.push(participant);
                this.totalParticipants++;
                this.touched = true;
            }
        })
        this.userParticipants = [...this.userParticipants];
        this.selectedUsers = [];
    }

    addEmailParticipants() {
        this.enteredEmails.forEach(email => {
            if (this.emailRegex.test(email)) {
                const alreadyAdded = this.emailParticipants.find(ep => ep.email == email);
                if (!alreadyAdded) {
                    let participant: Participant = {
                        email: email,
                        invitation_type: 'EMAIL',
                        code: this.generateCode()
                    };
                    this.emailParticipants.push(participant);
                    this.totalParticipants++;
                    this.touched = true;
                }
            }
        })
        this.emailParticipants = [...this.emailParticipants];
        this.enteredEmails = [];
    }

    addManualParticipants() {
        this.enteredNames.forEach(name => {
            let participant: Participant = {
                name: name,
                invitation_type: 'MANUAL',
                code: this.generateCode()
            };
            this.manualParticipants.push(participant);
            this.totalParticipants++;
            this.touched = true;
        })
        this.manualParticipants = [...this.manualParticipants];
        this.enteredNames = [];
    }

    protected generateCode() {
        let result = '';
        const charactersLength = this.codeCharacters.length;

        for (let i = 0; i < 5; i++) {
            result += this.codeCharacters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    openNameDialog(item: Participant) {
        if (!item.id) {
            this.selectedParticipant = item;
        }
    }

    setName(nameInput: HTMLInputElement) {
        if (this.selectedParticipant) {
            this.selectedParticipant.name = nameInput.value;
            nameInput.value = '';
            this.selectedParticipant = null;
        }
    }

    copyToClipboard(code: string) {
        navigator.clipboard.writeText(code);
    }

}

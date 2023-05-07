import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {ParticipationService} from "../../../services/participation.service";
import {Invitation} from "../../../models/response/invitation";

@Component({
    templateUrl: './invitation-list.component.html'
})
export class InvitationListComponent implements OnInit {

    invitations: Invitation[] = [];
    enterCodeDialog: boolean = false;
    code?: string;


    constructor(private messageService: MessageService, private participationService: ParticipationService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.loadInvitations();
    }

    private loadInvitations() {
        this.participationService.getUserInvitations()
            .subscribe({
                next: invitations => {
                    this.invitations = invitations;
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't load your invitations",
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

    onInvitationClicked(invitation: any) {
        this.router.navigate(['/app/quiz', invitation.value[0].code]);
    }

    openQuiz() {
        if (this.code && this.code.length == 5) {
            this.enterCodeDialog = false;
            this.router.navigate(['/app/quiz', this.code]);
        }
    }

}

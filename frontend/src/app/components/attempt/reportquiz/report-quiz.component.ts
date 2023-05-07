import {Component, Input} from '@angular/core';
import {MessageService} from "primeng/api";
import {ParticipationService} from "../../../services/participation.service";

@Component({
    selector: 'app-report-quiz',
    templateUrl: './report-quiz.component.html'
})
export class ReportQuizComponent {

    @Input() participantId: any;
    reportDialog: boolean = false;
    message: string | null = null;

    constructor(private messageService: MessageService, private participationService: ParticipationService) {
    }

    sendReportToAdmin() {
        if (this.message) {
            this.participationService.reportQuizToAdmin(this.participantId, this.message)
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: `Report Sent to Admin`,
                            detail: 'Thank you for helping make QuickQuiz.Ninja a better place',
                            sticky: true
                        });
                        this.message = null;
                        this.reportDialog = false;
                    },
                    error: error => {
                        const message = error?.error?.error || 'Unknown error occurred';
                        this.messageService.add({
                            severity: 'error',
                            summary: `Couldn't submit report`,
                            detail: message,
                            sticky: true
                        });
                    }
                });
        }
    }

}

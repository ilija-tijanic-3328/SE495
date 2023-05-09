import {Component, OnInit} from '@angular/core';
import {MessageService, SelectItem} from "primeng/api";
import {DataView} from "primeng/dataview";
import {ParticipantAttempt} from "../../../models/response/participant-attempt";
import {ParticipationService} from "../../../services/participation.service";
import {formatNumber} from "@angular/common";

@Component({
    templateUrl: './attempt-list.component.html'
})
export class AttemptListComponent implements OnInit {

    attempts: ParticipantAttempt[] = [];

    sortField: string = 'start_time';

    sortOrder: number = 1;

    searchFields: string = 'name,code,quiz.title,start_time,end_time';

    sortOptions: SelectItem[] = [
        {label: "Sort by Start Time Ascending", value: "start_time"},
        {label: "Sort by Start Time Descending", value: "!start_time"},
        {label: "Sort by Title Ascending", value: "quiz.title"},
        {label: "Sort by Title Descending", value: "!quiz.title"}
    ];

    constructor(private messageService: MessageService, private participationService: ParticipationService) {
    }

    ngOnInit(): void {
        this.loadAttempts();
    }

    onGlobalFilter(dataView: DataView, event: Event) {
        dataView.filter((event.target as HTMLInputElement).value, 'contains');
    }

    onSortChange(event: any) {
        let value = event.value;

        if (value.indexOf('!') == 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    getSeverity(attempt: ParticipantAttempt) {
        if (attempt.percentage > 90) {
            return '#22C55E';
        } else if (attempt.percentage > 75) {
            return '#6366F1';
        } else if (attempt.percentage > 50) {
            return '#F59E0B';
        } else {
            return '#EF4444';
        }
    }

    private loadAttempts() {
        this.participationService.getUserAttempts()
            .subscribe({
                next: attempts => {
                    this.attempts = attempts.map(p => {
                        let date = new Date(1970, 0, 1);
                        date.setSeconds(p.duration_seconds);
                        p.duration = date;
                        return p;
                    });
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: "Couldn't load your attempts",
                        detail: message,
                        sticky: true
                    });
                }
            });
    }

    protected readonly formatNumber = formatNumber;
}

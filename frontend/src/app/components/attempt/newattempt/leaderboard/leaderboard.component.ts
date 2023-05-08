import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {ParticipationService} from "../../../../services/participation.service";

@Component({
    templateUrl: './leaderboard.component.html'
})
export class LeaderboardComponent implements OnInit {

    attempt: any = null;
    code: string | null = null;

    constructor(private messageService: MessageService, private router: Router, private route: ActivatedRoute,
                private authService: AuthService, private participationService: ParticipationService) {
    }

    ngOnInit(): void {
        let quizId: string | null = this.route.snapshot.paramMap.get('quizId');

        if (quizId) {

        } else {
            this.messageService.add({
                severity: 'error',
                summary: "Invalid Id",
                detail: 'Missing quiz id',
                sticky: true
            });
            this.router.navigate(['/landing']);
        }
    }

}

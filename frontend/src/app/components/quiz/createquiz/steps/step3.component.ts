import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MessageService} from "primeng/api";
import {QuizService} from "../../../../services/quiz.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Quiz} from "../../../../models/response/quiz";

@Component({
    selector: 'app-step3',
    templateUrl: './step3.component.html'
})
export class Step3Component implements OnChanges {

    @Input() quiz: Quiz = {};
    @Output() indexChange = new EventEmitter<number>();
    allDisabled: Boolean = false;

    constructor(private messageService: MessageService, private quizService: QuizService, private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnChanges(): void {

    }

    onPrevStep() {
        this.indexChange.emit(1);
    }

    onFinish() {

    }

}

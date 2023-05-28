import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {StyleClassModule} from 'primeng/styleclass';
import {ReportQuizRoutingModule} from "./report-quiz-routing.module";
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";
import {TooltipModule} from "primeng/tooltip";
import {ReportQuizComponent} from "./report-quiz.component";
import {InputTextareaModule} from "primeng/inputtextarea";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StyleClassModule,
        ButtonModule,
        ReportQuizRoutingModule,
        RippleModule,
        DialogModule,
        TooltipModule,
        InputTextareaModule
    ],
    exports: [
        ReportQuizComponent
    ],
    declarations: [ReportQuizComponent]
})
export class ReportQuizModule {
}

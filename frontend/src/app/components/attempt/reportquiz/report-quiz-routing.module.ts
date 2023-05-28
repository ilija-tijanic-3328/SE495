import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ReportQuizComponent} from "./report-quiz.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: ReportQuizComponent}
    ])],
    exports: [RouterModule]
})
export class ReportQuizRoutingModule {
}

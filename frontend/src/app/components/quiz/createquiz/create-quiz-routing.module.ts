import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CreateQuizComponent} from "./create-quiz.component";
import {Step1Component} from "./steps/step1.component";
import {Step2Component} from "./steps/step2.component";
import {Step3Component} from "./steps/step3.component";

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '', component: CreateQuizComponent,
            children: [
                {
                    path: '1',
                    component: Step1Component
                },
                {
                    path: '2',
                    component: Step2Component
                },
                {
                    path: '3',
                    component: Step3Component
                }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class CreateQuizRoutingModule {
}

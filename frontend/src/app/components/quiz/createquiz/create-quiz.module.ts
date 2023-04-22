import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {StyleClassModule} from 'primeng/styleclass';
import {CreateQuizRoutingModule} from "./create-quiz-routing.module";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {FileUploadModule} from "primeng/fileupload";
import {ToolbarModule} from "primeng/toolbar";
import {RatingModule} from "primeng/rating";
import {DialogModule} from "primeng/dialog";
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {TagModule} from "primeng/tag";
import {CheckboxModule} from "primeng/checkbox";
import {TooltipModule} from "primeng/tooltip";
import {CreateQuizComponent} from "./create-quiz.component";
import {StepsModule} from "primeng/steps";
import {Step1Component} from "./steps/step1.component";
import {Step2Component} from "./steps/step2.component";
import {Step3Component} from "./steps/step3.component";
import {InputNumberModule} from "primeng/inputnumber";
import {CalendarModule} from "primeng/calendar";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {OrderListModule} from "primeng/orderlist";
import {TabViewModule} from "primeng/tabview";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ChipsModule} from "primeng/chips";
import {PasswordModule} from "primeng/password";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        StyleClassModule,
        ButtonModule,
        CreateQuizRoutingModule,
        RippleModule,
        InputTextModule,
        FileUploadModule,
        ToolbarModule,
        RatingModule,
        DialogModule,
        DataViewModule,
        DropdownModule,
        TagModule,
        CheckboxModule,
        TooltipModule,
        StepsModule,
        InputNumberModule,
        CalendarModule,
        ProgressSpinnerModule,
        OrderListModule,
        TabViewModule,
        AutoCompleteModule,
        ChipsModule,
        PasswordModule
    ],
    declarations: [CreateQuizComponent, Step1Component, Step2Component, Step3Component]
})
export class CreateQuizModule {
}

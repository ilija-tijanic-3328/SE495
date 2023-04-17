import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {StyleClassModule} from 'primeng/styleclass';
import {QuizRoutingModule} from "./quiz-routing.module";
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

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        StyleClassModule,
        ButtonModule,
        QuizRoutingModule,
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
        TooltipModule
    ],
    declarations: []
})
export class QuizModule {
}

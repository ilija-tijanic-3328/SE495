import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {StyleClassModule} from 'primeng/styleclass';
import {StatsRoutingModule} from "./stats-routing.module";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {ToolbarModule} from "primeng/toolbar";
import {DialogModule} from "primeng/dialog";
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {TagModule} from "primeng/tag";
import {CheckboxModule} from "primeng/checkbox";
import {TooltipModule} from "primeng/tooltip";
import {StatsComponent} from "./stats.component";
import {RadioButtonModule} from "primeng/radiobutton";
import {ReportQuizModule} from "../../reportquiz/report-quiz.module";
import {ChartModule} from "primeng/chart";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        StyleClassModule,
        ButtonModule,
        StatsRoutingModule,
        RippleModule,
        InputTextModule,
        ToolbarModule,
        DialogModule,
        DataViewModule,
        DropdownModule,
        TagModule,
        CheckboxModule,
        TooltipModule,
        RadioButtonModule,
        ReportQuizModule,
        ChartModule
    ],
    declarations: [StatsComponent]
})
export class StatsModule {
}

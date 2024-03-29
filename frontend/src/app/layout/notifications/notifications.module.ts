import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {NotificationsComponent} from './notifications.component';
import {OverlayPanelModule} from "primeng/overlaypanel";
import {ScrollerModule} from "primeng/scroller";
import {RouterLink} from "@angular/router";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ButtonModule,
		OverlayPanelModule,
		ScrollerModule,
		RouterLink
	],
    declarations: [
        NotificationsComponent
    ],
    exports: [
        NotificationsComponent
    ]
})
export class NotificationsModule {
}

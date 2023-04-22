import {Component, Input, OnInit} from '@angular/core';
import {LayoutService} from "../service/app.layout.service";
import {UserService} from "../../services/user.service";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html'
})
export class AppConfigComponent implements OnInit {

    @Input() minimal: boolean = false;

    scales: number[] = [12, 13, 14, 15, 16];

    private configMap: Map<string, Function> = new Map<string, Function>([
        ['UI_SCALE', this.setScale],
        ['UI_MENU_MODE', this.setMenuMode],
        ['UI_DARK_MODE', this.setDarkMode],
        ['AUTH_2_FACTOR', this.setTwoFactorAuth]
    ]);

    constructor(protected layoutService: LayoutService, private userService: UserService,
                private messageService: MessageService) {
        layoutService.configOpen$.subscribe(() => this.layoutService.showConfigSidebar());
    }

    ngOnInit() {
        this.userService.getUserConfigs()
            .subscribe({
                next: (userConfigs: any[]) => {
                    for (let config of userConfigs) {
                        let setter: Function | undefined = this.configMap.get(config.config);
                        if (setter && config.value != null) {
                            setter(config.value, this);
                        }
                    }
                }
            });
    }

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    set scale(_val: number) {
        this.updateUserConfig('UI_SCALE', _val);
    }

    private setScale(_val: number | string, component: AppConfigComponent) {
        component.layoutService.config.scale = Number(_val);
        component.applyScale();
    }

    get menuMode(): string {
        return this.layoutService.config.menuMode;
    }

    set menuMode(_val: string) {
        this.updateUserConfig('UI_MENU_MODE', _val);
    }

    private setMenuMode(_val: string, component: AppConfigComponent) {
        component.layoutService.config.menuMode = _val;
    }

    get darkMode(): boolean {
        return this.layoutService.config.colorScheme == 'dark';
    }

    set darkMode(_val: boolean) {
        this.updateUserConfig('UI_DARK_MODE', _val);
    }

    private setDarkMode(_val: boolean | string, component: AppConfigComponent) {
        if (_val == true || _val == 'true') {
            component.changeTheme('lara-dark-indigo', 'dark');
        } else {
            component.changeTheme('lara-light-indigo', 'light');
        }
    }

    get twoFactorAuth(): boolean {
        return this.layoutService.config.twoFactorAuth;
    }

    set twoFactorAuth(_val: boolean) {
        this.updateUserConfig('AUTH_2_FACTOR', _val);
    }

    private setTwoFactorAuth(_val: boolean | string, component: AppConfigComponent) {
        component.layoutService.config.twoFactorAuth = _val == true || _val == 'true';
    }

    changeTheme(theme: string, colorScheme: string) {
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
        this.replaceThemeLink(newHref, () => {
            this.layoutService.config.theme = theme;
            this.layoutService.config.colorScheme = colorScheme;
            this.layoutService.onConfigUpdate();
        });
    }

    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-css';
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
            onComplete();
        });
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }

    updateUserConfig(config: string, value: any) {
        this.userService.updateUserConfig(config, value)
            .subscribe({
                next: () => {
                    let setter: Function | undefined = this.configMap.get(config);
                    if (setter) {
                        setter(value, this);
                    }
                },
                error: error => {
                    const message = error?.error?.error || 'Unknown error occurred';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Settings change failed',
                        detail: message,
                        life: 4000
                    })
                }
            });
    }

}

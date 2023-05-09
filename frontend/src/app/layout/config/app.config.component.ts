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

    twoFactorAuth: boolean;
    darkMode: boolean;

    constructor(protected layoutService: LayoutService, private userService: UserService,
                private messageService: MessageService) {
        layoutService.configOpen$.subscribe(() => this.layoutService.showConfigSidebar());
        this.twoFactorAuth = layoutService.config.twoFactorAuth;
        this.darkMode = layoutService.config.colorScheme == 'dark';
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
        this.updateUserConfig('UI_SCALE', _val, this.scale);
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

    private setDarkMode(_val: boolean | string, component: AppConfigComponent) {
        let value = _val == true || _val == 'true';
        if (value) {
            component.changeTheme('lara-dark-indigo', 'dark');
        } else {
            component.changeTheme('lara-light-indigo', 'light');
        }
        component.darkMode = value;
    }

    private setTwoFactorAuth(_val: boolean | string, component: AppConfigComponent) {
        let value = _val == true || _val == 'true';
        component.layoutService.config.twoFactorAuth = value;
        component.twoFactorAuth = value;
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

    updateUserConfig(config: string, value: any, previousValue: any = null) {
        this.userService.updateUserConfig(config, value)
            .subscribe({
                next: () => {
                    let setter: Function | undefined = this.configMap.get(config);
                    if (setter) {
                        setter(value, this);
                    }
                },
                error: error => {
                    if (previousValue != null) {
                        let setter: Function | undefined = this.configMap.get(config);
                        if (setter) {
                            setter(previousValue, this);
                        }
                    }
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

    onTwoFactorAuthChange(event: any) {
        this.updateUserConfig('AUTH_2_FACTOR', event.checked, !event.checked);
    }

    onDarkModeChange(event: any) {
        this.updateUserConfig('UI_DARK_MODE', event.checked, !event.checked);
    }

}

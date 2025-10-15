import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon, lucideMonitor, lucideCheck } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [NgIcon, HlmIcon, BrnMenuImports, HlmMenuImports, HlmButtonImports],
  providers: [provideIcons({ lucideSun, lucideMoon, lucideMonitor, lucideCheck })],
  template: `
    <button hlmBtn variant="ghost" size="icon" [brnMenuTriggerFor]="themeMenu">
      @if (theme() === 'light') {
        <ng-icon hlm name="lucideSun" size="sm" />
      } @else if (theme() === 'dark') {
        <ng-icon hlm name="lucideMoon" size="sm" />
      } @else {
        <ng-icon hlm name="lucideMonitor" size="sm" />
      }
      <span class="sr-only">Toggle theme</span>
    </button>

    <ng-template #themeMenu>
      <hlm-menu class="w-40">
        <hlm-menu-group>
          <button hlmMenuItem (click)="setTheme('light')">
            <ng-icon hlm name="lucideSun" size="sm" />
            <span>Light</span>
            @if (theme() === 'light') {
              <ng-icon hlm name="lucideCheck" size="sm" class="ml-auto" />
            }
          </button>
          <button hlmMenuItem (click)="setTheme('dark')">
            <ng-icon hlm name="lucideMoon" size="sm" />
            <span>Dark</span>
            @if (theme() === 'dark') {
              <ng-icon hlm name="lucideCheck" size="sm" class="ml-auto" />
            }
          </button>
          <button hlmMenuItem (click)="setTheme('system')">
            <ng-icon hlm name="lucideMonitor" size="sm" />
            <span>System</span>
            @if (theme() === 'system') {
              <ng-icon hlm name="lucideCheck" size="sm" class="ml-auto" />
            }
          </button>
        </hlm-menu-group>
      </hlm-menu>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  private readonly themeService = inject(ThemeService);

  protected readonly theme = this.themeService.theme;

  protected setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}

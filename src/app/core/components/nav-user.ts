import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import {
  lucideBadgeCheck,
  lucideBell,
  lucideCreditCard,
  lucideLogOut,
  lucideSparkles,
} from '@ng-icons/lucide';

interface User {
  name: string;
  email: string;
  avatar: string;
}

@Component({
  selector: 'app-nav-user',
  imports: [HlmSidebarImports, HlmAvatarImports, HlmIcon, NgIcon, BrnMenuImports, HlmMenuImports],
  providers: [
    provideIcons({ lucideSparkles, lucideLogOut, lucideBell, lucideBadgeCheck, lucideCreditCard }),
  ],
  template: `
    <ul hlmSidebarMenu>
      <li hlmSidebarMenuItem>
        <button
          hlmSidebarMenuButton
          [brnMenuTriggerFor]="menu"
          align="center"
          size="lg"
          class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div
            class="flex items-center gap-2 py-1.5 text-left text-sm"
            [class.px-1]="_hlmSidebarService.open()"
          >
            <hlm-avatar class="h-8 w-8 rounded-lg">
              <img [src]="user()?.avatar" [alt]="user()?.name" hlmAvatarImage />
              <span class="bg-[#FD005B] text-white rounded-lg" hlmAvatarFallback>RG</span>
            </hlm-avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user()?.name }}</span>
              <span class="truncate text-xs">{{ user()?.email }}</span>
            </div>
          </div>

          <ng-icon hlm name="lucideChevronsUpDown" class="ml-auto" size="sm" />
        </button>
      </li>
    </ul>

    <ng-template #menu>
      <hlm-menu class="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg">
        <hlm-menu-label>
          <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <hlm-avatar class="h-8 w-8 rounded-lg">
              <img [src]="user()?.avatar" [alt]="user()?.name" hlmAvatarImage />
              <span class="bg-[#FD005B] text-white rounded-lg" hlmAvatarFallback>RG</span>
            </hlm-avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user()?.name }}</span>
              <span class="truncate text-xs">{{ user()?.email }}</span>
            </div>
          </div>
        </hlm-menu-label>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem>
            <ng-icon hlm name="lucideSparkles" size="sm" />
            <span>Upgrade to Pro</span>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem>
            <ng-icon hlm name="lucideBadgeCheck" size="sm" />
            <span>Account</span>
          </button>

          <button hlmMenuItem>
            <ng-icon hlm name="lucideCreditCard" size="sm" />
            <span>Billing</span>
          </button>

          <button hlmMenuItem>
            <ng-icon hlm name="lucideBell" size="sm" />
            <span>Notifications</span>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem>
            <ng-icon hlm name="lucideLogOut" size="sm" />
            <span>Log out</span>
          </button>
        </hlm-menu-group>
      </hlm-menu>
    </ng-template>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavUser {
  protected readonly _hlmSidebarService = inject(HlmSidebarService);

  user = input<User>();
}

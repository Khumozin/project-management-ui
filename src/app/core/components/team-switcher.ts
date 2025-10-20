import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

interface Team {
  name: string;
  logo: string;
  plan: string;
}

@Component({
  selector: 'app-team-switcher',
  imports: [
    HlmSidebarImports,
    BrnCollapsibleImports,
    HlmMenuImports,
    BrnMenuImports,
    HlmIcon,
    NgIcon,
  ],
  providers: [provideIcons({ lucidePlus })],
  template: `
    <ul hlmSidebarMenu>
      <li hlmSidebarMenuItem>
        <!-- class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"   -->
        <a
          hlmSidebarMenuButton
          [brnMenuTriggerFor]="menu"
          align="center"
          size="lg"
          class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <!-- bg-foreground text-accent  -->
          <div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg border">
            <ng-icon hlm [name]="activeTeam()?.logo" class="size-4" size="sm" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-medium">{{ activeTeam()?.name }}</span>
            <span class="truncate text-xs">{{ activeTeam()?.plan }}</span>
          </div>
          <ng-icon hlm name="lucideChevronsUpDown" size="sm" class="ml-auto" />
        </a>
      </li>
    </ul>

    <ng-template #menu>
      <hlm-menu class="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg">
        <hlm-menu-label class="text-muted-foreground text-xs"> Teams </hlm-menu-label>

        <hlm-menu-group>
          @for (team of teams(); track $index) {
            <button hlmMenuItem class="gap-2 p-2" (click)="activeTeam.set(team)">
              <div class="flex size-6 items-center justify-center rounded-md border">
                <ng-icon hlm [name]="team.logo" class="size-3.5 shrink-0" size="sm" />
              </div>
              {{ team.name }}
              <div hlmSidebarMenuBadge>⌘{{ $index + 1 }}</div>
            </button>
          }
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem class="gap-2 p-2">
            <div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
              <ng-icon hlm name="lucidePlus" size="sm" class="size-4" />
            </div>
            <div class="text-muted-foreground font-medium">Add team</div>
          </button>
        </hlm-menu-group>
      </hlm-menu>
    </ng-template>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamSwitcher {
  readonly teams = input<Team[]>();

  readonly activeTeam = linkedSignal(() => {
    const teams = this.teams();
    if (teams) {
      return teams[0];
    }

    return null;
  });
}

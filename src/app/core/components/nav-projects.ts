import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideFolder, lucideForward, lucideTrash2 } from '@ng-icons/lucide';
import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { RouterLink } from '@angular/router';

interface Project {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-nav-projects',
  imports: [
    HlmSidebarImports,
    BrnCollapsibleImports,
    HlmMenuImports,
    BrnMenuImports,
    HlmIcon,
    NgIcon,
    RouterLink
  ],
  providers: [
    provideIcons({
      lucideFolder,
      lucideForward,
      lucideTrash2,
      lucideEllipsis,
    }),
  ],
  template: `
    <div hlmSidebarGroup>
      <div hlmSidebarGroupLabel>Projects</div>
      <div hlmSidebarGroupContent>
        <ul hlmSidebarMenu>
          @for (project of items(); track $index) {
            <li hlmSidebarMenuItem>
              <a hlmSidebarMenuButton [routerLink]="project.url">
                <ng-icon hlm [name]="project.icon" size="sm" />
                <span>{{ project.name }}</span>
              </a>
              <button hlmSidebarMenuAction [brnMenuTriggerFor]="menu">
                <ng-icon hlm name="lucideEllipsis" size="sm" />
                <span class="sr-only">More</span>
              </button>

              <ng-template #menu>
                <hlm-menu>
                  <button hlmMenuItem>Edit Project</button>
                  <button hlmMenuItem>Delete Project</button>
                </hlm-menu>
              </ng-template>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavProjects {
  items = input<Project[]>();
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';

interface NavMainItem {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  defaultOpen?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

@Component({
  selector: 'app-nav-main',
  imports: [HlmSidebarImports, BrnCollapsibleImports, HlmIcon, NgIcon],
  template: `
    <div hlmSidebarGroup>
      <div hlmSidebarGroupLabel>Platform</div>
      <div hlmSidebarGroupContent>
        <ul hlmSidebarMenu>
          @for (item of items(); track item.title) {
            <brn-collapsible [expanded]="!!item.defaultOpen" class="group/collapsible">
              <li hlmSidebarMenuItem>
                <button
                  brnCollapsibleTrigger
                  hlmSidebarMenuButton
                  class="flex w-full items-center justify-between"
                >
                  @if (item.icon) {
                    <ng-icon hlm [name]="item.icon" size="sm" />
                  }
                  <span>{{ item.title }}</span>
                  <ng-icon
                    name="lucideChevronRight"
                    class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    hlm
                    size="sm"
                  />
                </button>
                <brn-collapsible-content>
                  <ul hlmSidebarMenuSub>
                    @for (subItem of item.items; track subItem.title) {
                      <li hlmSidebarMenuSubItem>
                        <button hlmSidebarMenuSubButton class="w-full">
                          <span>{{ subItem.title }}</span>
                        </button>
                      </li>
                    }
                  </ul>
                </brn-collapsible-content>
              </li>
            </brn-collapsible>
          }
        </ul>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMain {
  items = input<NavMainItem[]>();
}

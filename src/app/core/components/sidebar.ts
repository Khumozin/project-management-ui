import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { TeamSwitcher } from './team-switcher';
import { NavMain } from './nav-main';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';
import { provideIcons } from '@ng-icons/core';
import {
  lucideGalleryVerticalEnd,
  lucideAudioWaveform,
  lucideCommand,
  lucideSquareTerminal,
  lucideBot,
  lucideBookOpen,
  lucideSettings2,
  lucideFrame,
  lucideMap,
  lucideChartPie,
  lucideChevronRight,
  lucideChevronsUpDown,
} from '@ng-icons/lucide';

const data = {
  user: {
    name: 'spartan',
    email: 'm@example.com',
    avatar: 'https://spartan.ng/assets/avatar.png',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: 'lucideGalleryVerticalEnd',
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: 'lucideAudioWaveform',
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: 'lucideCommand',
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '',
      icon: 'lucideSquareTerminal',
      isActive: true,
      items: [
        {
          title: 'History',
          url: '',
        },
        {
          title: 'Starred',
          url: '',
        },
        {
          title: 'Settings',
          url: '',
        },
      ],
    },
    {
      title: 'Models',
      url: '',
      icon: 'lucideBot',
      items: [
        {
          title: 'Genesis',
          url: '',
        },
        {
          title: 'Explorer',
          url: '',
        },
        {
          title: 'Quantum',
          url: '',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '',
      icon: 'lucideBookOpen',
      items: [
        {
          title: 'Introduction',
          url: '',
        },
        {
          title: 'Get Started',
          url: '',
        },
        {
          title: 'Tutorials',
          url: '',
        },
        {
          title: 'Changelog',
          url: '',
        },
      ],
    },
    {
      title: 'Settings',
      url: '',
      icon: 'lucideSettings2',
      items: [
        {
          title: 'General',
          url: '',
        },
        {
          title: 'Team',
          url: '',
        },
        {
          title: 'Billing',
          url: '',
        },
        {
          title: 'Limits',
          url: '',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '',
      icon: 'lucideFrame',
    },
    {
      name: 'Sales & Marketing',
      url: '',
      icon: 'lucideChartPie',
    },
    {
      name: 'Travel',
      url: '/projects',
      icon: 'lucideMap',
    },
  ],
};

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports, TeamSwitcher, NavMain, NavProjects, NavUser],
  providers: [
    provideIcons({
      lucideGalleryVerticalEnd,
      lucideAudioWaveform,
      lucideCommand,
      lucideSquareTerminal,
      lucideBot,
      lucideBookOpen,
      lucideSettings2,
      lucideFrame,
      lucideChartPie,
      lucideMap,
      lucideChevronRight,
      lucideChevronsUpDown,
    }),
  ],
  template: `
    <hlm-sidebar [collapsible]="'icon'">
      <div hlmSidebarHeader>
        <app-team-switcher [teams]="data.teams" />
      </div>
      <div hlmSidebarContent>
        <app-nav-main [items]="data.navMain" />
        <app-nav-projects [items]="data.projects" />
      </div>
      <div hlmSidebarFooter>
        <app-nav-user [user]="data.user" />
      </div>
    </hlm-sidebar>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  data = data;
}

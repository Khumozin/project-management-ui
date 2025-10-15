import { Component, computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { filter } from 'rxjs';

export interface BreadcrumbData {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _router = inject(Router);
  // Subject emitting the breadcrumb hierarchy
  private readonly _breadcrumbs = signal<BreadcrumbData[]>([]);

  // Observable exposing the breadcrumb hierarchy
  readonly breadcrumbs = computed(() => this._breadcrumbs());

  constructor() {
    this._router.events
      .pipe(
        // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        // Construct the breadcrumb hierarchy
        const root = this._router.routerState.snapshot.root;
        const breadcrumbs = new Map<string, string>();
        this.addBreadcrumb(root, [], breadcrumbs);

        // Emit the new hierarchy
        const _breadcrumbs = Array.from(
          breadcrumbs,
          ([label, url]) =>
            ({
              label,
              url,
            }) as BreadcrumbData,
        );

        this._breadcrumbs.set(_breadcrumbs);
      });
  }

  private addBreadcrumb(
    route: ActivatedRouteSnapshot | null,
    parentUrl: string[],
    breadcrumbs: Map<string, string>,
  ) {
    if (route) {
      // Construct the route URL
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));

      // Add an element for the current route part
      if (route.data['breadcrumb']) {
        const breadcrumb = {
          label: this.getLabel(route.data),
          url: '/' + routeUrl.join('/'),
        };

        // Use map to avoid duplicates
        breadcrumbs.set(breadcrumb.label, breadcrumb.url);
      }

      // Add another element for the next route part
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data['breadcrumb'] === 'function' ? data['breadcrumb'](data) : data['breadcrumb'];
  }
}

@Component({
  selector: 'app-breadcrumb',
  imports: [HlmBreadCrumbImports],
  template: `
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink link="/">Home</a>
        </li>
        @if (_breadcrumbService.breadcrumbs().length) {
          <li hlmBreadcrumbSeparator>|</li>
        }

        @for (item of _breadcrumbService.breadcrumbs(); track item.label; let last = $last) {
          @if (last) {
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>{{ item.label }}</span>
            </li>
          } @else {
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink [link]="item.url">{{ item.label }}</a>
            </li>
            <li hlmBreadcrumbSeparator>|</li>
          }
        }
      </ol>
    </nav>
  `,
  styles: ``,
})
export class Breadcrumb {
  protected readonly _breadcrumbService = inject(BreadcrumbService);
}

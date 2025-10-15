import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { Project } from '../data/project.model';
import { BaseEntityList } from '../../../shared/base/base-entity-list';
import { ProjectsService } from '../data/internal/projects-service';
import { catchError, filter, noop, of, switchMap, take, tap } from 'rxjs';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ColumnDef, flexRenderComponent, FlexRenderDirective } from '@tanstack/angular-table';
import { TABLE_PAGINATION } from '../../../shared/constants/table.constants';
import {
  TableHeadSelection,
  TableRowSelection,
} from '../../../shared/ui/data-table/selection-column';
import { TableSortHeaderButton } from '../../../shared/ui/data-table/sort-header-button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { toast } from 'ngx-sonner';
import { ProjectAdd } from './project-add';
import { ProjectUpdate } from './project-update';
import { AlertDialogData } from '../../../shared/ui/alert-dialog/alert-dialog-data.model';
import { AlertDialog } from '../../../shared/ui/alert-dialog/alert-dialog';
import { DialogData } from '../../../shared/ui/dialog/dialog-data.model';
import { ActionDropdown } from '../../../shared/ui/data-table/action-dropdown';
import {
  lucideChevronDown,
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
  lucideColumns2,
  lucidePlus,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-project-list',
  imports: [
    FlexRenderDirective,
    FormsModule,
    BrnMenuImports,
    HlmMenuImports,
    HlmButtonImports,
    NgIcon,
    HlmIconImports,
    HlmInputImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmTableImports,
  ],
  providers: [
    provideIcons({
      lucideColumns2,
      lucideChevronDown,
      lucidePlus,
      lucideChevronsLeft,
      lucideChevronLeft,
      lucideChevronsRight,
      lucideChevronRight,
    }),
  ],
  template: `
    <div class="flex items-center justify-between px-4 lg:px-6 mt-4 lg:mt-6">
      <input
        hlmInput
        class="w-full md:w-80"
        placeholder="Filter projects..."
        (input)="_filterChanged($event, 'name')"
      />

      <div class="flex gap-2">
        <button hlmBtn variant="outline" size="sm" [brnMenuTriggerFor]="menu">
          <ng-icon hlm name="lucideColumns2" class="mr-2" size="sm" />
          Columns
          <ng-icon hlm name="lucideChevronDown" class="ml-2" size="sm" />
        </button>
        <ng-template #menu>
          <hlm-menu class="w-32">
            @for (column of hidableColumns; track column.id) {
              <button
                hlmMenuItemCheckbox
                class="capitalize"
                [checked]="column.getIsVisible()"
                (triggered)="column.toggleVisibility()"
              >
                <hlm-menu-item-check />
                {{ column.columnDef.id }}
              </button>
            }
          </hlm-menu>
        </ng-template>

        <button hlmBtn size="sm" variant="outline" (click)="addNew()">
          <ng-icon hlm name="lucidePlus" class="mr-2" size="sm" />
          Add New
        </button>
      </div>
    </div>

    <div
      class="flex-1 outline-none relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 mb-4 lg:mb-6"
    >
      <div class="overflow-hidden rounded-lg border">
        <table hlmTable class="w-full">
          <thead hlmTHead>
            @for (headerGroup of _table.getHeaderGroups(); track headerGroup.id) {
              <tr hlmTr>
                @for (header of headerGroup.headers; track header.id) {
                  <th hlmTh [attr.colSpan]="header.colSpan">
                    @if (!header.isPlaceholder) {
                      <ng-container
                        *flexRender="
                          header.column.columnDef.header;
                          props: header.getContext();
                          let headerText
                        "
                      >
                        <div [innerHTML]="headerText"></div>
                      </ng-container>
                    }
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody hlmTBody class="w-full">
            @for (row of _table.getRowModel().rows; track row.id) {
              <tr hlmTr [attr.key]="row.id" [attr.data-state]="row.getIsSelected() && 'selected'">
                @for (cell of row.getVisibleCells(); track $index) {
                  <td hlmTd>
                    <ng-container
                      *flexRender="
                        cell.column.columnDef.cell;
                        props: cell.getContext();
                        let cellCtx
                      "
                    >
                      <div [innerHTML]="cellCtx" [class.pl-3]="cell.column.getCanSort()"></div>
                    </ng-container>
                  </td>
                }
              </tr>
            } @empty {
              <tr hlmTr>
                <td hlmTd class="h-24 text-center" [attr.colspan]="columns.length">No results.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between px-4">
        @if (_table.getRowCount() > 0) {
          <span class="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {{ _table.getSelectedRowModel().rows.length }} of {{ _table.getRowCount() }}
            row(s) selected
          </span>

          <div class="flex w-full items-center gap-8 lg:w-fit">
            <div class="hidden items-center gap-2 lg:flex">
              <label hlmLabel>Rows per page</label>

              <brn-select
                class="inline-block"
                [ngModel]="_table.getState().pagination.pageSize"
                (ngModelChange)="_table.setPageSize($event); _table.resetPageIndex()"
              >
                <hlm-select-trigger class="h-8 mr-1 inline-flex" _size="sm">
                  <hlm-select-value />
                </hlm-select-trigger>
                <hlm-select-content>
                  @for (size of _availablePageSizes; track size) {
                    <hlm-option [value]="size">
                      {{ size === tableConstants.SHOW_ALL_SIZE ? 'All' : size }}
                    </hlm-option>
                  }
                </hlm-select-content>
              </brn-select>
            </div>

            <div class="flex w-fit items-center justify-center text-sm font-medium">
              Page {{ _table.getState().pagination.pageIndex + 1 }} of {{ _table.getPageCount() }}
            </div>

            <div class="ml-auto flex items-center gap-2 lg:ml-0">
              <button
                size="icon"
                variant="outline"
                class="w-8 h-8"
                hlmBtn
                [disabled]="!_table.getCanPreviousPage()"
                (click)="_table.setPageIndex(0)"
              >
                <ng-icon hlm name="lucideChevronsLeft" size="sm" />
              </button>

              <button
                size="icon"
                variant="outline"
                class="w-8 h-8"
                hlmBtn
                [disabled]="!_table.getCanPreviousPage()"
                (click)="_table.previousPage()"
              >
                <ng-icon hlm name="lucideChevronLeft" size="sm" />
              </button>

              <button
                size="icon"
                variant="outline"
                class="w-8 h-8"
                hlmBtn
                [disabled]="!_table.getCanNextPage()"
                (click)="_table.nextPage()"
              >
                <ng-icon hlm name="lucideChevronRight" size="sm" />
              </button>

              <button
                size="icon"
                variant="outline"
                class="w-8 h-8"
                hlmBtn
                [disabled]="!_table.getCanNextPage()"
                (click)="_table.setPageIndex(_table.getPageCount() - 1)"
              >
                <ng-icon hlm name="lucideChevronsRight" size="sm" />
              </button>
            </div>
          </div>
        } @else {
          <div class="flex h-full w-full items-center justify-center">
            <div class="text-muted-foreground text-sm">No Data</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
  host: {
    class: 'flex w-full h-full flex-col justify-start gap-6',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectList extends BaseEntityList<Project> {
  private readonly _projectsService = inject(ProjectsService);
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _queryClient = inject(QueryClient);

  protected readonly tableConstants = TABLE_PAGINATION;

  private readonly _productsQuery = injectQuery(() => ({
    queryKey: ['projects'],
    queryFn: () => this._projectsService.getAllProjects(),
    initialData: [],
    retry: 1,
    refetchOnWindowFocus: true,
  }));

  override get data(): Project[] {
    return this._productsQuery.data();
  }

  override columns: ColumnDef<Project>[] = [
    {
      id: 'select',
      header: () => flexRenderComponent(TableHeadSelection),
      cell: () => flexRenderComponent(TableRowSelection),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      id: 'name',
      header: () => flexRenderComponent(TableSortHeaderButton),
    },
    {
      accessorKey: 'description',
      id: 'description',
      header: () => flexRenderComponent(TableSortHeaderButton),
    },
    {
      id: 'action',
      enableHiding: false,
      cell: () =>
        flexRenderComponent(ActionDropdown, {
          outputs: {
            update: (project: Project) => this.updateProject(project),
            delete: (project: Project) => this.deleteProject(project),
          },
        }),
    },
  ];

  protected updateProject(data: Project): void {
    const context: DialogData<Project> = {
      title: 'Update Project',
      description: 'Update the project information as needed and save your changes.',
      icon: 'lucideShoppingBag',
      data,
    };

    const dialogRef = this._hlmDialogService.open(ProjectUpdate, {
      context,
    //   contentClass: 'sm:!max-w-[750px] w-72',
    });

    dialogRef.closed$.pipe(filter(Boolean), take(1)).subscribe(noop);
  }

  protected addNew(): void {
    const context: DialogData<Project | null> = {
      title: 'Add Project',
      description: 'Fill in the project details below to create a new entry.',
      icon: 'lucideShoppingBag',
      data: null,
    };

    const dialogRef = this._hlmDialogService.open(ProjectAdd, {
      context,
    //   contentClass: 'sm:!max-w-[750px] w-72',
    });

    dialogRef.closed$.pipe(filter(Boolean), take(1)).subscribe(noop);
  }

  protected deleteProject(data: Project): void {
    const context: AlertDialogData = {
      title: 'Are you absolutely sure?',
      description: `This action cannot be undone. This will permanently delete project: "${data.name}".`,
      proceedButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    };

    const dialogRef = this._hlmDialogService.open(AlertDialog, {
      context,
      contentClass: 'sm:!max-w-[450px] w-72',
    });

    dialogRef.closed$
      .pipe(
        filter(Boolean),
        switchMap(() => this._projectsService.deleteProject(data.id)),
        tap(() => this._queryClient.invalidateQueries({ queryKey: ['projects'] })),
        catchError(() => {
          toast.error('Failed to delete project');
          return of(null);
        }),
        filter(Boolean),
        take(1),
      )
      .subscribe({
        next: () => {
          toast.success('Project has been deleted');
        },
      });
  }
}

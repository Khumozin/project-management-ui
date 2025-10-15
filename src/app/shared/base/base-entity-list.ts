import { Directive, signal } from '@angular/core';
import {
    ColumnDef,
    ColumnFiltersState,
    createAngularTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
} from '@tanstack/angular-table';
import { TABLE_PAGINATION } from '../constants/table.constants';

/**
 * Base directive for entity list components with table functionality.
 * Provides common table features including sorting, filtering, and pagination.
 *
 * @template T - The type of entity to display in the list
 *
 * @example
 * ```typescript
 * export class ProjectList extends BaseEntityList<Project> {
 *   override columns: ColumnDef<Project>[] = [
 *     { accessorKey: 'name', header: 'Name' }
 *   ];
 *
 *   override get data(): Project[] {
 *     return this.projectsQuery.data();
 *   }
 * }
 * ```
 */
@Directive()
export abstract class BaseEntityList<T> {

  /** Signal for managing table sorting state */
  protected readonly _sorting = signal<SortingState>([]);

  /** Signal for managing table pagination state */
  protected readonly _pagination = signal<PaginationState>({
    pageSize: TABLE_PAGINATION.DEFAULT_PAGE_SIZE,
    pageIndex: 0,
  });

  /** Signal for managing column filter state */
  protected readonly _columnFilters = signal<ColumnFiltersState>([]);

  /**
   * Column definitions for the table.
   * Must be implemented by the extending class.
   */
  abstract readonly columns: ColumnDef<T>[];

  protected readonly _table = createAngularTable<T>(() => ({
    data: this.data,
    columns: this.columns,
    state: {
      columnFilters: this._columnFilters(),
      sorting: this._sorting(),
      pagination: this._pagination(),
    },
    onColumnFiltersChange: (updater) => {
      updater instanceof Function
        ? this._columnFilters.update(updater)
        : this._columnFilters.set(updater);
    },
    onSortingChange: (updater) => {
      updater instanceof Function
        ? this._sorting.update(updater)
        : this._sorting.set(updater);
    },
    onPaginationChange: (updater) => {
      updater instanceof Function
        ? this._pagination.update(updater)
        : this._pagination.set(updater);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: TABLE_PAGINATION.DEFAULT_PAGE_SIZE,
      },
    },
  }));

  /** Available page size options for the table pagination */
  protected readonly _availablePageSizes = TABLE_PAGINATION.AVAILABLE_PAGE_SIZES;

  /**
   * Handles filter input changes for a specific column.
   *
   * @param event - The input event containing the filter value
   * @param columnKey - The key of the column to filter
   */
  protected _filterChanged(event: Event, columnKey: string): void {
    this._table
      .getColumn(columnKey)
      ?.setFilterValue((event.target as HTMLInputElement).value);
  }

  /**
   * Gets all columns that can be hidden by the user.
   *
   * @returns An array of columns that support hiding
   */
  protected get hidableColumns() {
    return this._table.getAllColumns().filter((c) => c.getCanHide());
  }

  /**
   * Gets the underlying TanStack table instance.
   *
   * @returns The table instance
   */
  get tableInstance() {
    return this._table;
  }

  /**
   * Gets the data to display in the table.
   * Should be overridden by the extending class to provide actual data.
   *
   * @returns An array of entities to display
   */
  get data(): T[] {
    return [];
  }

}

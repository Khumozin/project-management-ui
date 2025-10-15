import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ColumnDef } from '@tanstack/angular-table';
import { BaseEntityList } from './base-entity-list';

interface TestEntity {
  id: string;
  name: string;
  value: number;
}

@Component({
  template: '',
  standalone: true
})
class TestEntityListComponent extends BaseEntityList<TestEntity> {
  private testData: TestEntity[] = [
    { id: '1', name: 'Entity 1', value: 100 },
    { id: '2', name: 'Entity 2', value: 200 },
    { id: '3', name: 'Entity 3', value: 300 }
  ];

  override columns: ColumnDef<TestEntity>[] = [
    {
      accessorKey: 'id',
      id: 'id',
      header: 'ID',
      enableHiding: false
    },
    {
      accessorKey: 'name',
      id: 'name',
      header: 'Name',
      enableHiding: true
    },
    {
      accessorKey: 'value',
      id: 'value',
      header: 'Value',
      enableHiding: true,
      enableSorting: true
    }
  ];

  override get data(): TestEntity[] {
    return this.testData;
  }

  setTestData(data: TestEntity[]): void {
    this.testData = data;
  }
}

describe('BaseEntityList', () => {
  let component: TestEntityListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestEntityListComponent],
      providers: [provideZonelessChangeDetection()]
    });

    const fixture = TestBed.createComponent(TestEntityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table initialization', () => {
    it('should initialize table with data', () => {
      expect(component.tableInstance).toBeTruthy();
      expect(component.data.length).toBe(3);
    });

    it('should initialize with default pagination state', () => {
      const paginationState = component.tableInstance.getState().pagination;
      expect(paginationState.pageIndex).toBe(0);
      expect(paginationState.pageSize).toBe(5);
    });

    it('should initialize with empty sorting state', () => {
      const sortingState = component.tableInstance.getState().sorting;
      expect(sortingState).toEqual([]);
    });

    it('should initialize with empty column filters', () => {
      const columnFiltersState = component.tableInstance.getState().columnFilters;
      expect(columnFiltersState).toEqual([]);
    });
  });

  describe('filtering', () => {
    it('should filter data by column', () => {
      const event = {
        target: { value: 'Entity 1' }
      } as any;

      component['_filterChanged'](event, 'name');

      const filteredRows = component.tableInstance.getFilteredRowModel().rows;
      expect(filteredRows.length).toBe(1);
      expect(filteredRows[0].original.name).toBe('Entity 1');
    });

    it('should filter case-insensitively', () => {
      const event = {
        target: { value: 'entity 2' }
      } as any;

      component['_filterChanged'](event, 'name');

      const filteredRows = component.tableInstance.getFilteredRowModel().rows;
      expect(filteredRows.length).toBe(1);
      expect(filteredRows[0].original.name).toBe('Entity 2');
    });

    it('should update filter when input value changes', () => {
      const event1 = {
        target: { value: 'Entity' }
      } as any;

      component['_filterChanged'](event1, 'name');
      expect(component.tableInstance.getFilteredRowModel().rows.length).toBe(3);

      const event2 = {
        target: { value: 'Entity 1' }
      } as any;

      component['_filterChanged'](event2, 'name');
      expect(component.tableInstance.getFilteredRowModel().rows.length).toBe(1);
    });

    it('should clear filter when input is empty', () => {
      const event1 = {
        target: { value: 'Entity 1' }
      } as any;

      component['_filterChanged'](event1, 'name');
      expect(component.tableInstance.getFilteredRowModel().rows.length).toBe(1);

      const event2 = {
        target: { value: '' }
      } as any;

      component['_filterChanged'](event2, 'name');
      expect(component.tableInstance.getFilteredRowModel().rows.length).toBe(3);
    });
  });

  describe('sorting', () => {
    it('should support sorting', () => {
      const valueColumn = component.tableInstance.getColumn('value');
      expect(valueColumn?.getCanSort()).toBe(true);
    });

    it('should update sorting state when column is sorted', () => {
      const valueColumn = component.tableInstance.getColumn('value');
      valueColumn?.toggleSorting(false);

      const sortingState = component.tableInstance.getState().sorting;
      expect(sortingState.length).toBe(1);
      expect(sortingState[0].id).toBe('value');
      expect(sortingState[0].desc).toBe(false);
    });

    it('should sort in descending order when toggled', () => {
      const valueColumn = component.tableInstance.getColumn('value');
      valueColumn?.toggleSorting(true);

      const sortingState = component.tableInstance.getState().sorting;
      expect(sortingState[0].desc).toBe(true);
    });
  });

  describe('pagination', () => {
    it('should navigate to next page', () => {
      component.tableInstance.setPageSize(2);
      expect(component.tableInstance.getState().pagination.pageIndex).toBe(0);

      component.tableInstance.nextPage();
      expect(component.tableInstance.getState().pagination.pageIndex).toBe(1);
    });

    it('should navigate to previous page', () => {
      component.tableInstance.setPageSize(2);
      component.tableInstance.setPageIndex(1);

      component.tableInstance.previousPage();
      expect(component.tableInstance.getState().pagination.pageIndex).toBe(0);
    });

    it('should update page size', () => {
      component.tableInstance.setPageSize(5);
      expect(component.tableInstance.getState().pagination.pageSize).toBe(5);
    });

    it('should reset page index when page size changes', () => {
      component.tableInstance.setPageSize(2);
      component.tableInstance.setPageIndex(1);

      component.tableInstance.setPageSize(5);
      component.tableInstance.resetPageIndex();
      expect(component.tableInstance.getState().pagination.pageIndex).toBe(0);
    });

    it('should get correct page count', () => {
      component.tableInstance.setPageSize(2);
      expect(component.tableInstance.getPageCount()).toBe(2);
    });

    it('should check if can go to next page', () => {
      component.tableInstance.setPageSize(2);
      expect(component.tableInstance.getCanNextPage()).toBe(true);

      component.tableInstance.setPageIndex(1);
      expect(component.tableInstance.getCanNextPage()).toBe(false);
    });

    it('should check if can go to previous page', () => {
      component.tableInstance.setPageSize(2);
      expect(component.tableInstance.getCanPreviousPage()).toBe(false);

      component.tableInstance.setPageIndex(1);
      expect(component.tableInstance.getCanPreviousPage()).toBe(true);
    });
  });

  describe('column visibility', () => {
    it('should get hidable columns', () => {
      const hidableColumns = component['hidableColumns'];
      expect(hidableColumns.length).toBe(2);
      expect(hidableColumns.some(c => c.id === 'name')).toBe(true);
      expect(hidableColumns.some(c => c.id === 'value')).toBe(true);
    });

    it('should exclude non-hidable columns', () => {
      const hidableColumns = component['hidableColumns'];
      expect(hidableColumns.some(c => c.id === 'id')).toBe(false);
    });

    it('should support column visibility state', () => {
      // Verify that column visibility state is managed
      const visibilityState = component.tableInstance.getState().columnVisibility;
      expect(visibilityState).toBeDefined();
      expect(typeof visibilityState).toBe('object');
    });
  });

  describe('table instance', () => {
    it('should expose table instance', () => {
      const tableInstance = component.tableInstance;
      expect(tableInstance).toBeTruthy();
      expect(tableInstance.getRowModel).toBeDefined();
    });

    it('should get row count', () => {
      expect(component.tableInstance.getRowCount()).toBe(3);
    });

    it('should get filtered row model', () => {
      const rowModel = component.tableInstance.getFilteredRowModel();
      expect(rowModel.rows.length).toBe(3);
    });

    it('should get pagination row model', () => {
      component.tableInstance.setPageSize(2);
      const rowModel = component.tableInstance.getPaginationRowModel();
      expect(rowModel.rows.length).toBe(2);
    });
  });

  describe('data updates', () => {
    it('should update table when data changes', () => {
      const newData: TestEntity[] = [
        { id: '4', name: 'Entity 4', value: 400 }
      ];

      component.setTestData(newData);
      expect(component.data.length).toBe(1);
      expect(component.data[0].name).toBe('Entity 4');
    });

    it('should reflect new row count after data update', () => {
      const newData: TestEntity[] = [
        { id: '4', name: 'Entity 4', value: 400 },
        { id: '5', name: 'Entity 5', value: 500 }
      ];

      component.setTestData(newData);
      expect(component.tableInstance.getRowCount()).toBe(2);
    });
  });
});

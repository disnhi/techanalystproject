import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface DataTableItem {
  channel: string;
  region: string;
  branchCode: string;
  branchManager: string;
  financialAdvisor: string; 
  faElid: string;
  teamPart: string;
  faOwnedRepCode: string; 
  repCodeOwnership: number;
  repCodeType: string;

}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: DataTableItem[] = [
  {channel: 'PCG', region: 'Mid-Atlantic', branchCode: 'SC', branchManager: 'Felix Hightower', financialAdvisor: 'Sam Champion', faElid: 'U111111', teamPart: 'Y', faOwnedRepCode: ' SC15', repCodeOwnership: 100, repCodeType: 'Primary'},
  {channel: 'PCG', region: 'Mid-Atlantic', branchCode: 'SC', branchManager: 'Felix Hightower', financialAdvisor: 'Sam Champion', faElid: 'U111111', teamPart: 'Y', faOwnedRepCode: ' SC16', repCodeOwnership: 10, repCodeType: 'Split'},
  {channel: 'PCG', region: 'Mid-Atlantic', branchCode: 'SC', branchManager: 'Felix Hightower', financialAdvisor: 'Sam Champion', faElid: 'U111111', teamPart: 'Y', faOwnedRepCode: ' SC25', repCodeOwnership: 33, repCodeType: 'Other'},
];

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DataTableDataSource extends DataSource<DataTableItem> {
  data: DataTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DataTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DataTableItem[]): DataTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DataTableItem[]): DataTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'channel': return compare(a.channel, b.channel, isAsc);
        case 'region': return compare(a.region, b.region, isAsc);
        case 'branchCode': return compare(a.branchCode, b.branchCode, isAsc);
        case 'branchManager': return compare(a.branchManager, b.branchManager, isAsc);
        case 'financialAdvisor': return compare(a.financialAdvisor, b.financialAdvisor, isAsc)
        case 'faElid': return compare(a.faElid, b.faElid, isAsc)
        case 'teamPart': return compare(a.teamPart, b.teamPart, isAsc)
        case 'faOwnedRepCode': return compare (a.faOwnedRepCode, b.faOwnedRepCode, isAsc)
        case 'repCodeOwnership': return compare(+a.repCodeOwnership, +b.repCodeOwnership, isAsc)
        case 'repCodeType': return compare(a.repCodeType, b.repCodeType, isAsc)
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/channel columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

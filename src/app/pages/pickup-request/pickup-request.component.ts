import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { FlexModule } from '@ngbracket/ngx-layout';
import { StringFormatPipe } from '../../helper/string-helper';
import { CommonModule, NgFor } from '@angular/common';
import { DateToMonthPipe } from '../../helper/date-helper';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RecyclingFacilityHistory } from '../../models/recycling-facility';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RecyclingService } from '../../services/recycling/recycling.service';
import { MarkPickUpComponent } from './dialogs/mark-pick-up/mark-pick-up.component';

@Component({
  selector: 'app-pickup-request',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    FlexModule,
    MatButtonModule,
    StringFormatPipe,
    DateToMonthPipe,
    NgFor,
    CommonModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  templateUrl: './pickup-request.component.html',
  styleUrl: './pickup-request.component.scss'
})
export class PickupRequestComponent implements OnInit {
  public data: RecyclingFacilityHistory[] = [];
  public facilityHistoryCols: string[] = ['facility_name', 'requested_bottles', 'actual_bottles', 'requested_date', 'status'];
  public facilityHistoryDataSource: RecyclingFacilityHistory[] = [];
  inactiveRequests: RecyclingFacilityHistory[] = [];
  activeRequests: RecyclingFacilityHistory[] = [];
  pagedData: RecyclingFacilityHistory[] = [];
  public pageSize = 1;
  public currentPage = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private dialog: MatDialog,
    private recyclingService: RecyclingService
  ) {

  }
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.recyclingService.getRequest().then(data => {
      this.data = data;
      this.inactiveRequests = this.data.filter(val => !val.status);
      this.activeRequests = this.data.filter(val => val.status);
      this.setPagedData();
    });
  }

  setPagedData() {
    const filteredData = this.inactiveRequests;
  
    // Reset currentPage if it exceeds last page
    const maxPage = Math.floor((filteredData.length - 1) / this.pageSize);
    if (this.currentPage > maxPage) {
      this.currentPage = maxPage >= 0 ? maxPage : 0;
    }
  
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedData = filteredData.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPagedData();
  }

  get inactiveRequestsLength(): number {
    return this.data.filter(val => !val.status).length;
  }

  markAsPickedUp(item: RecyclingFacilityHistory) {
    const dialogRef = this.dialog.open(MarkPickUpComponent, { width: '400px', data: item });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.data.findIndex(f => f.id === result.id);
        if (index !== -1) {
          this.data[index] = result;
  
          // Recompute filtered arrays
          this.inactiveRequests = this.data.filter(val => !val.status);
          this.activeRequests = this.data.filter(val => val.status);
  
          // Refresh pagedData, resetting page if needed
          this.setPagedData();
        }
      }
    });
  }
}

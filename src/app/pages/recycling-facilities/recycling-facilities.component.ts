import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { FlexModule } from '@ngbracket/ngx-layout';
import { StringFormatPipe } from '../../helper/string-helper';
import { CommonModule, NgFor } from '@angular/common';
import { DateToMonthPipe } from '../../helper/date-helper';
import { MatButtonModule } from '@angular/material/button';
import { RecyclingFacilityHistory, RecyclingFacilityInfo } from '../../models/recycling-facility';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';
import { HistoryDialogComponent } from './dialogs/history-dialog/history-dialog.component';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-recycling-facilities',
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
    MatDialogModule
  ],
  templateUrl: './recycling-facilities.component.html',
  styleUrl: './recycling-facilities.component.scss'
})
export class RecyclingFacilitiesComponent implements OnInit {
  public facilityInfoCols: string[] = ['facility_name', 'phone_number', 'status', 'total_bottles_collected'];
  public facilityInfoColsFinal: string[] = [...this.facilityInfoCols, 'actions'];
  public facilityHistoryCols: string[] = ['facility_name', 'requested_bottles', 'actual_bottles', 'requested_date', 'status'];
  public facilityInfoDataSource: RecyclingFacilityInfo[] = [];
  public facilityHistoryDataSource: RecyclingFacilityHistory[] = [];

  public constructor(
    private dialog: MatDialog,
    private adminService: AdminService
  ) {

  }
  ngOnInit(): void {
    this.getData();
  }

  public async getData() {
    try {
      const recyclers = await this.adminService.getRecyclers();
      this.facilityInfoDataSource = recyclers; // assign to table data source
    } catch (error) {
      console.error('Failed to load recyclers:', error);
    }

    try {
      const request = await this.adminService.getRequest();
      this.facilityHistoryDataSource = request; // assign to table data source
    } catch (error) {
      console.error('Failed to load recyclers:', error);
    }
  }


  onAddRecycling(): void {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '400px',
      data: null, // no data for adding
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.facilityInfoDataSource = [
          ...this.facilityInfoDataSource, // existing rows
          result                                // new row
        ];      
      }
    });
  }

  onRequestPickup(): void {
    const activeFacilities = this.facilityInfoDataSource.filter(f => f.status);

    const dialogRef = this.dialog.open(HistoryDialogComponent, {
      width: '400px',
      data: activeFacilities, // no data for adding
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle new record add here
        this.facilityHistoryDataSource = [
          ...this.facilityHistoryDataSource,
          result
        ];
      }
    });
  }

  onEdit(element: RecyclingFacilityInfo) {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '400px',
      data: element,
    });

    dialogRef.afterClosed().subscribe((result: RecyclingFacilityInfo | undefined) => {
      if (result) {
        // update table data
        const index = this.facilityInfoDataSource.findIndex(f => f.uid === result.uid);
        this.facilityInfoDataSource[index] = result;
        this.facilityInfoDataSource = [...this.facilityInfoDataSource];
      }
    });
  }
}

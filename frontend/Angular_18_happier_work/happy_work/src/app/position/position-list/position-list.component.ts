import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PositionService } from '../position.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreatePositionComponent } from '../create-position/create-position.component';

export interface EmployeePosition {
  designation: string;
  department: string;
  budget: string;
  location: string;
  updatedBy: string;
  lastUpdated: string;
}
// const ELEMENT_DATA: EmployeePosition[] = [
//   {
//     designation: 'HR',
//     department: 'Others',
//     budget: '₹ 8L',
//     location: 'Ahmedabad',
//     updatedBy: 'Ankush Mehta',
//     lastUpdated: 'Sep 6, 2022, 7:05pm',
//   },
//   {
//     designation: 'UI designer',
//     department: 'Product',
//     budget: '₹ 10L',
//     location: 'Ahmedabad',
//     updatedBy: 'Ankush Mehta',
//     lastUpdated: 'Sep 6, 2022, 7:05pm',
//   },
//   {
//     designation: 'Architect',
//     department: 'Engineering',
//     budget: '₹ 8L',
//     location: 'Ahmedabad',
//     updatedBy: 'Ankush Mehta',
//     lastUpdated: 'Sep 6, 2022, 7:05pm',
//   },
//   {
//     designation: 'Programmer Analyst',
//     department: 'Engineering',
//     budget: '₹ 10L',
//     location: 'Ahmedabad',
//     updatedBy: 'Rhea Kapoor',
//     lastUpdated: 'Sep 6, 2022, 7:05pm',
//   },
//   {
//     designation: 'Chief Legal Officer',
//     department: 'Others',
//     budget: '₹ 26L',
//     location: 'Ahmedabad',
//     updatedBy: 'Ankush Mehta',
//     lastUpdated: 'Sep 6, 2022, 7:05pm',
//   },
//   {
//     designation: 'Vice President',
//     department: 'Product',
//     budget: '₹ 35L',
//     location: 'Ahmedabad',
//     updatedBy: 'Rhea Kapoor',
//     lastUpdated: 'Sep 6, 2022, 7:05pm',
//   },
//   {
//     designation: 'Chief Marketing Officer',
//     department: 'Product',
//     budget: '₹ 21L',
//     location: 'Ahmedabad',
//     updatedBy: 'Ankush Mehta',
//     lastUpdated: 'Sep 6, 2022, 7:05pm',
//   },
//   {
//     designation: 'Program Manager',
//     department: 'Product',
//     budget: '₹ 18L',
//     location: 'India',
//     updatedBy: 'Rhea Kapoor',
//     lastUpdated: 'Sep 6, 2022, 7:05pm',
//   },
// ];



@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrl: './position-list.component.scss',
  standalone: false,
})
export class PositionListComponent {
  positionData: any[] = []
  displayedColumns: string[] = [
    'designation',
    'department',
    'budget',
    'location',
    'updatedBy',
    'lastUpdated',
    'actions',
  ];
  dataSource = new MatTableDataSource(this.positionData);
  filteredData = this.positionData;
  searchValue = '';
  selectedDesignation = '';
  designations = [
    'HR',
    'UI designer',
    'Architect',
    'Programmer Analyst',
    'Chief Legal Officer',
    'Vice President',
    'Chief Marketing Officer',
    'Program Manager',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  readonly dialog = inject(MatDialog);
  constructor(
    private positionService: PositionService,
    private activatedRoute: ActivatedRoute,
    ) {

    // Register the custom plugin to add center text

    this.getAllPositions();
  }
  getAllPositions() {
    const paramsId = this.activatedRoute.snapshot.queryParams['id'];
    this.positionService.getAllPositionByProjectId(paramsId).subscribe((res) => {
      this.positionData = res;
      this.dataSource = new MatTableDataSource(this.positionData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
   // Filter logic
   applyFilters(): void {
    // this.filteredData = this.dataSource.filter((employee) => {
    //   const matchesSearch =
    //     !this.searchValue ||
    //     employee.designation
    //       .toLowerCase()
    //       .includes(this.searchValue.toLowerCase());
    //   const matchesDesignation =
    //     !this.selectedDesignation ||
    //     employee.designation === this.selectedDesignation;

    //   return matchesSearch && matchesDesignation;
    // });
  }

  clearFilters(): void {
  }
  // Clear the search input
  clearSearch(): void {
    this.searchValue = '';
    this.applyFilters();
  }

  // Filter by designation
  filterByDesignation() {
    // this.filteredData = this.selectedDesignation
    //   ? this.dataSource.filter(
    //       (item) => item.designation === this.selectedDesignation
    //     )
    //   : this.dataSource;
  }

  
  openAddPosition(): void {
    const projectId = this.activatedRoute.snapshot.queryParams['id'];
    const dialogRef = this.dialog.open(CreatePositionComponent, {
      data: {project_id: projectId},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllPositions();
      }
    });
  }
  
  deletePosition(id: string): void {
    this.positionService.deletePosition(id).subscribe((response) => {
      if (response) {
        this.getAllPositions();
      }
    })
   }
  
  
}

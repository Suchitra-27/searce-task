import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';

import { PositionService } from '../position.service';
import { CreatePositionComponent } from '../create-position/create-position.component';

export interface EmployeePosition {
  designation: string;
  department: string;
  budget: string;
  location: string;
  updatedBy: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.scss'],
  standalone: false,
})
export class PositionListComponent implements OnInit {
  positionData: EmployeePosition[] = [];
  displayedColumns: string[] = [
    'designation',
    'department',
    'budget',
    'location',
    'updatedBy',
    'lastUpdated',
    'actions',
  ];
  dataSource = new MatTableDataSource<EmployeePosition>(this.positionData);
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

  chartData = [
    { label: 'Engineering', percentage: 30, color: '#FF6384' },
    { label: 'Product', percentage: 20, color: '#36A2EB' },
    { label: 'Sales', percentage: 30, color: '#FFCE56' },
    { label: 'Others', percentage: 10, color: '#4BC0C0' },
  ];
  totalBudget = '₹ 2 Cr';
  usedBudget = '₹ 1.5 Cr';
  remainingBudget = '₹ 50 L';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly dialog = inject(MatDialog);

  constructor(
    private positionService: PositionService,
    private activatedRoute: ActivatedRoute
  ) {
    Chart.register(ArcElement, Tooltip, Legend, DoughnutController);
  }

  ngOnInit(): void {
    this.getAllPositions();
    this.loadBudgetChart();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllPositions(): void {
    const paramsId = this.activatedRoute.snapshot.queryParams['id'];
    this.positionService.getAllPositionByProjectId(paramsId).subscribe((res) => {
      this.positionData = res;
      this.dataSource = new MatTableDataSource(this.positionData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // Apply filters for the table
  applyFilters(): void {
    this.dataSource.filter = this.searchValue.trim().toLowerCase();
    if (this.selectedDesignation) {
      this.dataSource.data = this.positionData.filter(
        (item) => item.designation === this.selectedDesignation
      );
    } else {
      this.dataSource.data = this.positionData;
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.applyFilters();
  }

  filterByDesignation(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchValue = '';
    this.selectedDesignation = '';
    this.applyFilters();
  }

  openAddPosition(): void {
    const projectId = this.activatedRoute.snapshot.queryParams['id'];
    const dialogRef = this.dialog.open(CreatePositionComponent, {
      data: { project_id: projectId },
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
    });
  }

  // Load budget chart
  // loadBudgetChart(): void {
  //   const data = this.chartData.map((item) => item.percentage);
  //   const labels = this.chartData.map((item) => item.label);
  //   const colors = this.chartData.map((item) => item.color);

  //   new Chart('budgetChart', {
  //     type: 'doughnut',
  //     data: {
  //       labels,
  //       datasets: [
  //         {
  //           data,
  //           backgroundColor: colors,
  //           borderWidth: 1,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: { display: false },
  //       },
  //     },
  //   });
  // }

  loadBudgetChart(): void {
    if (!this.chartData || this.chartData.length === 0) {
      console.warn('No chart data to display');
      return;
    }

    const ctx = document.getElementById('budgetChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut', // Specify the chart type
        data: {
          labels: this.chartData.map((item) => item.label),
          datasets: [
            {
              data: this.chartData.map((item) => item.percentage),
              backgroundColor: this.chartData.map((item) => item.color),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: 'top' },
          },
        },
      });
    } else {
      console.error('Chart canvas not found');
    }
  }
}

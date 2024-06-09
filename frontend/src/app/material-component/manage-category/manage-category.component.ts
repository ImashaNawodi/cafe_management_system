import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'edit'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(); // Initialize the dataSource

  responseMessage: any;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tableData();
    this.dataSource.filterPredicate = (data, filter) => {
      const dataStr = data.name.trim().toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
  }

  tableData() {
    this.categoryService.getCategorys().subscribe(
      (response: any) => {
        this.dataSource.data = response; // Update data in MatTableDataSource
      },
      (error: any) => {
        this.responseMessage = error.error?.message || GlobalConstant.genericError;
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstant.error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.tableData();
    });

    dialogRef.componentInstance.onAddCategory.subscribe(() => {
      this.tableData();
    });
  }

  handleEditAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: value
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.tableData();
    });

    dialogRef.componentInstance.onEditCategory.subscribe(() => {
      this.tableData();
    });
  }
}

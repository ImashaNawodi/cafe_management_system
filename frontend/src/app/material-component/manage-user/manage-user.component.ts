import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstant } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'email',
    'contactNumber',
    'action' // Add action column if you have actions like edit or delete
  ];
  dataSource = new MatTableDataSource([]); // Initialize as MatTableDataSource
  responseMessage: any;

  constructor(
    private userService: UserService,
    private snackbarService: SnackbarService
  ) {}
  
  ngOnInit(): void {
    this.tableData();
  }

  tableData() {
    this.userService.getUsers().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleChangeAction(status: boolean, id: string) {
    const data = {
      status: status.toString(),
      id: id
    };

    this.userService.update(data).subscribe(
      (response: any) => {
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
        this.tableData(); // Refresh the table data after update
      },
      (error: any) => {
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }
}

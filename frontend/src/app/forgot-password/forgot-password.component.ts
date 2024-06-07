import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstant } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
forgotPasswordForm :any =FormGroup;
responseMessage :any;
  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    private dialogRef :MatDialogRef<ForgotPasswordComponent>,
    private snackbarService:SnackbarService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm =this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]]
    })
  }

  handleSubmit() {
    const formData = this.forgotPasswordForm.value;
    const data = {
      email: formData.email
    };
  
    this.userService.forgotPassword(data).subscribe(
      (response: any) => {
        this.responseMessage = response?.message;
        this.dialogRef.close();
        this.snackbarService.openSnackBar(this.responseMessage, "");
      },
      (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstant.error);
      }
    );
  }
  

}

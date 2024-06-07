import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstant } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm :any =FormGroup;
  responseMessage :any;
  router: any;
    constructor(private formBuilder:FormBuilder,
      private userService:UserService,
      private dialogRef :MatDialogRef<LoginComponent>,
      private snackbarService:SnackbarService
    ) { }
  
    ngOnInit(): void {
      this.loginForm =this.formBuilder.group({
        email:[null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]],
        password:[null,[Validators.required]]
      })
    }
  
    handleSubmit() {
      const formData = this.loginForm.value;
      const data = {
        email: formData.email,
        password :formData.password
      };
    
      this.userService.login(data).subscribe(
        (response: any) => {
          this.responseMessage = response?.message;
          this.dialogRef.close();
          localStorage.setItem('token',response.token);
          this.router.navigate(['/cafe/dashboard'])
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

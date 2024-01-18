import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {TokenStorageService} from "../../service/token-storage.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../service/notification.service";
import {MaterialModule} from "../../material-module";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    MaterialModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public loginForm!: FormGroup;

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private notificationService:NotificationService,
              private router: Router,
              private fb: FormBuilder) {
    if(this.tokenStorage.getUser()){
      this.router.navigate(['main']);
    }
  }

  ngOnInit(): void {
      this.loginForm=this.createLoginForm();
  }
  createLoginForm(): FormGroup{
    return this.fb.group({
      username:['',Validators.compose([Validators.required])],
      password:['',Validators.compose([Validators.required])],
    })
  }

  submit():void{
    this.authService.login({
      user:{
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      }
    }).subscribe(data => {
      console.log(data);

      this.tokenStorage.saveUser(data.token);
      this.tokenStorage.saveToken(data);

      this.notificationService.showSnackBar('Successfully logged in ');
      this.router.navigate(['/']);
      window.location.reload();
    },error => {
      console.log(error);
      this.notificationService.showSnackBar(error.message);
    });
  }

}

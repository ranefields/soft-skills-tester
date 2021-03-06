import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  private userId: string;
  private token: string;
  constructor(
    public auth: AuthService,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['uid'];
      this.token = params['prt'];
    });
  }

  public submitNew(newPassword) {
    this.auth.makeNewPass(newPassword.value, this.userId, this.token).subscribe((data) => {
      this.router.navigateByUrl('/');
    });
  }

  public resend() {
    this.auth.resendPassReset(this.userId).subscribe((data) => {
    });
  }
}

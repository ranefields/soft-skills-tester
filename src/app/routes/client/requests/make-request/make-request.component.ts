import { Component, OnInit } from '@angular/core';
import { ClientService } from './../../client.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'requests',
  templateUrl: './make-request.component.html',
  styleUrls: ['./make-request.component.scss']
})

export class MakeRequestComponent implements OnInit {
  public softSkills: Observable<any>;
  public toggle: boolean = false;
  public weekFromNow: string;
  public myControl: FormControl = new FormControl();
  public filteredOptions: Observable<string[]>;
  public tempOptions: string[];
  constructor(
    public service: ClientService,
    public router: Router
  ) {
    let date = new Date()
    let month = this.padMonth(date);
    this.weekFromNow = (`${date.getFullYear()}-${month}-${date.getDate() + 7}`);
  }

  ngOnInit() {
    this.softSkills = this.service.getSkills();
    this.softSkills.subscribe(data => {
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val, data))
      );
    })
  }

  private filter(val: string, data): string[] {
    return data.skillArray.filter(option =>
    option.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  private padMonth(date) {
    let current = (date.getMonth() + 1).toString();
    if(current.length < 2) {
      let newMonth = "0" + current;
      return newMonth;
    } else {
      return current;
    }
  }

  public switchToggle() {
    this.toggle = !this.toggle
  }

  public submitRequest(form) {
    let nameArray = new Array<any>();
    let request = {
      nameArray: nameArray,
      details: null,
      expiration: null,
      jobTitle: null,
    }
    let details;
    Object.keys(form.value).forEach(function(key) {
      if(form.value[key]) {
        if(key === "details") {
          request.details = form.value[key];
        } else if(key === "expiration") {
          request.expiration = form.value[key];
        } else if(key === "job-title") {
          request.jobTitle = form.value[key];
        } else {
          nameArray.push(key);
        }
      }
    });
    this.service.makeRequest(request).subscribe((data) => {
      console.log(data);
      this.router.navigateByUrl('/');
    })
  }
}

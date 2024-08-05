import { Component, OnInit} from '@angular/core';
import { penTestData } from 'src/app/core/data/penTestData';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pen-test',
  templateUrl: './pen-test.component.html',
  styleUrls: ['./pen-test.component.css']
})
export class PenTestComponent implements OnInit {
  dataToUse = penTestData;
  isAppCreated = 'no';
  breadCrumbItems: Array<{}>;
  appName='';
  appUrl='';
  testLevel='';
  logo='';
  constructor(private router: Router) { }
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Projects Grid', active: true }];
    this.onNewAppCreated();
  }
  navigate(type?: string) {
    if(type && type == 'new'){
      this.router.navigate(['/pen-test-executor/app']);
    } else {
      this.router.navigate(['/pen-test-executor/att']);
    }
  }

  onNewAppCreated(){
    if(localStorage.getItem('isAppCreated') && localStorage.getItem('isAppCreated') === 'yes'){
      this.isAppCreated = 'yes';
      this.appName = localStorage.getItem('appname');
      this.appUrl = localStorage.getItem('appurl');
      this.testLevel = localStorage.getItem('testlevel');
      this.logo = this.logoMaker(this.appName);
    }
  }
  logoMaker(input: string): string {
    return input
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }
  disableLink(event: Event) {
    event.preventDefault(); 
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootReducerState } from 'src/app/store';
import { selectData } from 'src/app/store/filemanager/filemanager-selector';
import { fetchRecentFilesData } from 'src/app/store/filemanager/filemanager.actions';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2000ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('500ms', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ transform: 'translateY(-100%)' })),
      ]),
    ])
  ]
})
export class ChatComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  dismissible = true;


  isScanning = false;
progress = 0;
progressMessage = '';

showPenTestResult : boolean;
  constructor(public router: Router,private http: HttpClient,private route: ActivatedRoute, private store: Store<{ data: RootReducerState }>) {
  }
  getStartPenTest(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/runtask`);
  }

 
  startScanning() {
    this.isScanning = true;
    this.getStartPenTest().subscribe(data => {});
    this.progress = 0;
    this.progressMessage = 'Starting scan...';

    const messages = '';
    let messageIndex = 1;

    const interval = setInterval(() => {
      this.progress += 10;
      this.progressMessage = `${messages}`;

      if (this.progress >= 100) {
        clearInterval(interval);
       this.showPenTestResult=true;
      }

      messageIndex = (messageIndex + 1);
    }, 3500);
  }

  penTest: any;
  dynamicData: any;


getPenTestData(type) {
  if(type === 'att'){
    this.http.get('assets/data/pentest_existing.json').subscribe(data => {
      this.penTest = data;
      this.showPenTestResult=true;
    });
  } else {
    this.http.get('assets/data/pentest.json').subscribe(data => {
      this.penTest = data;
      this.showPenTestResult=false;
    });
  }
  
}


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.id ==='att'){
        this.getPenTestData('att');
      } else {
        this.getPenTestData('other');
      }
    });
  }
}

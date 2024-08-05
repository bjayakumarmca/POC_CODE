import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootReducerState } from 'src/app/store';
import { selectData } from 'src/app/store/filemanager/filemanager-selector';
import { fetchRecentFilesData } from 'src/app/store/filemanager/filemanager.actions';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.scss'],
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
export class FilemanagerComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  radialoptions: any;
  public isCollapsed: boolean = false;
  dismissible = true;
  Recentfile: any
  files = {};
  folders = [];
  fileContent = {};
  isLoading = true;
  showScanResults = false;
  staticdata: any = [];

  scaData: any = [];
  filteredStaticData =[];
  filteredScaData = [];

  isScanning = false;
progress = 0;
progressMessage = '';
  constructor(public router: Router,private http: HttpClient, private store: Store<{ data: RootReducerState }>) {
  }

 
  startScanning() {
    this.isScanning = true;
    this.progress = 0;
    this.progressMessage = 'Starting scan...';

    const messages = [
    'Scanning for vulnerabilities..',
    'Static Scan is in progress..', 
    'Static Scan is in progress..', 
    'Analysing found vulnerabilities..',
    'Static Scan is Completed.. & Dynamic Scan started..', 
    'Dynamic Scan is in progress..',  
    'Dynamic Scan is in progress..',  
    'Dynamic Scan is Completed.',
    'Execution completed..',
    'Documenting results and recommendations..', 
   ];
    let messageIndex = 1;

    const interval = setInterval(() => {
      this.progress += 10;
      this.progressMessage = `${messages[messageIndex]}`;

      if (this.progress >= 100) {
        clearInterval(interval);
        this.progressMessage = 'Scan completed';
        this.showScanResults = true;
        this.isScanning = false;
      }

      messageIndex = (messageIndex + 1);
    }, 1000);
  }
  autoFixDone = false;
  typingSpeed = 1; // Speed in milliseconds
  displayedContent = '';
  selectedId = 0;
  commit = false;

  typeFileContent() {
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.fileContent['content'].length) {
        this.displayedContent += this.fileContent['content'][i];
        i++;
      } else {
        clearInterval(interval);
        this.commit = true;
      }
    }, this.typingSpeed);
  } 

  commitChanges(){

    this.isScanning = true;
    this.progress = 0;
    this.progressMessage = 'Starting Process...';

    const messages = [
      'Committing changes..',
      "Pushing changes to the repository..",
    'Scanning the code for vulnerabilities..',
    'Scan is in progress..', 
    'Documenting results and recommendations..', 
   ];
    let messageIndex = 1;

    const interval = setInterval(() => {
      this.progress += 20;
      this.progressMessage = `${messages[messageIndex]}`;

      if (this.progress >= 100) {
        clearInterval(interval);
        this.progressMessage = 'Scan completed';
        this.showScanResults = true;
        this.commit = false;
        this.autoFixDone = false;
        this.displayedContent = '';
        this.fileContent = {};
        this.staticdata.forEach(item => {
          if (item.id === this.selectedId) {
            item.status = 'Closed';
          }
        });
        this.filteredStaticData = this.staticdata.filter(item => item.status === 'Open');
        this.staticdata = this.staticdata.filter(item => item.status === 'Open');
        this.filteredScaData = this.scaData;
        this.isScanning = false;
      }

      messageIndex = (messageIndex + 1);
    }, 1000);
  
  }
  
  getRepoContent(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/repo`);
  }

  getFileContent(path): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/file?path=${path}`);
  }

  getFileData(path, id){
    console.log(path);
    this.selectedId = id;
    console.log('Selected ID: ', this.selectedId);
    this.getFileContent(path).subscribe(data => {
      
      this.fileContent = data;
      let content = this.fileContent['content'];
      let lines = content.split('\n');
      this.fileContent['content'] = lines.map((line, index) => `<span class="line">${index + 1} ${line}</span>`).join('\n');
      this.displayedContent = this.fileContent['content'];
    });
    
  
    this.filteredStaticData = this.staticdata.filter(item => {
      return path === item.Scanning;
    });
    this.filteredScaData = [];
  }

  showAllVul(){
    this.filteredStaticData = this.staticdata.filter(item => item.status === 'Open');
    this.filteredScaData = this.scaData;
    this.fileContent = {};
  }


  autofix(id, recommendations) {
    console.log('Auto Fixing issue: ', recommendations);
    this.displayedContent = '';
    this.selectedId = id;
    if (recommendations.includes('Replace') && recommendations.includes('gets') && recommendations.includes('fgets')) {
      let code = this.fileContent['content'];
      let line = this.fileContent['line_number'];
      let newCode = code.replace('gets', 'fgets');
      this.fileContent['content'] = newCode;
      console.log('Auto Fix Done');
      this.autoFixDone = true;
      this.typeFileContent();

      // Update autofix flag in staticData where id matches
      this.filteredStaticData.forEach(item => {
        if (item.id === id) {
          item.autoFixed = 'true';
        }
      });
    }
  }

  dastData: any;
  penTest: any;
  dynamicData: any;


getDastData() {
  this.http.get('assets/data/dast.json').subscribe(data => {
    this.dastData = data;
 
  });
}

getPenTestData() {
  this.http.get('assets/data/pentest.json').subscribe(data => {
    this.penTest = data;
   
  });
}

getSCAData() {
  this.http.get('assets/data/sca.json').subscribe(data => {
    this.scaData = data;
    this.filteredScaData = this.scaData;
  });
}

getSASTData() {
  this.http.get('assets/data/sast.json').subscribe(data => {
    this.staticdata = data;
    this.filteredStaticData = this.staticdata;
   
   
  });
}
getDynamicData() {
  this.http.get('assets/data/dynamic.json').subscribe(data => {
    this.dynamicData = data;
 
   
  });
}

  ngOnInit(): void {
    
    this.getDastData();
    this.getPenTestData();
    this.getSCAData();
    this.getSASTData();
    this.getDynamicData();
    this.breadCrumbItems = [{ label: 'Apps' }, { label: 'File Manager', active: true }];
  
    this.getRepoContent().subscribe(data => {
      this.files = data;
      this.folders = Object.entries(this.files)
        .map(([name, files]) => ({
          name,
          files,
          isCollapsed: false
        }))
        .sort((a, b) => {
          if (a.name === '') return 1; // Empty folders should be at the end
          if (b.name === '') return -1; // Empty folders should be at the end
          return a.name.localeCompare(b.name); // Sort folders in ascending order based on the key
        });
        this.isLoading = false;
   /*    
      if (this.folders && this.folders.length > 0) {
        
        this.getFileData(this.folders[0].name+'/'+this.folders[0].files[0]);
      } */

    });
 
    
    
    this.store.dispatch(fetchRecentFilesData());
    this.store.select(selectData).subscribe(data => {
      this.Recentfile = data
    });
    

    this.radialoptions = {
      series: [76],
      chart: {
        height: 150,
        type: 'radialBar',
        sparkline: {
          enabled: true
        }
      },
      colors: ['#556ee6'],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: '97%',
            margin: 5, // margin is in pixels
          },
          hollow: {
            size: '60%',
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '16px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      stroke: {
        dashArray: 3
      },
      labels: ['Storage'],
    }
  }

}

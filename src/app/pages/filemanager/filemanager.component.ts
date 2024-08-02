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
  staticdata = [
    {
      "id":1,
      "line_number": "6, 10",
      "issue_type": "Buffer Overflow",
      "code_snippet": "gets(username);",
      "confidence" : [70],
      "autoFixed": 'false',
      "status": "Open",
      "recommendations": "Replace 'gets()' with 'fgets()' to prevent buffer overflow. Also, ensure 'username' is properly sized or validated.",
      "Scanning": "Buffer Overflow/gets.c"
    },
    {
      "id":2,
      "line_number": "1, 10, 20, 29, 38",
      "issue_type": "Insecure Deserialization",
      "code_snippet": "ObjectInputStream in = new ObjectInputStream(file);",
      "confidence" : [75],
      "status": "Open",
      "autoFixed": 'false',
      "recommendations": "Use a secure deserialization approach. Validate the incoming object type and implement a whitelist of allowed classes. Consider using a safer serialization format, such as JSON or XML, instead of Java's built-in serialization.",
      "Scanning": "Unsafe Deserialization/java/SerializeToFile.java"
    },
    {
      "id":3,
      "line_number": "15",
      "issue_type": "LDAP Injection",
      "confidence" : [50],
      "status": "Open",
      "autoFixed": 'false',
      "code_snippet": "searcher.Filter = \"(&(objectClass=user)(|(cn=\" + user + \")(sAMAccountName=\" + user + \")))\";",
      "recommendations": "Use parameterized queries or validate/sanitize user input to prevent LDAP injection attacks.",
      "Scanning": "LDAP Injection/LDAP.cs"
    },
    {
      "id":4,
      "line_number": "10",
      "issue_type": "Local File Inclusion (LFI)",
      "code_snippet": "include($_POST[\"page\"]);",
      "confidence" : [95],
      "status": "Open",
      "autoFixed": 'false',
      "recommendations": "Validate and sanitize the input from the 'page' parameter. Implement a whitelist of allowed files to prevent unauthorized file access.",
      "Scanning": "File Inclusion/lfi6.php"
    },
    {
      "id":5,
      "line_number": "7, 10",
      "issue_type": "Local File Inclusion (LFI)",
      "confidence" : [80],
      "status": "Open",
      "autoFixed": 'false',
      "code_snippet": "$file = str_replace('../', '', $_GET['file']);",
      "recommendations": "Use a whitelist of allowed files or sanitize user input to prevent unauthorized file access.",
      "Scanning": "File Inclusion/lfi13.php"
    }
  ];

  dynamicData = [
    {
      "Vulnerability ID": "71064",
      "Affected Spec": "<2.32.2",
      "Advisory": "Affected versions of Requests, when making requests through a Requests `Session`, if the first request is made with `verify=False` to disable cert verification, all subsequent requests to the same host will continue to ignore cert verification regardless of changes to the value of `verify`. This behavior will continue for the lifecycle of the connection in the connection pool. Requests 2.32.0 fixes the issue, but versions 2.32.0 and 2.32.1 were yanked due to conflicts with CVE-2024-35195 mitigation.",
      "CVE": "CVE-2024-35195",
      "More Info URL": 'https://data.safetycli.com/v/71064/97c'
    },
    {
      "Vulnerability ID": "71609",
      "Affected Spec": "<0.1.30",
      "CVE": "CVE-2024-35199",
      "Advisory": "LangChain affected versions allows directory traversal by an actor who is able to control the final part of the path parameter in a load_chain call. This bypasses the intended behavior of loading configurations only from the hwchase17/langchain-hub GitHub repository. The outcome can be disclosure of an API key for a large language model online service, or remote code... CVE-2024-28088",
      "More Info URL": "https://data.safetycli.com/v/71609/97c"
    }
  ];
  filteredStaticData =[];

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
    'Analysing found vulnerabilities..',
    'Static Scan is Completed.. & Dynamic Scan started..', 
    'Dynamic Scan is in progress..',  
    'Dynamic Scan is Completed.',
    'Penetration testing execution started..', 
    'Almost done with penetration testing..',
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
    this.progressMessage = 'Starting scan...';

    const messages = [
    'Scanning the code for vulnerabilities..',
    'Scan is in progress..', 
    'Analysing found vulnerabilities..',
    'Execution completed..',
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
  }
  showAllVul(){
    this.filteredStaticData = this.staticdata.filter(item => item.status === 'Open');
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

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Apps' }, { label: 'File Manager', active: true }];
    this.filteredStaticData = this.staticdata;
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

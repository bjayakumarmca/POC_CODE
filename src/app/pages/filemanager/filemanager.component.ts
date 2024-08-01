import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootReducerState } from 'src/app/store';
import { selectData } from 'src/app/store/filemanager/filemanager-selector';
import { fetchRecentFilesData } from 'src/app/store/filemanager/filemanager.actions';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.scss']
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

  staticdata = [{
    "line_number": "6, 10, 14",
    "issue_type": "Path Traversal",
    "code_snippet": "entry.ExtractToFile(Path.Combine(extractPath, entry.FullName));",
    "recommended_code_fix": "Validate and sanitize 'zipPath' and 'extractPath' to prevent path traversal vulnerabilities."
   },
   {
    "line_number": "6",
    "issue_type": "SQL Injection",
    "code_snippet": "User ID and Password concatenation in connection string",
    "recommended_code_fix": "Use parameterized queries or stored procedures to prevent SQL injection."
   },
   {
      "line_number": "5",
      "issue_type": "SQL Injection",
      "code_snippet": "String url = \"jdbc:mysql://10.12.1.34/\" + request.getParameter(\"selectedDB\");",
      "recommended_code_fix": "Use a prepared statement or sanitize the input to prevent SQL injection."
   },
   {
    "line_number": "7, 10",
    "issue_type": "Local File Inclusion (LFI)",
    "code_snippet": "$_GET['file']",
    "recommended_code_fix": "Validate the input file against a whitelist of allowed files or use an absolute path."
   },
   {
    "line_number": "9, 11",
    "issue_type": "Local File Inclusion",
    "code_snippet": "$file = str_replace('../', '', $_POST['file']); include(\"pages/$file\");",
    "recommended_code_fix": "Use a whitelist of allowed files instead of directly including user input."
   },
   {
      "line_number": "8",
      "issue_type": "Local File Inclusion (LFI)",
      "code_snippet": "// include(\includes/.$_GET['library']..php\);",
      "recommended_code_fix": "// Validate the input and use a whitelist of allowed libraries."
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
      "Vulnerability found in l": "angchain-core version 0.1.12",
      "Vulnerability ID": "71609",
      "Affected spec": "<0.1.30",
      "ADVISORY": "LangChain affected versions allows directory traversal by an actor who is able to control the final part of the path parameter in a load_chain call. This bypasses the intended behavior of loading configurations only from the hwchase17/langchain-hub GitHub repository. The outcome can be disclosure of an API key for a large language model online service, or remote code... CVE-2024-28088",
      "For more information about this vulnerability": "visit https://data.safetycli.com/v/71609/97c"
    }
  ];

  constructor(public router: Router,private http: HttpClient, private store: Store<{ data: RootReducerState }>) {
  }
  getRepoContent(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/repo`);
  }

  getFileContent(path): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/file?path=${path}`);
  }
  
  getFileData(path){
    console.log(path);
    this.getFileContent(path).subscribe(data => {
      
      this.fileContent = data;
      let content = this.fileContent['content'];
      let lines = content.split('\n');
      this.fileContent['content'] = lines.map((line, index) => `<span class="line">${index + 1} ${line}</span>`).join('\n');
    });
  }
  

  ngOnInit(): void {
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

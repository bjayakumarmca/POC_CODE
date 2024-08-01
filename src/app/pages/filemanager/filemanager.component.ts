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

      
      if (this.folders && this.folders.length > 0) {
        
        this.getFileData(this.folders[0].name+'/'+this.folders[0].files[0]);
      }
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

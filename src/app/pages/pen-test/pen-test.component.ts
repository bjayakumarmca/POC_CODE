import { Component, OnInit} from '@angular/core';
import { penTestData } from 'src/app/core/data/penTestData';

@Component({
  selector: 'app-pen-test',
  templateUrl: './pen-test.component.html',
  styleUrls: ['./pen-test.component.css']
})
export class PenTestComponent implements OnInit {
  dataToUse = penTestData;
  ngOnInit() {
    
  }
}

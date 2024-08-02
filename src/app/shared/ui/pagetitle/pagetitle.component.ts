import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-page-title',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.scss']
})
export class PagetitleComponent implements OnInit {
  modalRef?: BsModalRef;
  @ViewChild('reponame') myreponame!: ElementRef;
  @ViewChild('repourl') myrepourl!: ElementRef;
  @ViewChild('site') mysite!: ElementRef;
  @ViewChild('descript') mydescript!: ElementRef;
  @ViewChild('appname') appname!: ElementRef;
  @ViewChild('appurl') appurl!: ElementRef;
  @ViewChild('selectlevel') selectlevel!: ElementRef;
  @Output() storageItemCreated = new EventEmitter<void>();
  @Output() newAppCreated = new EventEmitter<void>();
  @Input() breadcrumbItems;
  @Input() title: string;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {

  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalRef = this.modalService.show(content);
  }

  createRepo(){
    localStorage.setItem('isRepoCreated','yes');
    localStorage.setItem('reponame',this.myreponame.nativeElement.value);
    localStorage.setItem('repourl',this.myrepourl.nativeElement.value);
    localStorage.setItem('site',this.mysite.nativeElement.value);
    localStorage.setItem('descript',this.mydescript.nativeElement.value);
    this.modalRef.hide();
    setTimeout(()=>{
      this.storageItemCreated.emit();
    }, 3000);
  }

  createApp(){
    localStorage.setItem('isAppCreated','yes');
    localStorage.setItem('appname',this.appname.nativeElement.value);
    localStorage.setItem('appurl',this.appurl.nativeElement.value);
    localStorage.setItem('testlevel',this.selectlevel.nativeElement.value);
    this.modalRef.hide();
    setTimeout(()=>{
      this.newAppCreated.emit();
    }, 3000);
  }
  disableLink(event: Event) {
    event.preventDefault(); 
  }
}

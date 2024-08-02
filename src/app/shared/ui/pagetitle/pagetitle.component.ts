import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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
      window.location.reload();
    }, 3000);
  }
  disableLink(event: Event) {
    event.preventDefault(); 
  }
}

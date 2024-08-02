import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

import { earningLineChart, salesAnalyticsDonutChart } from './data';
import { ChartType, ChatMessage } from './saas.model';
import { ConfigService } from '../../../core/services/config.service';
import { fetchchatdata } from 'src/app/store/Chat/chat.action';
import { selectData } from 'src/app/store/Chat/chat-selector';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-saas',
  templateUrl: './saas.component.html',
  styleUrls: ['./saas.component.scss']
})
/**
 * Saas-dashboard component
 */
export class SaasComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollRef') scrollRef;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  earningLineChart: ChartType;
  salesAnalyticsDonutChart: ChartType;
  ChatData: ChatMessage[];
  sassEarning: any;
  sassTopSelling: any;
  formData: UntypedFormGroup;

  // Form submit
  chatSubmit: boolean;

  constructor(public formBuilder: UntypedFormBuilder, private configService: ConfigService, public store: Store) { }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboards' }, { label: 'Saas', active: true }];

    this.store.dispatch(fetchchatdata());
    this.store.select(selectData).subscribe(data => {
      this.ChatData = data;
    })
    this._fetchData();

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    this.configService.getConfig().subscribe(response => {
      this.sassEarning = response.sassEarning;
      this.sassTopSelling = response.sassTopSelling;

    });
  }

  /**
   * Save the message in chat
   */
  messageSave() {
    const message = this.formData.get('message').value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.ChatData.push({
        align: 'right',
        name: 'Henry Wells',
        message,
        time: currentDate.getHours() + ':' + currentDate.getMinutes()
      });
      this.onListScroll();
      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null
      });
    }

    this.chatSubmit = true;
  }

  private _fetchData() {
    this.earningLineChart = earningLineChart;
    this.salesAnalyticsDonutChart = salesAnalyticsDonutChart;
  }

  ngAfterViewInit() {
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 500;
  }

  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight + 1500;
      }, 500);
    }
  }

  selectMonth(value: any) {
    let data = value.target.value
    switch (data) {
      case "january":
        this.sassEarning = [
          {
            name: "This month",
            amount: "200hrs",
            revenue: "0.7",
            time: "From previous period",
            month: "Last month",
            previousamount: "140hrs",
            series: [
              {
                name: "AI commits",
                data: [2, 5, 3, 1, 5, 3, 2, 3, 5, 3, 5, 3],
              },
            ],
          },
        ];
        break;
      case "december":
        this.sassEarning = [
          {
            name: "This month",
            amount: "140hrs",
            revenue: "0.8",
            time: "From previous period",
            month: "Last month",
            previousamount: "112hrs",
            series: [
              {
                name: "AI Commits",
                data: [2, 1, 3, 4, 3, 2, 1, 4, 2],
              },
            ],
          },
        ];
        break;
      case "november":
        this.sassEarning = [
          {
            name: "This month",
            amount: "112hrs",
            revenue: "0.71",
            time: "From previous period",
            month: "Last month",
            previousamount: "80hrs",
            series: [
              {
                name: "AI Commits",
                data: [2, 3, 2, 5, 4, 2, 1, 4,],
              },
            ],
          },
        ];
        break;
      case "october":
        this.sassEarning = [
          {
            name: "This month",
            amount: "80hrs",
            revenue: "0.75",
            time: "From previous period",
            month: "Last month",
            previousamount: "60hrs",
            series: [
              {
                name: "AI Commits",
                data: [2, 4, 3, 2, 4, 1, 2, 4, 2, 3, 2, 2],
              },
            ],
          },
        ];
        break;
    }
  }

  sellingProduct(event) {
    let month = event.target.value;
    switch (month) {
      case "january":
        this.sassTopSelling = [
          {
            title: "Product B",
            amount: "$ 7842",
            revenue: "0.4",
            list: [
              {
                name: "Product D",
                text: "Neque quis est",
                sales: 41,
                chartVariant: "#34c38f"
              },
              {
                name: "Product E",
                text: "Quis autem iure",
                sales: 14,
                chartVariant: "#556ee6"
              },
              {
                name: "Product F",
                text: "Sed aliquam mauris.",
                sales: 85,
                chartVariant: "#f46a6a"
              },
            ],
          },
        ];
        break;
      case "december":
        this.sassTopSelling = [
          {
            title: "Product A",
            amount: "$ 6385",
            revenue: "0.6",
            list: [
              {
                name: "Product A",
                text: "Neque quis est",
                sales: 37,
                chartVariant: "#556ee6"
              },
              {
                name: "Product B",
                text: "Quis autem iure",
                sales: 72,
                chartVariant: "#f46a6a"
              },
              {
                name: "Product C",
                text: "Sed aliquam mauris.",
                sales: 54,
                chartVariant: "#34c38f"
              },
            ],
          },
        ];
        break;
      case "november":
        this.sassTopSelling = [
          {
            title: "Product C",
            amount: "$ 4745",
            revenue: "0.8",
            list: [
              {
                name: "Product G",
                text: "Neque quis est",
                sales: 37,
                chartVariant: "#34c38f"
              },
              {
                name: "Product H",
                text: "Quis autem iure",
                sales: 42,
                chartVariant: "#556ee6"
              },
              {
                name: "Product I",
                text: "Sed aliquam mauris.",
                sales: 63,
                chartVariant: "#f46a6a"
              },
            ],
          },
        ];
        break;
      case "october":
        this.sassTopSelling = [
          {
            title: "Product A",
            amount: "$ 6385",
            revenue: "0.6",
            list: [
              {
                name: "Product A",
                text: "Neque quis est",
                sales: 37,
                chartVariant: "#f46a6a"
              },
              {
                name: "Product B",
                text: "Quis autem iure",
                sales: 72,
                chartVariant: "#556ee6"
              },
              {
                name: "Product C",
                text: "Sed aliquam mauris.",
                sales: 54,
                chartVariant: "#34c38f"
              },
            ],
          },
        ];
        break;
      default:
        this.sassTopSelling = [
          {
            title: "Product A",
            amount: "$ 6385",
            revenue: "0.6",
            list: [
              {
                name: "Product A",
                text: "Neque quis est",
                sales: 37,
                chartVariant: "#556ee6"
              },
              {
                name: "Product B",
                text: "Quis autem iure",
                sales: 72,
                chartVariant: "#34c38f"
              },
              {
                name: "Product C",
                text: "Sed aliquam mauris.",
                sales: 54,
                chartVariant: "#f46a6a"
              }
            ]
          }
        ];
        break;
    }
  }

}

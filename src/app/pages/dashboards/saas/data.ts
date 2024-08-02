import { ChartType } from './saas.model';

const earningLineChart: ChartType = {
    series: [{
        name: 'series1',
        data: [31, 40, 36, 51, 49, 72, 69, 56, 68, 82, 68, 76]
    }],
    chart: {
        height: 288,
        type: 'line',
        toolbar: 'false',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 8,
            opacity: 0.2
        },
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        //categories: ['1', '3', '6', '8', '14', '20', '21','23','24','26','29','30','31'],
        title: {
            text: 'days'
        }   
    },
    yaxis: {
        title: {
            text: 'AI Commits'
        },
    },
    colors: ['#556ee6'],
    stroke: {
        curve: 'smooth',
        width: 3,
    }
    
};

const salesAnalyticsDonutChart: ChartType = {
    series: [85, 25, 5],
    chart: {
        type: 'donut',
        height: 240,
    },
    labels: ['SAST', 'DAST', 'SCA'],
    colors: ['#556ee6', '#34c38f', '#f46a6a'],
    legend: {
        show: false,
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
            }
        }
    }
};


export { earningLineChart, salesAnalyticsDonutChart };

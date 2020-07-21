// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var yLabels = {
  0: '',
  1: '6 Hr',
  2: '6 ~ 24 Hr',
  3: '24 Hr'
}

// Bar Chart
var ctx = document.getElementById("myBarChart");
var myBarChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["Area 1", "Area 2", "Area 3", "Area 4"],
    datasets: [{
      label: "This Month",
      backgroundColor: "#4e73df",
      hoverBackgroundColor: "#2e59d9",
      borderColor: "#4e73df",
      data: [2, 2, 1, 3],
    },
    {
      label: "Historic",
      backgroundColor: "#9c9eb3",
      hoverBackgroundColor: "#767996",
      borderColor: "#4e73df",
      data: [3, 2, 2, 1],
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'Areas'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 6
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          fontSize: 15,
          labelString: 'Hours Per Week'
        },
        ticks: {
          min: 0,
          max: 3,
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return yLabels[value];
        }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: true,
      align: "end",
      position: "bottom"
    },
    tooltips: {
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + yLabels[tooltipItem.yLabel];
        }
      }
    },
  }
});

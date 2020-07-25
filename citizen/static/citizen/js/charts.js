// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';


const yLabels = {
  0: '',
  1: '6 Hr',
  2: '6 ~ 24 Hr',
  3: '24 Hr'
}

// Area Chart
var area = document.getElementById("myAreaChart");
var areaChart = null;

// Bar Chart
var bar = document.getElementById("myBarChart");
var barChart = null;


// Area Chart Example
function create_area_chart(labels, data) {
  if (areaChart != null) {
    areaChart.destroy();
  }
  areaChart = new Chart(area, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: "Week",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: data,
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
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 3,
            maxTicksLimit: 5,
            padding: 10,
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
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return label_hover(tooltipItem.yLabel);
          }
        }
      }
    }
  });
}

function create_bar_chart(labels, data) {
  if (barChart != null) {
    barChart.destroy();
  }
  var bar_colors = coloring_bars(data);
  barChart = new Chart(bar, {
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        backgroundColor: bar_colors.barsColor,
        hoverBackgroundColor: bar_colors.hoverColor,
        data: data,
      }, ],
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
        yAxes: [{
          time: {
            unit: 'Areas'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 6,
            autoSkip: false
          },
        }],
        xAxes: [{
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
        display: false,
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
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + label_hover(tooltipItem.xLabel);
          }
        }
      },
    }
  });
}

function label_hover(num) {
  return (num >= 1 && num <= 1.6) ? "Less than 6 Hours" :
    (num > 1.6 && num <= 2.3) ? "Between 6 and 24 hours" :
    (num > 2.3 && num <= 3) ? "More than 24 Hours" :
    "";
}
function color_bar(num) {
  return (num >= 1 && num <= 1.6) ? "#df4131" :
    (num > 1.6 && num <= 2.3) ? "#d8df31" :
    (num > 2.3 && num <= 3) ? "#71b56c" :
    "grey";
}
function hover(num) {
  return (num >= 1 && num <= 1.6) ? "red" :
    (num > 1.6 && num <= 2.3) ? "yellow" :
    (num > 2.3 && num <= 3) ? "green" :
    "grey";
}

function coloring_bars(data) {
  let barsColor = [];
  let hoverColor = [];
  for(let i=0; i<data.length; i++){
    barsColor.push(color_bar(data[i]))
    hoverColor.push(hover(data[i]))
  }
  return {barsColor, hoverColor}
}
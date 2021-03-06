//STATISTICS

//Define request to get stats from database with api
var xhttpStats = new XMLHttpRequest();
xhttpStats.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

    var xhttpStatsList = JSON.parse(xhttpStats.response);

    //Creates yearList from database
    for (var i = 0; i < xhttpStatsList.length; i++) {  
        yearList.push(xhttpStatsList[i]);
    }

    // Sort array by year
    function compareYears(a, b) {
        if (a.year < b.year)
          return -1;
        if (a.year > b.year)
          return 1;
        return 0;
    }
    xhttpStatsList.sort(compareYears);

    //Runs chart function
    CreateStatistic(xhttpStatsList);
    
      
    console.log(xhttpStatsList);
    }
}

//Sends correct data from database
xhttpStats.open('GET', 'http://localhost:1137/stats', true);
xhttpStats.send();

//Viewmodel for statistics - creates variables for clicked element
function viewModelStats() {
    self = this;
    self.yearList = ko.observableArray();
    self.selectedYear = ko.observable({code:''});
  
    self.linksStats = ko.computed(function(){
        return self.selectedYear().statLinks
    });
    self.statFlag = ko.computed(function(){
          console.log(self.selectedYear());
        return 'flag-icon flag-icon-' + self.selectedYear().code.toLowerCase()
    });
}

//Sends viewmodelstats to statistics 
ko.applyBindings(viewModelStats, document.getElementById("stats"));

//Checks if selectedCountry contains links - returns readMore depending on content
function checkLinksStats(){
    if(linksStats()!=undefined){
      if(linksStats().length==1){
        if(linksStats()[0].statLink=="" && linksStats()[0].statTitle==""){
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
  
    }
    else{
      return false;
    }
  }

//Creates chart and variables
function CreateStatistic(request) {
    var years = [];
    var weapons = [];
    var info = [];
    var statLinks = [];

    //Creates all years and weapons from database
    for (i = 0; i < request.length; i++) {
        years[i] = request[i].year.toString();
        weapons[i] = request[i].weapons;
    }

    //Makes years a global variable
    window.years = years;

    //Calculates max value for weapons
    var maxWeapons = Math.round(Math.max.apply(Math, weapons));
    
    //Displays chart
    var canvas = document.getElementById("myChart");
    var ctx = canvas.getContext("2d");
    var chart = new Chart(ctx, {

        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: "Miljarder kr ",
                borderColor: '#E54500',
                data: weapons,
                borderWidth: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                point: {
                    radius: 7,
                    hoverRadius: 12,
                    mode: 'index',
                    backgroundColor: '#E54500',
                }
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Svensk vapenexportsumma',
                fontColor: 'white',
                fontSize: 16,
                horizontalAlign: "center",
            },
            hover: {
                onHover: function(e, el) {
                    $("#myChart").css("cursor", el[0] ? "pointer" : "default");
                }
            },         
            layout: {
                padding: {
                    left: 15,
                    right: 45,
                    top: 5,
                    bottom: 15
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white",
                        fontSize: 16,
                        stepSize: 2,
                        beginAtZero: true,
                        max: maxWeapons + 4,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Miljarder kr',
                        fontColor: "white",
                        fontSize: 20,
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white",
                        fontSize: 16,
                        stepSize: 4,
                        beginAtZero: true,
                    },
                    scaleLabel: {
                    display: true,
                    labelString: 'Årtal',
                    fontColor: "white",
                    fontSize: 20,
                    }
                }]
            }
        }
    });
    //Displays chart ends

    clickOnPoint(canvas, chart, request);
}

//Handles click event when point in chart is clicked - returns label, info and value of clicked point
function clickOnPoint(canvas, chart, allYears) {
    
    canvas.onclick = function(canvas) {
        
        // Scroll to top animation onclick
        $("#statsInfo").animate({
            scrollTop: 0
        }, 200);

        //Retrieves first point through chart index
        var firstPoint = chart.getElementAtEvent(canvas)[0];

        if (firstPoint) {
            //Converts years data to label (foreach points index)
            var label = chart.data.labels[firstPoint._index];

            //Converts weapons data to value (foreach points index)
            var value = chart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];

            //Creates selectedYear for clicked point
            for (var i=0; i < yearList().length; i++)  {
                if(yearList()[i].year == label) {
                   selectedYear(yearList()[i]);
                 }
               }

            //Sends values to fill infobox
            fillInfoBox(label, value, allYears[firstPoint._index].info);
        } 
    }
}

//Sends values to infobox
function fillInfoBox(year, weapons, info) {

    var infoboxChart = $('#stats .infobox-after');

    //Retrieves from database
    infoboxChart.find('#stat-year').html("Årtal " + year);
    infoboxChart.find('#stat-weapons').html(weapons + " Miljarder kr");
    infoboxChart.find('#stat-info').html(info);

    //Displays correct infobox
    changeInfobox();
}

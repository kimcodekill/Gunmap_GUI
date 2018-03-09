var weapons = {'AF':20, 'US':70};

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

    var xhttpCountries = JSON.parse(xhttp.response);
    
    
    for (var i = 0; i < xhttpCountries.length; i++) {  
      countryList.push(xhttpCountries[i]);
      weapons[xhttpCountries[i].code] = Number(xhttpCountries[i].weapons);
    }
    CreateMap();
}}
xhttp.open('GET', 'http://localhost:1137/map', true);
xhttp.send();

function viewModel() {
  self = this;
  self.countryList = ko.observableArray();
  self.selectedCountry = ko.observable({
    country: 'Sweden',
    code: 'SE',
    weapons: '10000',
    gpi: '10',
    info: 'This is where info ends up',
    links: 'This is where links show up'
  });
  self.searchTerm = ko.observable("");
  self.flag = ko.computed(() => {
    return 'flag-icon flag-icon-' + self.selectedCountry().code.toLowerCase()
  });
  self.weaponInfo = ko.computed(() =>{
    return self.selectedCountry().weapons + ' / år'
  });
  self.GPIInfo = ko.computed(() => {
    return self.selectedCountry().gpi + ' av 162'
  });
  self.showList = () => {
    if (self.searchTerm() == '') {
      
      console.log('all countries returned')
      return self.countryList();
    } else {
      var countries = [];
      for (i = 0; i < countryList().length; i++) {
        if (countryList()[i].country.includes(searchTerm())) {
          countries[i] = countryList()[i];
        }
      }
      if (countries.length == 0) {
        console.log('no match in list')
        return [{country: "Inget resultat matchar din sökning!"}]
      } else {
        console.log('returned matches in list')
        return countries;
      }
    }
  };
}

ko.applyBindings(viewModel);

function CreateMap() {
  var map = $(function(){
    $('#world-map').vectorMap({
        map: 'world_mill',
        series: {
          regions: [{
            // values: guns,
            values: weapons,
            scale: ['#0000ff', '#ffff00'],
            normalizeFunction: 'polynomial',
            legend: {
              title: 'Weapons',
              vertical: true,
        }}]},
        onRegionOver(e, code) {
          if (!(code in weapons))
            e.preventDefault();
        },
        onRegionTipShow: function(e, el, code){
          if (!(code in weapons))
            e.preventDefault();
        },
        onRegionClick(e, code) {
            for (i=0; i < countryList().length; i++)  {
              if(countryList()[i].code == code) {
                selectedCountry(countryList()[i]);
                console.log(selectedCountry());
                // document.getElementById('country').innerHTML = country.country;
                // document.getElementById('info').innerHTML = country.info;
                // document.getElementById('flag').className = 'flag-icon flag-icon-' + code.toLowerCase();
                // document.getElementById('weaponInfo').innerHTML = country.weapons + ' / år';
                // document.getElementById('GPIInfo').innerHTML = country.gpi + ' av 162';
              }
            }
        },
    });
  });
}

function searchDropdownFunction() {
    document.getElementById("searchDropdownContent").classList.toggle("show");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("searchDropdownInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("searchDropdownContent");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}
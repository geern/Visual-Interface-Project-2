var fungusData, mapBackground, timeLine;

document.getElementById("ColorSelect").onchange = function(){
  updateMapDots(this.value)
}

document.getElementById("mapBackgroundSelect").onchange = function(){
  updateMapBackground(this.value)
}

Promise.all([
  d3.csv('data/occurrences.csv'),
  d3.csv('data/mapBackground.csv')
    ]).then(function(files) {
      data = files[0]
      mapBackground = files[1]

      //parsing data to integers
      fungusData = new fungiData(data)
      fungusData.parseData()
      fungusData.countDataByYear()

      var width = document.getElementById("timeLine").clientWidth
      var height = document.getElementById("timeLine").clientHeight

      timeLine = new BarChart({ 
        parentElement: '#timeLine', 
        title:"Samples Grouped By Year",
        containerWidth: width,
        containerHeight: height,
        xLabel: "Years",
        yLabel: "Sample Count"
      }, 
      fungusData.countsByYear, "Years", "Sample Count");

      //adding map background options
      mapBackground.forEach(function (item, index){
        loadDropDown("mapBackgroundSelect", [item.DisplayName])
      })
      
      leafletMap = new LeafletMap({ parentElement: 'my-map'}, fungusData.data);
})

function updateMapDots(_classification){
  leafletMap.updateVisColor(_classification)
}

function updateMapBackground(_selection){
  var classification = document.getElementById("ColorSelect").value
  var found = mapBackground.find(element => element.DisplayName == _selection);
  leafletMap.updateVisBackground(found.ProviderName, found.AccessToken, classification)
}

function loadDropDown(_name, _values){
  //grabs the dropdown
  var select = document.getElementById(_name);
  var opt = document.createElement('option')
  var value = ""
  var innerHTML = ""

  //goes through each item in _values array to create the name and value of the option
  _values.forEach(function(item, index){
    if(index == _values.length-1) {
      value += item
      innerHTML += item
    }
    else {
      value += item + ", "
      innerHTML += item + " - "
    }
  })
  
  //appends the option to the dropdown
  opt.value = value
  opt.innerHTML = innerHTML
  select.appendChild(opt)
}
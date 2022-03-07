var fungusData, mapBackground;

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
      fungusData = files[0]
      mapBackground = files[1]

      //parsing data to integers
      parseData(fungusData)

      //adding map background options
      mapBackground.forEach(function (item, index){
        loadDropDown("mapBackgroundSelect", [item.DisplayName])
      })
      
      leafletMap = new LeafletMap({ parentElement: '#my-map'}, fungusData);
})

function updateMapDots(_classification){
  leafletMap.updateVisColor(_classification)
}

function updateMapBackground(_selection){
  var classification = document.getElementById("ColorSelect").value
  var found = mapBackground.find(element => element.DisplayName == _selection);
  leafletMap.updateVisBackground(found.ProviderName, found.AccessToken, classification)
}

function parseData(_fungusData){
  Object.keys(_fungusData[0]).forEach( column => {
    if(parseInt(_fungusData[0][column])){
      _fungusData.forEach(d => {
        d[column] = parseFloat(d[column])
      });
    } 
  })

  _fungusData.forEach(d => {
    if(isNaN(d.decimalLatitude) || isNaN(d.decimalLongitude)){
      d.latitude = 9999999
      d.longitude = 9999999
    } else {
      d.latitude = d.decimalLatitude; //make sure these are not strings
      d.longitude = d.decimalLongitude; //make sure these are not strings
    }
  });
  fungusData = _fungusData 
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
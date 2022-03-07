var fungusData;

document.getElementById("ColorSelect").onchange = function(){
  updateMap(this.value)
}

d3.csv('data/occurrences.csv')
  .then(data => {
    fungusData = data
    parseData(fungusData)
    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, fungusData);
  })

function updateMap(_classification){
  leafletMap.updateVisColor(_classification)
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
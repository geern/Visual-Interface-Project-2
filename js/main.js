var data, fungusData, mapBackground, timeLine, sampledByYear, sampledByPhylum, sampledByCollector, table;

document.getElementById("ColorSelect").onchange = function(){
  updateMapDots(this.value)
}

document.getElementById("mapBackgroundSelect").onchange = function(){
  updateMapBackground(this.value)
}

document.getElementById("YearSlider").oninput = function(){
  var e = document.getElementById("YearSlider")
  var label = document.getElementById("SliderLabel")
  label.innerHTML = "Current Selected Year: " + e.value
  timeLine.yearHighlight(parseInt(e.value))
}

//on slider change, updates all charts
document.getElementById("YearSlider").onchange = function(){
  var e = document.getElementById("YearSlider")
  fungusData.getDataByYear(parseInt(e.value))

  sampledByYear.updateVis(fungusData.groupOfDataByYear, "Samples from " + e.value)
  timeLine.yearHighlight(parseInt(e.value))
}

function checkKeyDown(e){
  if(e.keyCode == 16){
    d3.selectAll('.brush').raise()
  }
}

function checkKeyUp(e){
  if(e.keyCode == 16){
    d3.selectAll('.brush').lower()
  }
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
      fungusData.appendSelected()

      var width = document.getElementById("timeLine").clientWidth
      var height = document.getElementById("timeLine").clientHeight

      timeLine = new BarChart({ 
        parentElement: '#timeLine', 
        title:"Samples Grouped By Year",
        containerWidth: width,
        containerHeight: height,
        xLabel: "Years",
        yLabel: "Sample Count",
        xValue: "year",
        yValue: "count",
        margin: {top: 30, right: 100, bottom: 70, left: 100}
      }, 
      fungusData.countsByYear);

      fungusData.getDataforTable(fungusData.data)
      table = new Table()
      table.createTable(fungusData.tableData)

      var width = document.getElementById("sampleByYear").clientWidth
      var height = document.getElementById("sampleByYear").clientHeight

      fungusData.getDataByYear(2017)
      sampledByYear = new BarChart({ 
        parentElement: '#sampleByYear', 
        title:"Samples from " + 2017,
        containerWidth: width,
        containerHeight: height,
        xLabel: "Month of the Year",
        yLabel: "Sample Count",
        xValue: "month",
        yValue: "count"
      }, 
      fungusData.groupOfDataByYear);

      fungusData.getCountByCategory("phylum")

      var width = document.getElementById("sampleByPhylum").clientWidth
      var height = document.getElementById("sampleByPhylum").clientHeight

      sampledByPhylum = new BarChart({ 
        parentElement: '#sampleByPhylum', 
        title:"Samples Grouped By Phylum",
        containerWidth: width,
        containerHeight: height,
        xLabel: "Phylum",
        yLabel: "Sample Count",
        xValue: "phylum",
        yValue: "count",
        margin: {top: 30, right: 100, bottom: 100, left: 100}
      }, 
      fungusData.groupedDataByphylum);

      fungusData.getCountByCategory("recordedBy")

      var width = document.getElementById("sampleByCollector").clientWidth
      var height = document.getElementById("sampleByCollector").clientHeight

      sampledByCollector = new BarChart({ 
        parentElement: '#sampleByCollector', 
        title:"Samples Grouped By Collector",
        containerWidth: width,
        containerHeight: height,
        xLabel: "Recorder",
        yLabel: "Sample Count",
        xValue: "recordedBy",
        yValue: "count",
        margin: {top: 30, right: 100, bottom: 120, left: 100}
      }, 
      fungusData.groupedDataByrecordedBy.slice(0,5));

      

      //adding map background options
      mapBackground.forEach(function (item, index){
        loadDropDown("mapBackgroundSelect", [item.DisplayName])
      })
      
      leafletMap = new LeafletMap({ parentElement: 'my-map'}, fungusData.data);

      document.getElementById("YearSlider").onchange()
})

function setSliderFromBrush(_range){
  let slider = document.getElementById('YearSlider')
  let label = document.getElementById("SliderLabel")
  label.innerHTML = "Current Selected Year: " + _range[0]
  slider.min = _range[0]
  slider.max = _range[1]
  slider.value = _range[0]
  slider.onchange()
  document.getElementById("LeftSliderLabel").innerHTML = slider.min
  document.getElementById("RightSliderLabel").innerHTML = slider.max
}

function updateMapDots(_classification){
  leafletMap.updateVisColor(_classification)
  leafletMap.updateDots()
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

function updateFromBrush(_selection){
  leafletMap.updateData(_selection)
  fungiData.data = _selection
  fungusData.getCountByCategory("phylum")
  fungusData.getCountByCategory("recordedBy")
  fungusData.getDataforTable(fungiData.data)
  sampledByPhylum.updateVis(fungusData.groupedDataByphylum)
  sampledByCollector.updateVis(fungusData.groupedDataByrecordedBy.slice(0,10))
  table.updateTable(fungusData.tableData)
}
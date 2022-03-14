class fungiData {
  constructor(_data) {
    this.data = _data;
  }

  parseData(){
    let data = this.data
    Object.keys(data[0]).forEach( column => {
      if(parseInt(data[0][column])){
        data.forEach(d => {
          d[column] = parseFloat(d[column])
        });
      } 
    })

    data.forEach(d => {
      if(isNaN(d.decimalLatitude) || isNaN(d.decimalLongitude)){
        d.latitude = 9999999
        d.longitude = 9999999
      } else {
        d.latitude = d.decimalLatitude; //make sure these are not strings
        d.longitude = d.decimalLongitude; //make sure these are not strings
      }
    });
  }

  countDataByYear(){
    let data = this.data;

    /*var uniqueYears = [...new Set(data.map(item => item.year))];
    uniqueYears.splice(uniqueYears.findIndex(Number.isNaN), 1)
    */
    var counts = []

    for(var i = 1859; i <= 2017; i++){
      var obj = {year: i, count: 0}
        counts.push(obj)
    }

    data.forEach( item => {
      if(counts.find(o => o.year === item.year) === undefined){
        var obj = {year: item.year, count: 1}
        counts.push(obj)
      }  else {
        counts.find(o => o.year === item.year).count++
        
      }
    })

    //for posterity
    var counter = 0
    for(var i = counts.length-1; i > 0; i--){
      if(isNaN(counts[i].year)) {
        counter++;
        counts.splice(i, 1)
      }
    }

    //counts.sort((a,b) => ((a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)))
    
    this.countsByYear = counts;
  }
}
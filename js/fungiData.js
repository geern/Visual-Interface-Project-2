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
    this.data = data 
  }
}
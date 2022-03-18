class Table {
  constructor() {
    
  }

  createTable(_data){
    let table = this
    table.table = document.createElement('table');
    table.thead = document.createElement('thead');
    table.tbody = document.createElement('tbody');

    table.table.appendChild(table.thead);
    table.table.appendChild(table.tbody);

    // Adding the entire table to the body tag
    document.getElementById('mainContent').appendChild(table.table);
    // Creating and adding data to first row of the table
    

    table.createHeader()
    table.createRow(_data)

    // Creating and adding data to second row of the table
    
  }

  createHeader(){
    let table = this
    let row = document.createElement('tr');
    let heading_1 = document.createElement('th');
    heading_1.innerHTML = "Total Records";
    let heading_2 = document.createElement('th');
    heading_2.innerHTML = "With Coordinates";
    let heading_3 = document.createElement('th');
    heading_3.innerHTML = "Without Coordinates";
    let heading_4 = document.createElement('th');
    heading_4.innerHTML = "With Event Date";
    let heading_5 = document.createElement('th');
    heading_5.innerHTML = "Without Event Date";

    row.appendChild(heading_1);
    row.appendChild(heading_2);
    row.appendChild(heading_3);
    row.appendChild(heading_4);
    row.appendChild(heading_5);
    table.thead.appendChild(row)
  }

  createRow(_data){
    let table = this
    console.log(_data)
    let row = document.createElement('tr');
    let row_data_1 = document.createElement('td');
    row_data_1.innerHTML = _data.totalRecords;
    let row_data_2 = document.createElement('td');
    row_data_2.innerHTML = _data.withCoords;
    let row_data_3 = document.createElement('td');
    row_data_3.innerHTML = _data.withoutCoords;
    let row_data_4 = document.createElement('td');
    row_data_4.innerHTML = _data.withEvent;
    let row_data_5 = document.createElement('td');
    row_data_5.innerHTML = _data.withoutEvent;

    row.appendChild(row_data_1);
    row.appendChild(row_data_2);
    row.appendChild(row_data_3);
    row.appendChild(row_data_4);
    row.appendChild(row_data_5);
    table.tbody.appendChild(row);
  }
}
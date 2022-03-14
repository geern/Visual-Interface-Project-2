class LeafletMap {

  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
    }
    this.data = _data;
    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    //ESRI
    vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    //TOPO
    vis.topoUrl ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    vis.topoAttr = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

    //Thunderforest Outdoors- requires key... so meh... 
    vis.thOutUrl = 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}';
    vis.thOutAttr = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //Stamen Terrain
    vis.stUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
    vis.stAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //this is the base map layer, where we are showing the map background
    /*vis.base_layer = L.tileLayer(vis.esriUrl, {
      id: 'esri-image',
      attribution: vis.esriAttr,
      ext: 'png'
    });*/

    vis.theMap = L.map('my-map', {
      center: [30, 0],
      zoom: 2
      //layers: [vis.base_layer]
    });

    /*L.tileLayer.provider('Jawg.Streets', {
      accessToken: 'ZbfatVMXqkwePUctq85uzb20cxPlhBZEVGXBSm8mt2glUIYxtLepu1zsX4RbOAFC'
    }).addTo(vis.theMap)*/
    vis.updateVisBackground('Jawg.Streets', 'ZbfatVMXqkwePUctq85uzb20cxPlhBZEVGXBSm8mt2glUIYxtLepu1zsX4RbOAFC', 'year')
    //vis.updateVisBackground("Basic", vis.esriUrl, vis.esriAttr)

    //if you stopped here, you would just have a map

    //initialize svg for d3 to add to map
    /*L.svg({clickable:true}).addTo(vis.theMap)// we have to make the svg layer clickable
    vis.overlay = d3.select(vis.theMap.getPanes().overlayPane)
    vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto")*/

    /*vis.colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateViridis)
      .domain(d3.extent(vis.data, d=> parseInt(d.year)))
    console.log(d3.extent(vis.data, d=> parseInt(d.year)))*/
    //these are the city locations, displayed as a set of dots 
    //vis.updateVisColor("year")
    
    //handler here for updating the map, as you zoom in and out           
    /*vis.theMap.on("zoomend", function(){
      vis.updateVis();
    });*/

  }

  updateVis() {
    let vis = this;

    //want to see how zoomed in you are? 
    // console.log(vis.map.getZoom()); //how zoomed am I
    
    //want to control the size of the radius to be a certain number of meters? 
    vis.radiusSize = 3; 
    // if( vis.theMap.getZoom > 15 ){
    //   metresPerPixel = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat * Math.PI/180)) / Math.pow(2, map.getZoom()+8);
    //   desiredMetersForPoint = 100; //or the uncertainty measure... =) 
    //   radiusSize = desiredMetersForPoint / metresPerPixel;
    // }
   
   //redraw based on new zoom- need to recalculate on-screen position
    vis.Dots
      .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
      .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y)
      .attr("r", vis.radiusSize) ;

  }

  updateVisColor(_classification){
    let vis = this;

    if(parseInt(vis.data[0][_classification])){
      var domain = d3.extent(vis.data, d => d[_classification]);
      vis.colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain(domain);

      d3.select("#mapLegend").selectAll("*").remove()

      var svg = d3.select("#mapLegend").append('svg')
        .attr('class', 'center-container')
        .attr('width', '100%')
        .attr('height', '20vh');
      var gradient = svg.append('defs').append('linearGradient')
        .attr("id", "legend-gradient")

      var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(20,20)`);

      var legendRect = legend.append('rect')
        .attr('width', '95%')
        .attr('height', 25)

      var legendTitle = legend.append('text')
        .attr('class', 'legend-title')
        .attr('dy', '.35em')
        .attr('y',-10)
        .text("Color By " + _classification)

      var legendStops = [
        { color: vis.colorScale(domain[0]), value: domain[0], offset: 0},
        { color: vis.colorScale(domain[1]), value: domain[1], offset: 100},
      ];

      

      gradient.selectAll('stop')
        .data(legendStops)
        .join('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color);

      legendRect.attr('fill', 'url(#legend-gradient)');

      let incrementTicks = []
      let incrementValue = _classification == "year" ? 5 : 12
      for(var i = domain[0]; i <= domain[1]; i+=incrementValue){
        incrementTicks.push({value: i})
      }

      if(incrementTicks[incrementTicks.length-1].value != domain[1]){
        incrementTicks.push({value: domain[1]})
      }

      legend.selectAll('.legend-label')
        .data(incrementTicks)
        .join('text')
        .attr('class', 'legend-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('y', 40)
        .attr('x', (d,index) => {
          return index == 0 ? 0 : (98/incrementTicks.length)*index + "%";
        })
        .text(d => d.value);
    } else {
      var unique = [...new Set(vis.data.map(item => item[_classification]))];
      unique.splice(unique.indexOf(""), 1)

      vis.colorScale = d3.scaleOrdinal()
        .domain(unique)
        .range(d3.schemeTableau10);

      d3.select("#mapLegend").selectAll("*").remove()

      var svg = d3.select("#mapLegend").append("svg")
      .attr("width", "100%")
      .attr("height", 500);

      svg.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate(20,20)");

      var ordinal = d3.scaleOrdinal()
      .domain(unique)
      .range(d3.schemeTableau10);

      var legendOrdinal = d3.legendColor()
      .scale(ordinal);

      svg.select(".legendOrdinal")
      .call(legendOrdinal);
    }
    
    if(typeof vis.Dots != 'undefined') vis.Dots.remove()
    vis.Dots = vis.svg.selectAll('circle')
                    .data(vis.data) 
                    .join('circle')
                        .attr("fill", d => vis.colorScale(d[_classification])) 
                        .attr("stroke", "black")
                        //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                        //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                        //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                        .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
                        .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y) 
                        .attr("r", 3)
                        .on('mouseover', function(event,d) { //function to add mouseover event
                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", "red") //change the fill
                              .attr('r', 4); //change radius
                            var html = () => {
                              var stringReturn = ``
                              stringReturn += `<div class="tooltip-label" "></div>`
                              stringReturn += `<ul>`
                              stringReturn += `<li>Year collected: ${d.year}</li>`
                              stringReturn += `<li>Collected By: ${d.recordedBy}</li>`
                              stringReturn += `<li>Pylum By: ${d.phylum}</li>`
                              stringReturn += `<li>Classification: ${d.class}</li>`
                              stringReturn += `<li>Habitat: ${d.habitat}</li>`
                              stringReturn += `<li>Substrate: ${d.substrate}</li>`
                              stringReturn += `<li>Link: ${d.references}</li>`
                              stringReturn += `</ul>`
                              return stringReturn
                            }
                            //create a tool tip
                            d3.select('#tooltip')
                                .style('opacity', 1)
                                .style('z-index', 1000000)
                                  // Format number with million and thousand separator
                                .html(html);

                          })
                        .on('mousemove', (event) => {
                            //position the tooltip
                            d3.select('#tooltip')
                             .style('left', (event.pageX + 10) + 'px')   
                              .style('top', (event.pageY + 10) + 'px');
                         })              
                        .on('mouseleave', function() { //function to add mouseover event
                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", d => vis.colorScale(d[_classification])) //change the fill
                              .attr('r', 3) //change radius

                            d3.select('#tooltip').style('opacity', 0);//turn off the tooltip

                          })
                        .on('click', (event, d) => { //experimental feature I was trying- click on point and then fly to it
                           // vis.newZoom = vis.theMap.getZoom()+2;
                           // if( vis.newZoom > 18)
                           //  vis.newZoom = 18; 
                           // vis.theMap.flyTo([d.latitude, d.longitude], vis.newZoom);
                          });
  }

  updateVisBackground(_name, _token, _classification){
    let vis = this
    vis.theMap.eachLayer(function (layer){
      vis.theMap.removeLayer(layer)
    })

    L.tileLayer.provider(_name, {
      accessToken: _token
    }).addTo(vis.theMap)

    L.svg({clickable:true}).addTo(vis.theMap)
    vis.overlay = d3.select(vis.theMap.getPanes().overlayPane)
    vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto")

    vis.updateVisColor(_classification)
    
    //handler here for updating the map, as you zoom in and out           
    vis.theMap.on("zoomend", function(){
      vis.updateVis();
    });
  }

  renderVis() {
    let vis = this;

    //not using right now... 
 
  }
}
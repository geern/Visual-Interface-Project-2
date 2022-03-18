class BarChart {
    constructor(_config, _data){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 400,
            margin: _config.margin || {top: 30, right: 100, bottom: 50, left: 100},
            class: _config.class || "none",
            title: _config.title,
            xLabel: _config.xLabel,
            yLabel: _config.yLabel,
            xValue: _config.xValue,
            yValue: _config.yValue
        }
        this.data = _data;
        this.initVis();
    }

    initVis(){
        let vis = this;
        
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr("height", vis.height + vis.config.margin.top + vis.config.margin.bottom)
            .append("g")
            .attr("transform",
            "translate(" + vis.config.margin.left + "," + vis.config.margin.top + ")");

        // X axis
        vis.xAxis = d3.scaleBand()
            .range([ 0, vis.width ])
            .domain(vis.data.map(function(d) { return d[vis.config.xValue]; }))
            .padding(0.2);

        vis.svg.append("g")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.xAxis))
            .selectAll("text")
            .attr("transform", "translate(-10,2)rotate(-65)")
            .style("text-anchor", "end");

        // Add Y axis
        vis.yAxis = d3.scaleLinear()
            .domain(d3.extent(vis.data, d => d[vis.config.yValue]))
            .range([ vis.height, 0]);
        vis.svg.append("g")
            .call(d3.axisLeft(vis.yAxis));

        d3.select(vis.config.parentElement).append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", (-1) * vis.config.containerHeight / 2)
            .attr("y", 50)
            .attr("transform", "rotate(-90)")
            .text(vis.config.yLabel);

        d3.select(vis.config.parentElement).append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", vis.config.containerWidth / 2)
            .attr("y", vis.config.containerHeight)
            .text(vis.config.xLabel);

        d3.select(vis.config.parentElement).append("text")
            .attr("class", "title label")
            .attr("text-anchor", "middle")
            .attr("x", vis.config.containerWidth / 2)
            .attr("y", 25)
            .text(vis.config.title);

        // Bars
        vis.svg.selectAll("bar")
            .data(vis.data)
            .enter()
        .append("rect")
            .attr("x", function(d) { return vis.xAxis(d[vis.config.xValue]); })
            .attr("y", function(d) { return vis.yAxis(d[vis.config.yValue]); })
            .attr("width", vis.xAxis.bandwidth())
            .attr("height", function(d) { return vis.height - vis.yAxis(d[vis.config.yValue]); })
            .attr("fill", "#69b3a2")

        //createing area for hovering years to display data
        vis.svg.selectAll("bar")
            .data(vis.data)
            .enter()
        .append("rect")
            .attr("x", function(d) { return vis.xAxis(d[vis.config.xValue]); })
            .attr("y", function(d) { return vis.yAxis(d3.extent(vis.data, d => d[vis.config.yValue])[1]); })
            .attr("width", vis.xAxis.bandwidth())
            .attr("height", function(d) { return vis.height})
            .attr("fill", "white")
            .style('opacity', 0.1)
            .on('mouseover', function(event,d) { //function to add mouseover event
                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", "yellow") //change the fill
                              .style('opacity', 0.25)
                            var html = () => {
                              var stringReturn = ``
                              stringReturn += `<div class="tooltip-label" "></div>`
                              stringReturn += `<ul>`
                              stringReturn += `<li>${vis.config.xValue}: ${d[vis.config.xValue]}</li>`
                              stringReturn += `<li>Samples Collected: ${d[vis.config.yValue]}</li>`
                              stringReturn += `</ul>`
                              return stringReturn
                            }
                            //create a tool tip
                            d3.select('#tooltip')
                                .style('opacity', 1)
                                .style('z-index', 1000000)
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
                              .attr("fill", "white") //change the fill

                            d3.select('#tooltip').style('opacity', 0);//turn off the tooltip

                          })

    }
}
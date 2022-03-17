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
            yLabel: _config.yLabel
        }
        this.data = _data;
        this.initVis();
    }

    initVis(){
        let vis = this;
        
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select("#timeLine")
            .append("svg")
            .attr("width", vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr("height", vis.height + vis.config.margin.top + vis.config.margin.bottom)
            .append("g")
            .attr("transform",
            "translate(" + vis.config.margin.left + "," + vis.config.margin.top + ")");

        // X axis
        vis.xAxis = d3.scaleBand()
            .range([ 0, vis.width ])
            .domain(vis.data.map(function(d) { return d.year; }))
            .padding(0.2);

        vis.svg.append("g")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.xAxis))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-65)")
            .style("text-anchor", "end");

        // Add Y axis
        vis.yAxis = d3.scaleLinear()
            .domain(d3.extent(vis.data, d => d.count))
            .range([ vis.height, 0]);
        vis.svg.append("g")
            .call(d3.axisLeft(vis.yAxis));

        d3.select("#timeLine").append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", (-1) * vis.config.containerHeight / 2)
            .attr("y", 50)
            .attr("transform", "rotate(-90)")
            .text(vis.config.yLabel);

        d3.select("#timeLine").append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", vis.config.containerWidth / 2)
            .attr("y", vis.config.containerHeight)
            .text(vis.config.xLabel);

        d3.select("#timeLine").append("text")
            .attr("class", "title label")
            .attr("text-anchor", "middle")
            .attr("x", vis.config.containerWidth / 2)
            .attr("y", 25)
            .text(vis.config.title);

        // Bars
        vis.svg.selectAll("mybar")
            .data(vis.data)
            .enter()
            .append("rect")
            .attr("x", function(d) { return vis.xAxis(d.year); })
            .attr("y", function(d) { return vis.yAxis(d.count); })
            .attr("width", vis.xAxis.bandwidth())
            .attr("height", function(d) { return vis.height - vis.yAxis(d.count); })
            .attr("fill", "#69b3a2")

        

    }
}
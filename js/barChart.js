class BarChart {
    constructor(_config, _data){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 400,
            margin: _config.margin || {top: 25, right: 100, bottom: 50, left: 100},
            class: _config.class || "none",
            title: _config.title
        }
        this.data = _data;
        this.initVis();
    }

    initVis(){
        let vis = this;

        var margin = {top: 30, right: 30, bottom: 70, left: 60}
        var width = 1850 - margin.left - margin.right
        var height = 300 - margin.top - margin.bottom;

        var svg = d3.select("#timeLine")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        // X axis
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(vis.data.map(function(d) { return d.year; }))
            .padding(0.2);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-65)")
            .style("text-anchor", "end");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain(d3.extent(vis.data, d => d.count))
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
            .data(vis.data)
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.year); })
            .attr("y", function(d) { return y(d.count); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.count); })
            .attr("fill", "#69b3a2")
    }
}
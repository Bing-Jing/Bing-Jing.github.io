// https://observablehq.com/@harrystevens/directly-labelling-lines@486
export default function define(runtime, observer) {
  const main = runtime.module();

  main.variable(observer()).define(["d3","DOM","width","height","margin","xAxisGenerator","chartHeight","yAxisGenerator","lineData","lineGenerator","xScale","last","yScale","flatData","cityColor","geometric","line","hover"], function*(d3,DOM,width,height,margin,xAxisGenerator,chartHeight,yAxisGenerator,lineData,lineGenerator,xScale,last,yScale,flatData,cityColor,geometric,line,hover)
{
  const svg = d3.select(DOM.svg(width, height));
  svg.append("text")
        .attr("x", width/2)             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("都市人口差");
  svg.append("text")
        .attr("class", "x label")
        .attr("x", width/2-100)
        .attr("y", height-10)
        .text("Day of Date");
  svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 0)
        .attr("x", -height/2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("人口差");
  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  g.append("g")
      .call(xAxisGenerator)
      .attr("transform", `translate(${-margin.left}, ${chartHeight})`);
  
  g.append("g")
      .call(yAxisGenerator);

      var size = 8
  svg.append("g")
      .selectAll("mydots")
  .data(cityColor)
  .enter().append("rect")
    .attr("x", width-120)
    .attr("y", function(d,i){ return 10 + i*(size+5)}) 
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", d => d.light)

  svg.append("g")
      .selectAll("mylabels")
  .data(cityColor)
  .enter()
  .append("text")
    .attr("x", width-100)
    .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)})
    .style("fill", d => d.light)
    .text(d => d.name).style("font", "12px sans-serif")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
      
      
      
//      console.log(cityColor[0].values)
  const path = svg.append("g")
      .selectAll("path")
      .data(cityColor)
      .join("path")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .style("mix-blend-mode", "multiply")
      .attr("stroke", d => d.light)
      .attr("d", d => line(d.values));


  svg.call(hover, path);

  yield svg.node();

  
}
);


  main.variable(observer()).define(["md"], function(md){return(
md`## Functions`
)});

 main.variable(observer("hover")).define("hover", ["d3","yScale","xScale","cityColor","dateData"], function(d3,y,x,cityColor,dateData){return(
     function hover(svg, path) {
      svg.style("position", "relative");

      if ("ontouchstart" in document) svg
          .style("-webkit-tap-highlight-color", "transparent")
          .on("touchmove", moved)
          .on("touchstart", entered)
          .on("touchend", left)
      else svg
          .on("mousemove", moved)
          .on("mouseenter", entered)
          .on("mouseleave", left);

      const dot = svg.append("g")
          .attr("display", "none");

      dot.append("circle")
          .attr("r", 2.5);

      dot.append("text")
          .style("font", "10px sans-serif")
          .attr("text-anchor", "middle")
          .attr("y", -8);
//         console.log(cityData);
      var Ym = d3.timeFormat("%Y-%m");
      function moved() {
        d3.event.preventDefault();
        const ym = y.invert(d3.event.layerY);
        const xm = x.invert(d3.event.layerX);
        const i1 = d3.bisectLeft(dateData, xm, 1);
        const i0 = i1 - 1;
        const i = xm - dateData[i0] > dateData[i1] - xm ? i1 : i0;
        const s = cityColor.reduce((a, b) => Math.abs(a.values[i] - ym) < Math.abs(b.values[i] - ym) ? a : b);
        path.attr("stroke", d => d === s ? d.light : "#ddd").filter(d => d === s).raise();
        dot.attr("transform", `translate(${x(dateData[i])},${y(s.values[i])})`);
        dot.select("text").text(s.name+" 人口差:"+s.values[i]+"\n"+"時間："+Ym(dateData[i]));
      }

      function entered() {
        path.style("mix-blend-mode", null).attr("stroke", d => d.light);
        dot.attr("display", null);
      }

      function left() {
        path.style("mix-blend-mode", "multiply").attr("stroke", d => d.light);
        dot.attr("display", "none");
      }
    }
)}); 
    
    
    
  main.variable(observer("xScale")).define("xScale", ["d3","chartWidth","margin"], function(d3,chartWidth,margin){return(
d3.scaleTime()
  .domain([new Date(2007, 3, 1), new Date(2019, 8, 1)])
  .range([margin.left, chartWidth])
)});
  main.variable(observer("yScale")).define("yScale", ["d3","chartHeight"], function(d3,chartHeight){return(
d3.scaleLinear()
  .domain([-15000, 30000])
  .range([chartHeight, 0])
)});
  main.variable(observer("xAxisGenerator")).define("xAxisGenerator", ["d3","xScale"], function(d3,xScale){return(
d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y"))
)});
  main.variable(observer("yAxisGenerator")).define("yAxisGenerator", ["d3","yScale"], function(d3,yScale){return(
d3.axisLeft(yScale)
  .tickValues(d3.range(-15000, 30000, 5000))
)});
  main.variable(observer("lineGenerator")).define("lineGenerator", ["d3","xScale","yScale"], function(d3,xScale,yScale){
      return(
d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.value))
)});
        main.variable(observer("line")).define("line", ["d3","xScale","dateData","yScale"], function(d3,x,dateData,y){return(
d3.line()
    .defined(d => !isNaN(d))
    .x((d, i) => x(dateData[i]))
    .y(d => y(d))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Data`
)});
  main.variable(observer("people")).define("people", ["d3"], async function(d3){
    const data = await d3.csv("./hw3.csv").then(function(data) {
         const dateset = new Set();
         const cityset = new Set();
         var diff = [];
      data.forEach(function(d) {
        dateset.add(d.Date);
        cityset.add(d["縣市"]);
        diff.push(+d["人口差"]);
      });
         var city = Array.from(cityset);
         var date = Array.from(dateset);
         var fulldata = [];
         var k = 0;
      for(var i = 0; i < date.length;i++){
          k = i;
          var tmp = {
                  Date:date[i]
              }
          for(var j = 0; j< city.length;j++){
              tmp[city[j]] = diff[k];
              k += 149;
          }
          fulldata.push(tmp);
          
      }
         return fulldata;
    });
//      console.log(data);
  return data;
});
    
  main.variable(observer("data")).define("data", ["parseData","people"], function(parseData,people){
      return(
parseData(people)
)});
  main.variable(observer("lineData")).define("lineData", ["parseLineData","data"], function(parseLineData,data){
      return(
parseLineData(data)
)});
  main.variable(observer("flatData")).define("flatData", ["parseFlatData","data"], function(parseFlatData,data){return(
parseFlatData(data)
)});
  main.variable(observer("colors")).define("colors",["dataPrepare"], function(dataPrepare){
      var colorArr = ["#20e4ff","#682a97","#388953","#86e682","#f4e6a6","#492d21","#54a76c","#1a289f","#5cdda6","#2f3751",
                      "#4e17ae","#f926a3","#ff2052","#ffbb20","#ff7420","#20ffb7","#20ff41","#2066ff","#fff952","#80f0f0",
                     "#f00aff","#ad475e","#900090"]
      var tmpcity = dataPrepare["city"];
      var color = {}
      for(var i = 0; i < tmpcity.length;i++){
          var a = colorArr[i];
          var b = colorArr[i];
          color[tmpcity[i]] = {light: a,dark: b}
      }
      return color;
  });
  main.variable(observer("parseData")).define("parseData", function(){return(
data => {
  const output = [];
  for (let i = 0, l = data.length; i < l; i++){
    let d = data[i],
        o = {},
        s = d.Date.split("-"),
        yyyy = +(s[0]),
        mm = s[1] - 1,
        dd = +s[2];
    o.date = new Date(yyyy, mm, dd);

    for (let col in d){
      if (col !== "Date"){
        o[col] = +d[col];
      }
    }
    
    output.push(o);
  }
//    console.log(output);
  return output;
}
)});
  main.variable(observer("parseLineData")).define("parseLineData", ["colors"], function(colors){return(
data => {
  const output = [];
  
  let i = 0;
  for (let col in data[0]){
    if (i > 0) {
      let o = {
        key: col, 
        light: colors[col].light,
        dark: colors[col].dark,
        data: []
      };
      
      for (let i0 = 0, l0 = data.length; i0 < l0; i0++){
        let d0 = data[i0];
        
        o.data.push({
          date: d0.date,
          value: d0[col]
        });
      }
      
      output.push(o);
    }
    i++;
  }
//    console.log(output);
  return output;
}
)});
  main.variable(observer("parseFlatData")).define("parseFlatData", ["colors"], function(colors){return(
data => {
  const output = [],
        columns = [];
  
  let i = 0;
  for (let col in data[0]){
    columns.push(col);
    if (i > 0) {
      for (let i0 = 0, l0 = data.length; i0 < l0; i0++){
        let d0 = data[i0];
        
        output.push({
          date: d0.date,
          value: d0[col],
          key: col,
          colors: colors[col]
        });
      }

    }
    i++;
  }
  
  output.columns = columns;
  return output;  
}
)});
  main.variable(observer("dataPrepare")).define("dataPrepare", ["d3"], async function(d3)
{
     const data = await d3.csv("./hw3.csv").then(function(data) {
         const dateset = new Set();
         const cityset = new Set();
         var diff = [];
      data.forEach(function(d) {
        dateset.add(d.Date);
        cityset.add(d["縣市"]);
        diff.push(+d["人口差"]);
      });
         var city = Array.from(cityset);
         var date = Array.from(dateset);
         var fulldata = [];
         var k = 0;
      for(var i = 0; i < city.length;i++){
          var tmp = {
              name:city[i],
//              date:[],
              values:[]
          };
          for(var j = 0;j < date.length;j++){
//              tmp["date"].push(date[j]);
              tmp["values"].push(diff[k]);
              k+= 1;
          }
          fulldata.push(tmp);
      }
         return {
             city:city,
             date:date,
             all:fulldata
        };
    });
//      console.log(data["date"]);
  return data;
}
);
  main.variable(observer("cityData")).define("cityData", ["dataPrepare"], async function(dataPrepare)
{
    return dataPrepare.all;
}
);
  main.variable(observer("cityColor")).define("cityColor", ["lineData"], function(lineData)
{
          var colorCity = [];
          for(var i = 0;i < lineData.length;i++){
              var tmp = {
                  name:lineData[i].key,
                  light:lineData[i].light,
                  dark:lineData[i].dark,
                  values:[]
              }
              for(var j = 0;j < Object.keys(lineData[0].data).length;j++){
                  tmp.values.push(lineData[i].data[j].value);
              }
              colorCity.push(tmp);
          }
//            console.log(colorCity);
    return colorCity;
}
);
  main.variable(observer("dateData")).define("dateData", ["data"], async function(data)
{
    var date = [];

    for(var i = 0;i < data.length;i++){
        date.push(data[i].date);
    }
    return date;
}
);
  
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width * .5
)});
  main.variable(observer("chartWidth")).define("chartWidth", ["width","margin"], function(width,margin){return(
width - margin.left - margin.right
)});
  main.variable(observer("chartHeight")).define("chartHeight", ["height","margin"], function(height,margin){return(
height - margin.top - margin.bottom
)});
  main.variable(observer("margin")).define("margin", function(){return(
{
  left: 80,
  bottom: 50,
  right: 50,
  top: 10
}
)});    
  main.variable(observer("last")).define("last", function(){return(
array => array[array.length - 1]
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("geometric")).define("geometric", ["require"], function(require){return(
require("geometric@1")
)});
  return main;
}

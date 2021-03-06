function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {

  //Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
  // Create a variable that holds the samples array. 
  var samples = data.samples;

  // Create a variable that filters the samples for the object with the desired sample number.
  var samplesFiltered = samples.filter(sampleObj => sampleObj.id == sample);
    
  //  Create a variable that holds the first sample in the array.
  var result = samplesFiltered[0];

  // Create variables that hold the otu_ids, otu_labels, and sample_values.
  otu_ids = result.otu_ids;
  otu_labels = result.otu_labels;
  sample_values = result.sample_values;

  // Create the yticks for the bar chart.
  // Hint: Get the the top 10 otu_ids and map them in descending order  
  //  so the otu_ids with the most bacteria are last. 
  var yticks = result.otu_ids.slice(0, 10).map(numericIds => {
    return 'OTU ' + numericIds;
  }).reverse();
  var xticks = result.sample_values.slice(0, 10).reverse();
  var ylabels = result.otu_labels.slice(0, 10).reverse();

  // Create the trace for the bar chart. 
  var trace1 = {
    x: xticks,
    y: yticks,
    text: ylabels,
    type: "bar",
    orientation: "h"
  }
  var barData = [trace1];
  // Create the layout for the bar chart. 
  var barLayout = {
    title: "TOP 10 Bacteria Cultures Found",
      
    };
  // Create the trace for the bubble chart.
  var trace1 = {
    x: xticks,
    y: yticks,
    text: ylabels,
    type: "bar",
    orientation: "h"
  }
  var trace2 = {
    x: otu_ids,  
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
        color: otu_ids,
        size: sample_values
      }
  }
  
  var bubbleData = [trace2];

  // Create the layout for the bubble chart.
  var bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
            showlegend: false,
  };

  // Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", barData, barLayout);
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
 });

 // Use d3.json to load and retrieve the samples.json file 
 d3.json("samples.json").then((data) => {
  var metadata = data.metadata;
  // Filter the data for the object with the desired sample number
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];
  var wash_freq = result.wfreq;
  var gaugeData = [
     {
       domain: { x: [0, 1], y: [0, 1] },
       value: wash_freq,
       title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week", font: {size: 18}},
       type: "indicator",
       mode: "gauge+number",
       gauge: {
         axis: { range: [null, 10]},
         bar: { color: "black" },
         steps: [
           { range: [0, 1], color: 'red' },
           { range: [1, 2], color: 'red' },
           { range: [2, 3], color: 'orange' },
           { range: [3, 4], color: 'orange' },
           { range: [4, 5], color: 'yellow' },
           { range: [5, 6], color: 'yellow' },
           { range: [6, 7], color: 'lightgreen' },
           { range: [7, 8], color: 'lightgreen' },
           { range: [8, 9], color: 'green' },
           { range: [9, 10], color: 'green' }
         ],
       }  
     }
  ];
 var gaugeLayout = {
    width: 600, height: 450, margin: { t: 0, b: 0 } 
  
    };
  Plotly.newPlot("gauge", gaugeData, gaugeLayout)

  });
}

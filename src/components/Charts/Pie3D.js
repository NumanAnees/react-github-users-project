// STEP 1 - Include Dependencies
// Include react
import React from "react";

// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Include the chart type
import Column2D from "fusioncharts/fusioncharts.charts";

// Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

// STEP 2 - Chart Data

// STEP 3 - Creating the JSON object to store the chart configurations

const ChartComponent = ({ data }) => {
  const chartConfigs = {
    type: "pie2d", // The chart type
    width: "100%", // Width of the chart
    height: "500", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        caption: "Languages",
        doughnutRadius: "45%",
        theme: "fusion",
        paletteColors:
          "#F51720,#9902f0,#e302c9,#00fa68,#00e8cd,#741AAC,#0000FF,#f53c2f",
      },
      // Chart Data
      data: data,
    },
  };

  return <ReactFC {...chartConfigs} />;
};

export default ChartComponent;

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Plotly?: typeof import('plotly.js');
  }
}

interface PlotlyChartProps {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
}

const PlotlyChart: React.FC<PlotlyChartProps> = ({ data, layout }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializePlot = () => {
      if (chartRef.current && window.Plotly) {
        window.Plotly.newPlot(chartRef.current, data, layout, {
          responsive: true,
          autosizable: true,
          displayModeBar: false
        });
      }
    };

    // Directly attempt initialization
    if (window.Plotly) {
      initializePlot();
    } else {
      // Listen for script load event from HTML
      window.addEventListener('plotly-loaded', initializePlot);
    }

    return () => {
      // Cleanup
      if (chartRef.current && window.Plotly) {
        window.Plotly.purge(chartRef.current);
      }
      window.removeEventListener('plotly-loaded', initializePlot);
    };
  }, [data, layout]);

  return <div ref={chartRef} style={{ width: '100%' }} />;
};

export default PlotlyChart;
 

// import React from 'react';
// import Plot from 'react-plotly.js';

// interface PlotlyScatterProps {
//   data: Plotly.Data[];
//   layout?: Partial<Plotly.Layout>;
//   config?: Partial<Plotly.Config>;
// }

// const PlotlyScatterChart: React.FC<PlotlyScatterProps> = ({
//   data,
//   layout = {},
//   config = {}
// }) => {
//   return (
//     <div className="plot-container">
//       <Plot
//         data={data}
//         layout={{
//           ...layout,
//           autosize: true,
//           // responsive: true
//         }}
//         config={{
//           responsive: true,
//           ...config
//         }}
//         useResizeHandler
//         style={{ width: '100%', height: '100%', minHeight: '500px' }}
//       />
//     </div>
//   );
// };

// export default PlotlyScatterChart;

// PlotlyScatterChart.tsx
// import React, { useEffect, useRef } from 'react';
//
// declare global {
//   interface Window {
//     Plotly: typeof import('plotly.js');
//   }
// }
//
// interface PlotlyScatterChartProps {
//   data: Plotly.Data[];
//   layout: Partial<Plotly.Layout>;
//   // config?: Partial<Plotly.Config>;
// }
//
// const PlotlyScatterChart: React.FC<PlotlyScatterChartProps> = ({
//   data,
//   layout = {},
//   // config = {}
// }) => {
//   const chartRef = useRef<HTMLDivElement>(null);
//
//   useEffect(() => {
//     // Load Plotly from CDN
//     const script = document.createElement('script');
//     script.src = 'https://cdn.plot.ly/plotly-2.24.1.min.js';
//     script.onload = () => {
//       if (chartRef.current) {
//         window.Plotly.newPlot(chartRef.current, data, layout, {
//           responsive: true,
//           autosizable: true,
//            displayModeBar: false
//         });
//       }
//     };
//     document.body.appendChild(script);
//
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [data, layout]);
//
//   return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
// };
//
// export default PlotlyScatterChart;
 

// export default ScatterChart;
 

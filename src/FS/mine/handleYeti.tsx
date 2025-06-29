import React from 'react';
import PlotlyChart from './plotlyPlot.tsx';

const handleYeti = (

    data: any[][], // the spreadsheet data in 2d array
   showDialog: (
         content: string | React.ReactNode,
               type?: "ok" | "yesno",
                     onOk?: () => void ,
                               onCancel?: () => void 
   )=>void,

) => {
  const data2: Plotly.Data[] = [
    {
      x: ["sdf", "sf", "ef"],
      y: [10, 20, 30],
      type: 'bar'
    }
  ];
  const layout = {
      width:400,
      height:400,
    title: { text: 'Dynamic Chart Example' },
    xaxis: { title: { text: 'X Axis' } },
    yaxis: { title: { text: 'Y Axis' } }
  };

  showDialog(
      (
    <div className="textboxs">
      <h3>Dynamic Plotly Chart</h3>
      <p>There should be not co-existance. The number three is chilling. The most soulness mention that if you tired yourself to the orbit.</p>
      <PlotlyChart data={data2} layout={layout} />
      <p>There should be not co-existance. The number three is chilling. The most soulness mention that if you tired yourself to the orbit.</p>
    </div>
      ),
      "ok"
  );
};

export default handleYeti;
 

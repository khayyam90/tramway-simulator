import { Simulator } from "./lib/simulator";
import { Tramway } from "./lib/tramway";
import { RealTimeGraph } from "./RealTimeGraph";

function generateTramwayLine(nbStations = 20): string[]{
  const desc: string[] = [];

  for (let i = 0; i < nbStations ; i++){
    const duration = 40 + Math.floor(Math.random() * 20);

    desc.push(`node station${i} STATION ${duration}`);  
    
    if (i + 1 < nbStations){
      const duration = 50 + Math.floor(Math.random() * 20);
      desc.push(`node track${i} TRACK ${duration}`);    
    }
  }

  for (let i = 0; i < nbStations-1 ; i++){
    desc.push(`link station${i} track${i} UP`);
    desc.push(`link track${i} station${i} DOWN`);

    desc.push(`link track${i} station${i+1} UP`);
    desc.push(`link station${i+1} track${i} DOWN`);        
  }

  return desc;
}

function main(){
  const desc = generateTramwayLine();

  const div = document.getElementById('simulator') as HTMLDivElement;

  const simulator = new Simulator(1000, desc, div);
  const graph = new RealTimeGraph('graph');

  simulator.onTramFinished((tram: Tramway) => {
    graph.addValue(tram.getTripTime());
    const d = document.createElement('div');
    d.innerHTML = "" + tram.getTripTime();
    
    document.getElementById('output').appendChild(d);
  });

  simulator.startTramway();
}

addEventListener("load", main);
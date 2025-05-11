import { AbstractActor } from "./abstract-actor";
import { GraphNode } from "./graph-node";
import { Directions } from "./simulator";

export class Graph<T extends AbstractActor>{
  protected nodes: Array<GraphNode<T>> = [];
  protected entryNode?: GraphNode<T> = undefined;
  protected endNode?: GraphNode<T> = undefined;

  constructor(desc: string[][], htmlZone: HTMLDivElement){
    desc.forEach(line => {
      const method = line[0];
      switch(method){
        case 'node':{
          const htmlDiv = document.createElement('div');
          htmlDiv.classList.add('node');

          const type = line[2] == 'STATION' ? 'STATION' : 'TRACK';

          const div1 = document.createElement('div');
          div1.classList.add(type);

          const div2 = document.createElement('div');

          htmlDiv.appendChild(div1);
          htmlDiv.appendChild(div2);


          htmlZone.appendChild(htmlDiv);

          const n = new GraphNode<T>(line[1], type, parseInt(line[3]), div2);
          this.nodes.push(n);
          break;
        }
        case 'link': {
          const nodeA = this.getNodeByName(line[1]);
          const nodeB = this.getNodeByName(line[2]);
          const direction = line[3];
          const duration = parseInt(line[4]);

          if (nodeA && nodeB && direction){
            nodeA.connectToNextNode(nodeB, direction, duration);
          }else{
            console.error('bad node description', line);
          }
          break;
        }
        case 'entry': {
          const node = this.getNodeByName(line[1]);
          if (!node){
            console.error('unknown entry node', line);
          }else{
            this.entryNode = node;
          }
          break;
        }
        case 'end': {
          const node = this.getNodeByName(line[1]);
          if (!node){
            console.error('unknown entry node', line);
          }else{
            this.endNode = node;
          }
          break;
        }
      }
    });

    // first station is entryPoint
    const firstStation = this.nodes.filter(n => n.name.toUpperCase().indexOf('STATION') >= 0)[0];
    this.entryNode = firstStation;

    // lastStation is endPoint
    const lastStation = this.nodes.filter(n => n.name.toUpperCase().indexOf('STATION') >= 0).reverse()[0];
    this.endNode = lastStation;
  }

  public getNodeByName(name: string): GraphNode<T> | undefined{
    return this.nodes.find(n => n.name === name);
  }

  public getEntryPoint(){
    return this.entryNode!;
  }

  public getEndPoint(){
    return this.endNode!;
  }

  public isNextNodeAvailable(node: GraphNode<T>, direction: Directions){
    const next = node.getNextNode(direction);
    if (!next){
      console.error(`cannot get next node for ${node.name}`);
      return false;
    }else{
      if (next.canWelcomeOnemoreActor(direction)){
        return true;
      }else{
        return false;
      }
    }
  }
}
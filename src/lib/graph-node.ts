import { AbstractActor } from "./abstract-actor";
import { Directions } from "./simulator";

export class GraphNode<T extends AbstractActor>{
	protected actors : Array<{value: T, direction: Directions}> = [];

  constructor(public name: string, public type: 'TRACK' | 'STATION', public duration: number, public htmlZone: HTMLDivElement){
  }

  public canWelcomeOnemoreActor(direction: Directions){
    if (this.type === 'TRACK'){
      return this.actors.length === 0;
    }else{
      return this.actors.filter(a => a.direction === direction).length === 0;
    }   
  }

  public welcomeActor(actor: T){
    this.actors.push({ value: actor, direction: actor.direction });

    if (actor.currentNode){
      actor.currentNode.removeActor(actor);
    }

    actor.currentNode = this;	
    this.htmlZone.innerHTML = this.getText();	
  }

  public removeActor(actor: T){
    this.actors = this.actors.filter(t => t.value != actor);
    this.htmlZone.innerHTML = this.getText();
  }

  protected linkedNodes = new Map<string, { node: GraphNode<T>, duration: number }>();

  public connectToNextNode(node: GraphNode<T>, direction: string, duration: number){		
    this.linkedNodes.set(direction, { node, duration });
  }
	
  public getNextNode(direction: string): GraphNode<T> | undefined{
    const directionNode = this.linkedNodes.get(direction);
    if (directionNode){
      return directionNode.node;
    }else{
      return undefined;
    }		
  }

  private getText(){
    return this.actors.map(a => {
      return a.value.name + ' ' + (a.value.direction === 'DOWN' ? '▲' : '▼') + (a.value.status === 'WAITING' ? '!':'');
    }).join(",");
  }
}
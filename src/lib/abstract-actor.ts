import { GraphNode } from "./graph-node";
import { Directions } from "./simulator";

export abstract class AbstractActor{
	constructor(public direction: Directions, public name: string){
	}

	public currentNode: GraphNode<AbstractActor>;
	public status : 'TRACK' | 'STATION' | 'WAITING' = 'STATION';
}
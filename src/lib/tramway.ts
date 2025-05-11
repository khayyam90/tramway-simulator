import { AbstractActor } from "./abstract-actor";
import { GraphNode } from "./graph-node";
import { Directions } from "./simulator";

export class Tramway extends AbstractActor{
	protected cumulativeWaitTime = 0;
	protected tripDuration = 0;

	constructor(direction: Directions, public currentNode: GraphNode<Tramway>,  name: string){
		super(direction, name);
	}

	public addWaitTime(time: number){
		this.cumulativeWaitTime += time;
	}

	public getCumulativeWaitTime(){
		return this.cumulativeWaitTime;
	}

	public addTripTime(time: number){
		this.tripDuration += time;
	}

	public getTripTime(){
		return this.tripDuration;
	}
}
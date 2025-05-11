import { Graph } from "./graph";
import { GraphNode } from "./graph-node";
import { Tramway } from "./tramway";

export type Directions = 'DOWN' | 'UP';

export class Simulator{
    protected graph: Graph<Tramway>;
    constructor(protected speedFactor: number, desc: string[], htmlZone: HTMLDivElement){
        this.graph = new Graph<Tramway>(desc.map(line => line.split(' ')), htmlZone);
    }

    protected trams = new Array<Tramway>();
    protected autoStart = document.getElementById('autoStart') as HTMLInputElement;

    public startTramway(){
        const entryPoint = this.graph.getEntryPoint();

        const tram = new Tramway('UP', undefined, this.getNewTramName());
        if (entryPoint!.canWelcomeOnemoreActor('UP')){
            entryPoint!.welcomeActor(tram);
            this.findNextStateForTram(tram);
        }else{
            console.warn(`Node ${entryPoint!.name} cannot welcome more`);
        }

        const endPoint = this.graph.getEndPoint();
        const tram2 = new Tramway('DOWN', undefined, this.getNewTramName());
        if (endPoint.canWelcomeOnemoreActor('DOWN')){
            endPoint.welcomeActor(tram2);
            this.findNextStateForTram(tram2);
        }else{
            console.warn(`Node ${endPoint!.name} cannot welcome more`);
        }

        this.trams.push(tram);
        this.trams.push(tram2);

        setTimeout(() => this.startTramway(), (100 - parseInt(this.autoStart.value)) * 100);
    }

    public createTram(node: GraphNode<Tramway>, direction: Directions){
        const tram = new Tramway(direction, node, this.getNewTramName());

        if (node.canWelcomeOnemoreActor(direction)){
            node.welcomeActor(tram);
            tram.status = node.type;
            this.trams.push(tram);

            this.findNextStateForTram(tram);
        }else{
            console.warn(`Node ${node.name} cannot welcome more`);
        }
    }


    // to be triggered as soon as the tram enters a new node
    protected findNextStateForTram(tram: Tramway){
        const currentNode = tram.currentNode;
        switch(tram.status){
            case 'TRACK':                
                setTimeout(() => {
                    tram.addTripTime(currentNode!.duration);

                    // enter the next station
                    const nextNode = currentNode!.getNextNode(tram.direction);
                    if (nextNode){
                        if (nextNode.canWelcomeOnemoreActor(tram.direction)){
                            nextNode.welcomeActor(tram);
                            tram.status = nextNode.type;                            
                        }else{
                            tram.addWaitTime(1000 / this.speedFactor);
                            tram.status = 'WAITING';
                        }
                        this.findNextStateForTram(tram);
                    }else{
                        console.error(`Cannot find next node after ${currentNode!.name}`);
                    }
                }, currentNode!.duration * 1000 / this.speedFactor);
                break;
            case 'STATION':
                setTimeout(() => {
                    tram.addTripTime(currentNode!.duration);

                    // able to leave the station ?
                    const nextNode = currentNode!.getNextNode(tram.direction);
                    const nextNextNode = nextNode?.getNextNode(tram.direction);
                    if (nextNode && nextNextNode){
                        if (nextNode.canWelcomeOnemoreActor(tram.direction) && nextNextNode.canWelcomeOnemoreActor(tram.direction)){
                            nextNode.welcomeActor(tram);
                            tram.status = nextNode.type;                            
                        }else{
                            tram.addWaitTime(1000 / this.speedFactor);
                            tram.status = 'WAITING';
                        }
                        this.findNextStateForTram(tram);
                    }else{
                        // tram has ended its trip
                        currentNode!.removeActor(tram);
                        this.tramFinishedCallback?.(tram);
                        console.log(`Tram has finished with total waiting time = ${tram.getCumulativeWaitTime()}`);
                        this.trams = this.trams.filter(t => t != tram);
                    }

                }, currentNode!.duration * 1000 / this.speedFactor);
                break;
            case 'WAITING':
                setTimeout(() => {
                    tram.addTripTime(5);

                    const nextNode = currentNode!.getNextNode(tram.direction);
                    const nextNextNode = nextNode?.getNextNode(tram.direction);
                    if (nextNode && nextNextNode){
                        if (nextNode.canWelcomeOnemoreActor(tram.direction) && nextNextNode.canWelcomeOnemoreActor(tram.direction)){
                            nextNode.welcomeActor(tram);
                            tram.status = nextNode.type;                            
                        }else{
                            tram.addWaitTime(1);
                            tram.status = 'WAITING';
                        }
                        this.findNextStateForTram(tram);
                    }else{
                        console.error(`Cannot find next node after ${currentNode!.name}`);
                    }
                }, 5000 / this.speedFactor);
                break;
        }
    }


    public getNewTramName(){
        return "Tram" + Math.floor(Math.random() * 1000);
    }

    protected tramFinishedCallback: (t: Tramway) => void = null;
    public onTramFinished(callback: (t: Tramway) => void){
        this.tramFinishedCallback = callback;
    }
}
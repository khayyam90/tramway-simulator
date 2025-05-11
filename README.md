# tramway-simulator
Simulator for single track railroad. The tramways can only cross when waiting at a station.

```
    /-----\          /-----\         /-----\
----Station----------Station---------Station------
    \-----/          \-----/         \-----/
```



The aim of this project is to measure the trip time loss between two configurations : 
* a single tramway line with 2 parallel tracks
* a single tramway line with only one track between stations and 2 tracks only at the stations

The simulation parameters are : 
* number of stations in the line (measured with 20 stations)
* trip time between two stations : considered randomly between 50s and 70s
* waiting time at each station : considered randomly between 40s and 60s

The simulators allows to speed up the tramways and to add more simultaneous tramways on the line. Of course with more tramways, they will need more waiting time before a track is available. 

### Considered situations for 20 stations

* 4 simultaneous tramways on each direction
* 5 simultaneous tramways on each direction
* 7 simultaneous tramways on each direction
* 17 simultaneous tramways on each direction (saturation)

### Results
![Diagram](./results.hbar.png "Results").
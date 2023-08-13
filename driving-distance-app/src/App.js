import React, { useState } from 'react';
import './App.css';
import MapComponent from './MapComponent';



function App() {
  
  const [startState, setStartState] = useState('');
  const [goalState, setGoalState] = useState('');
  const [bfsSln, setBfsSln] = useState('');
  const [abfsSln, setAbfsSln] = useState('');
  const [bfsTime, setBfsTime] = useState('');
  const [abfsTime, setAbfsTime] = useState('');
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = {
      "startState": startState,
      "goalState": goalState 
    };
    try {
      await fetch('http://localhost:5000/', {   //local-host endpoint api (back-end)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
        .then((res) => res.json())
        .then((data) => {
          const smt = JSON.parse(data.data);
          const { GBFS, ABFS } = smt;
          // console.log(data, params, GBFS.slnObj);    
          // const gbfsSlnPath = GBFS.slnObj.slnPath;
          // const gbfsThroughStates = GBFS.slnObj.throughStates;
          // const gbfsExpNodes = GBFS.slnObj.expNodes;
          // const gbfsPathCost = GBFS.slnObj.pathCost;
  
          setBfsSln(GBFS.slnObj);
          setAbfsSln(ABFS.slnObj);
          setBfsTime(GBFS.time);
          setAbfsTime(ABFS.time);
          setStartState('');
          setGoalState('');
        });
    } catch (error) {
      console.error('Error:', error);
      // Handle error if necessary
    }
  };

  const handleUpdateState = (stateName) => {
    if (startState === '') {
      setStartState(stateName);
    } else if (goalState === '') {
      setGoalState(stateName);
    }
  };
  return (
    <div className="App">
      <h1>Optimal Path Calculator</h1>
  
            <div class="w-full max-w-xs">
        <form onSubmit={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
              Start State: &nbsp;
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="startState" placeholder="CA" value={startState}
                  onChange={(e) => setStartState(e.target.value)} />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Goal State: &nbsp;
            </label>
            <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="goalState" value={goalState}
                  onChange={(e) => setGoalState(e.target.value)} placeholder="NY" />
            <p class="text-red-500 text-xs italic">Please select Start and Goal States.</p>
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Calculate Distance
            </button>
            <button onClick={() => {setStartState(''); setGoalState('');}}>Clear</button>
          </div>
        </form>
        </div>
      

      <MapComponent onUpdateState={handleUpdateState} />
      <div>
        <span className="title">Greedy Breadth First Search Solution </span>
        <pre>Path-taken: {JSON.stringify(bfsSln.slnPath, null, 0)}</pre> 
        <pre>
          Nodes-Expanded: {JSON.stringify(bfsSln.expNodes, null, 0)} Nodes
          Path-Cost: {JSON.stringify(bfsSln.pathCost, null, 0)} miles
          Time: {JSON.stringify((bfsTime * 10000 * -1).toFixed(3), null, 0)} microseconds
        </pre> 

      </div>
      <div>
        <span className="title">A* Breadth First Search Solution </span> <br />
        <span>Most well known Artificial Intelligence Algorithm</span>
        <pre>Path-taken: {JSON.stringify(abfsSln.slnPath, null, 0)}</pre> 
        <pre>
          Nodes-Expanded: {JSON.stringify(abfsSln.expNodes, null, 0)} Nodes
          Path-Cost: {JSON.stringify(abfsSln.pathCost, null, 0)} miles
          Time: {JSON.stringify((abfsTime * 10000 * -1).toFixed(3), null, 0)} microseconds
        </pre> 
      </div>
    </div>
  );
}

export default App;
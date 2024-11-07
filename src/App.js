import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import GraphCanvas from './GraphCanvas';

function App() {
    const [numNodes, setNumNodes] = useState(5); // Updated state name
    const [initialNode, setInitialNode] = useState(0); // Changed to initialNode
    const [graph, setGraph] = useState([]);
    const [mstEdges, setMstEdges] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [explanation, setExplanation] = useState('');

    const generateGraph = () => {

        if (numNodes < 5 || numNodes > 15) {
            alert("Please enter a number of nodes between 5 and 15."); // Alert for invalid input
            return;
        }

        if (initialNode < 0 || initialNode >= numNodes) {
            alert("Please select an initial node between 0 and " + (numNodes - 1) + "."); // Alert for invalid initial node
            return;
        }

        const newGraph = Array.from({ length: numNodes }, () => Array(numNodes).fill(0));
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                const weight = Math.floor(Math.random() * 10) + 1;
                newGraph[i][j] = weight;
                newGraph[j][i] = weight;
            }
        }

        const T = [];
        const visited = new Set([initialNode]);
        const newSteps = [];

        while (visited.size < numNodes) {
            let minWeight = Infinity;
            let minEdge = null;

            for (let u of visited) {
                for (let v = 0; v < numNodes; v++) {
                    if (!visited.has(v) && newGraph[u][v] > 0 && newGraph[u][v] < minWeight) {
                        minWeight = newGraph[u][v];
                        minEdge = { u, v, weight: newGraph[u][v] };
                    }
                }
            }

            if (minEdge) {
                T.push(minEdge);
                newSteps.push({
                    edge: minEdge,
                    explanation: `Step ${newSteps.length + 1}: Selected edge (${minEdge.u}, ${minEdge.v}) with weight ${minEdge.weight} because it's the minimum weight edge connecting a visited node (${minEdge.u}) to an unvisited node (${minEdge.v}).`
                });
                visited.add(minEdge.v);

        } else {
                break;
            }
        }

        setGraph(newGraph);
        setMstEdges(T);
        setSteps(newSteps);
        setCurrentStep(0);
        setSelectedNode(null);
        setSelectedEdge(null);
        setExplanation('');
    };

    const playAlgorithm = () => {
        if (currentStep < steps.length) {
            const currentStepData = steps[currentStep];
            setSelectedNode(currentStepData.edge.v);
            setSelectedEdge(currentStepData.edge);
            setExplanation(currentStepData.explanation);
            setCurrentStep((prev) => prev + 1);
        } else {
            setIsPlaying(false);
            setSelectedNode(null);
            setSelectedEdge(null);
            setExplanation('');
        }
    };

    const handlePlayPause = () => {
        if (!isPlaying) {
            if (currentStep >= steps.length) {
                setCurrentStep(0);
                setSelectedNode(null);
                setSelectedEdge(null);
                setExplanation('');
            }
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(playAlgorithm, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Prim's Algorithm Visualizer
            </Typography>
            <Box display="flex" justifyContent="center" mb={2}>
                <TextField
                    label="Number of Nodes (5-15)" // Updated label
                    type="number"
                    value={numNodes}
                    onChange={(e) => setNumNodes(Number(e.target.value))}
                    inputProps={{ min: 5, max: 15 }}
                    sx={{ width: '220px', marginRight: 2 }} // Adjusted width
                />
                <TextField
                    label="Initial Node (0 to 14)" // Updated label
                    type="number"
                    value={initialNode}
                    onChange={(e) => setInitialNode(Number(e.target.value))}
                    inputProps={{ min: 0, max: 14 }}
                    sx={{ width: '220px', marginRight: 2 }} // Adjusted width
                />

                <Button variant="contained" color="primary" onClick={generateGraph}>
                    Generate Graph
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handlePlayPause}
                    sx={{ marginLeft: 2 }}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </Button>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <Box flex={1}>
                    <Typography variant="h6" align="center">Original Graph</Typography>
                    <GraphCanvas graph={graph} mstEdges={[]} showWeights={true} selectedNode={selectedNode} selectedEdge={selectedEdge} />
                </Box>
                <Box flex={1}>
                    <Typography variant="h6" align="center">Minimum Spanning Tree</Typography>
                    <GraphCanvas graph={graph} mstEdges={mstEdges} showWeights={true} selectedNode={selectedNode} selectedEdge={selectedEdge} />
                </Box>
            </Box>
            <Typography variant="subtitle1" align="center" style={{ marginTop: '10px' }}>{explanation}</Typography>
            <List sx={{ overflow: 'auto', mt: 3 }}>
                {steps.map((step, index) => (
                    <ListItem
                        key={index}
                        selected={index === currentStep - 1} // Highlight if it's the current step
                        sx={{
                            backgroundColor: index === currentStep - 1 ? 'lightblue' : 'transparent', // Highlight color
                            transition: 'background-color 0.3s', // Smooth transition
                        }}
                    >
                        <ListItemText primary={step.explanation} />
                    </ListItem>
                ))}
            </List>


        </Container>
    );
}

export default App;

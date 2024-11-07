import React from 'react';
import { Stage, Layer, Line, Circle, Text } from 'react-konva';

const GraphCanvas = ({ graph, mstEdges, showWeights, selectedNode, selectedEdge }) => {
    const vertexCount = graph.length;
    const nodeRadius = 20;
    const angleStep = (2 * Math.PI) / vertexCount;
    const radius = 150; // Radius of the circle for node placement

    // Calculate node positions in a circular layout
    const nodePositions = Array.from({ length: vertexCount }, (_, index) => ({
        x: Math.cos(index * angleStep) * radius + 200,
        y: Math.sin(index * angleStep) * radius + 200,
    }));

    return (
        <Stage width={400} height={400}>
            <Layer>
                {/* Original Graph */}
                {graph.map((edges, u) =>
                    edges.map((weight, v) =>
                        weight > 0 && u < v ? (
                            <React.Fragment key={`${u}-${v}`}>
                                <Line
                                    points={[
                                        nodePositions[u].x,
                                        nodePositions[u].y,
                                        nodePositions[v].x,
                                        nodePositions[v].y,
                                    ]}
                                    stroke="gray"
                                    strokeWidth={2}
                                />
                                {showWeights && (
                                    <Text
                                        x={(nodePositions[u].x + nodePositions[v].x) / 2}
                                        y={(nodePositions[u].y + nodePositions[v].y) / 2}
                                        text={weight.toString()}
                                        fontSize={15}
                                        fill="black"
                                    />
                                )}
                            </React.Fragment>
                        ) : null
                    )
                )}

                {/* Minimum Spanning Tree */}
                {mstEdges.map((edge, index) => (
                    <React.Fragment key={`mst-${index}`}>
                        <Line
                            points={[
                                nodePositions[edge.u].x,
                                nodePositions[edge.u].y,
                                nodePositions[edge.v].x,
                                nodePositions[edge.v].y,
                            ]}
                            stroke={selectedEdge && selectedEdge.u === edge.u && selectedEdge.v === edge.v ? 'red' : 'green'}
                            strokeWidth={4}
                        />
                        {showWeights && (
                            <Text
                                x={(nodePositions[edge.u].x + nodePositions[edge.v].x) / 2}
                                y={(nodePositions[edge.u].y + nodePositions[edge.v].y) / 2}
                                text={edge.weight.toString()}
                                fontSize={15}
                                fill={selectedEdge && selectedEdge.u === edge.u && selectedEdge.v === edge.v ? 'red' : 'green'}
                            />
                        )}
                    </React.Fragment>
                ))}

                {/* Nodes */}
                {graph.map((_, index) => (
                    <React.Fragment key={index}>
                        <Circle
                            x={nodePositions[index].x}
                            y={nodePositions[index].y}
                            radius={nodeRadius}
                            fill={selectedNode === index ? 'red' : 'lightblue'}
                        />
                        <Text
                            x={nodePositions[index].x - 5}
                            y={nodePositions[index].y - 10}
                            text={index.toString()}
                            fontSize={15}
                        />
                    </React.Fragment>
                ))}
            </Layer>
        </Stage>
    );
};

export default GraphCanvas;

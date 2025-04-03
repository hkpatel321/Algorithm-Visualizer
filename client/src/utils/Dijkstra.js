const dijkstra = (grid, startNode, endNode) => {
    const visitedNodesInOrder = [];

    for (const row of grid) {
        for (const node of row) {
            node.distance = Infinity;
            node.isVisited = false;
            node.previousNode = null;
        }
    }

    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === endNode) return visitedNodesInOrder;

        updateUnvisitedNeighbors(closestNode, grid);
    }
    return visitedNodesInOrder;
};

const getAllNodes = (grid) => {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
};

const sortNodesByDistance = (unvisitedNodes) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

const updateUnvisitedNeighbors = (node, grid) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        const newDistance = node.distance + neighbor.weight;
        if (newDistance < neighbor.distance) {
            neighbor.distance = newDistance;
            neighbor.previousNode = node;
        }
    }
};

const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const { col, row } = node;

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.isVisited);
};

const getNodesInShortestPathOrder = (endNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;

    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    return nodesInShortestPathOrder;
};

const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder, speed = 50) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
                animateShortestPath(nodesInShortestPathOrder, speed);
            }, speed * i);
            return;
        }

        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            const element = document.getElementById(`node-${node.row}-${node.col}`);

            if (element && !element.classList.contains('bg-gradient-to-r')) {
                element.style.transition = 'all 0.3s ease';
                element.style.backgroundColor = 'rgba(147, 51, 234, 0.5)';
            }
        }, speed * i);
    }
};

const animateShortestPath = (nodesInShortestPathOrder, speed = 50) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            const element = document.getElementById(`node-${node.row}-${node.col}`);

            if (element && !element.classList.contains('bg-gradient-to-r')) {
                element.style.transition = 'all 0.3s ease';
                element.style.backgroundColor = 'rgba(236, 72, 153, 0.7)';
            }
        }, speed * i);
    }
};

export { dijkstra, getNodesInShortestPathOrder, animateDijkstra };

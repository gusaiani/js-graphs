/*
 * http://blog.benoitvallon.com/data-structures-in-javascript/the-graph-data-structure/
 */
function Graph() {
  this.vertices = [];
  this.edges = [];
  this.numberOfEdges = 0;
}

Graph.prototype.addVertex = function(vertex) {
  this.vertices.push(vertex);
  this.edges[vertex] = [];
};
Graph.prototype.removeVertex = function(vertex) {
  var index = this.vertices.indexOf(vertex);
  if(~index) {
    this.vertices.splice(index, 1);
  }
  while(this.edges[vertex].length) {
    var adjacentVertex = this.edges[vertex].pop();
    this.removeEdge(adjacentVertex, vertex);
  }
};
Graph.prototype.addEdge = function(vertex1, vertex2) {
  this.edges[vertex1].push(vertex2);
  this.edges[vertex2].push(vertex1);
  this.numberOfEdges++;
};
Graph.prototype.removeEdge = function(vertex1, vertex2) {
  var index1 = this.edges[vertex1] ? this.edges[vertex1].indexOf(vertex2) : -1;
  var index2 = this.edges[vertex2] ? this.edges[vertex2].indexOf(vertex1) : -1;
  if(~index1) {
    this.edges[vertex1].splice(index1, 1);
    this.numberOfEdges--;
  }
  if(~index2) {
    this.edges[vertex2].splice(index2, 1);
  }
};
Graph.prototype.size = function() {
  return this.vertices.length;
};
Graph.prototype.relations = function() {
  return this.numberOfEdges;
};

// Traverse Depth First Search
Graph.prototype.traverseDFS = function(vertex, fn) {
  if(!~this.vertices.indexOf(vertex)) {
    return console.log('Vertex not found');
  }
  var visited = [];
  this._traverseDFS(vertex, visited, fn);
};
Graph.prototype._traverseDFS = function(vertex, visited, fn) {
  visited[vertex] = true;
  if(this.edges[vertex] !== undefined) {
    fn(vertex);
  }
  for(var i = 0; i < this.edges[vertex].length; i++) {
    if(!visited[this.edges[vertex][i]]) {
      this._traverseDFS(this.edges[vertex][i], visited, fn);
    }
  }
};

// Traverse Breadth First Search
Graph.prototype.traverseBFS = function(vertex, fn) {
  if(!~this.vertices.indexOf(vertex)) {
    return console.log('Vertex not found');
  }
  var queue = [];
  queue.push(vertex);
  var visited = [];
  visited[vertex] = true;

  while(queue.length) {
    vertex = queue.shift();
    fn(vertex);
    for(var i = 0; i < this.edges[vertex].length; i++) {
      if(!visited[this.edges[vertex][i]]) {
        visited[this.edges[vertex][i]] = true;
        queue.push(this.edges[vertex][i]);
      }
    }
  }
};

Graph.prototype.pathFromTo = function(vertexSource, vertexDestination) {
  if(!~this.vertices.indexOf(vertexSource)) {
    return console.log('Vertex not found');
  }
  var queue = [];
  queue.push(vertexSource);
  var visited = [];
  visited[vertexSource] = true;
  var paths = [];

  while(queue.length) {
    var vertex = queue.shift();
    for(var i = 0; i < this.edges[vertex].length; i++) {
      if(!visited[this.edges[vertex][i]]) {
        visited[this.edges[vertex][i]] = true;
        queue.push(this.edges[vertex][i]);
        // save paths between vertices
        paths[this.edges[vertex][i]] = vertex;
      }
    }
  }
  if(!visited[vertexDestination]) {
    return undefined;
  }

  var path = [];
  for(var j = vertexDestination; j != vertexSource; j = paths[j]) {
    path.push(j);
  }
  path.push(j);
  return path.reverse().join('-');
};
Graph.prototype.print = function() {
  console.log(this.vertices.map(function(vertex) {
    return (vertex + ' -> ' + this.edges[vertex].join(', ')).trim();
  }, this).join(' | '));
};

var graph = new Graph();

graph.addVertex(1);
graph.addVertex(2);
graph.addVertex(3);
graph.addVertex(4);
graph.addVertex(5);
graph.addVertex(6);

graph.addEdge(1, 2);
graph.addEdge(1, 5);
graph.addEdge(2, 3);
graph.addEdge(2, 5);
graph.addEdge(3, 4);
graph.addEdge(4, 5);
graph.addEdge(4, 6);

graph.print();

console.log('graph size (number of vertices)', graph.size());
console.log('graph relations (number of edges)', graph.relations());

console.log('\n');
console.log('Will run traverseDFS starting on 1');
graph.traverseDFS(1, function(vertex) { console.log(vertex); });

console.log('\n');
console.log('Will run traverseBFS starting on 1');
graph.traverseBFS(1, function(vertex) { console.log(vertex); })

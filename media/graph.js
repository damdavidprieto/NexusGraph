const vscode = acquireVsCodeApi();

// Initialize graph
const elem = document.getElementById('graph');
const Graph = ForceGraph()(elem)
    .backgroundColor('var(--vscode-editor-background)')
    .linkColor(() => 'var(--vscode-editor-foreground)')
    .nodeAutoColorBy('group')
    .nodeLabel('name')
    .nodeVal('val')
    .onNodeClick(node => {
        // Focus the file on click?
        // vscode.postMessage({ command: 'openFile', path: node.path });
    });

// Handle messages
window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'updateData':
            const { nodes, links } = message.data;
            Graph.graphData({ nodes, links });
            break;
    }
});

// Request data on load
// vscode.postMessage({ command: 'refresh' });

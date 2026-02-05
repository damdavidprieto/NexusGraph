import * as vscode from 'vscode';
import * as path from 'path';
import { scanWorkspace } from './linkParser';

export function activate(context: vscode.ExtensionContext) {
    console.log('Nexus Graph is now active!');

    let disposable = vscode.commands.registerCommand('nexusGraph.start', async () => {
        const panel = vscode.window.createWebviewPanel(
            'nexusGraph',
            'Nexus Graph',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
            }
        );

        // Set initial HTML content
        panel.webview.html = getWebviewContent(panel.webview, context.extensionPath);

        // Update graph data
        updateGraph(panel);

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'refresh':
                        updateGraph(panel);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

async function updateGraph(panel: vscode.WebviewPanel) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No folder or workspace opened');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    try {
        const data = await scanWorkspace(rootPath);
        panel.webview.postMessage({ command: 'updateData', data });
    } catch (err: any) {
        vscode.window.showErrorMessage('Error scanning workspace: ' + err.message);
    }
}

function getWebviewContent(webview: vscode.Webview, extensionPath: string) {
    const scriptPathOnDisk = vscode.Uri.file(path.join(extensionPath, 'media', 'graph.js'));
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}' https://unpkg.com;">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nexus Graph</title>
        <style>
            body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: var(--vscode-editor-background); }
            #graph { width: 100%; height: 100%; }
        </style>
    </head>
    <body>
        <div id="graph"></div>
        <script nonce="${nonce}" src="https://unpkg.com/force-graph"></script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function deactivate() { }

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface GraphNode {
    id: string;
    name: string;
    path: string;
    val: number; // size/weight
}

interface GraphLink {
    source: string;
    target: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export async function scanWorkspace(rootPath: string): Promise<GraphData> {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Find all markdown files
    // Using simple glob pattern, ignoring node_modules
    const files = await glob('**/*.md', { cwd: rootPath, ignore: '**/node_modules/**' });

    // Create nodes first
    const fileIdMap = new Map<string, string>(); // absPath -> id

    files.forEach(file => {
        const absPath = path.resolve(rootPath, file);
        const name = path.basename(file);

        // Use relative path as ID to keep it clean, or just filename if unique enough?
        // Let's use relative path for uniqueness.
        const id = file.replace(/\\/g, '/'); // Normalize slashes

        fileIdMap.set(absPath.toLowerCase(), id);

        nodes.push({
            id: id,
            name: name,
            path: absPath,
            val: 1
        });
    });

    // Scan for links
    for (const file of files) {
        const absPath = path.resolve(rootPath, file);
        const sourceId = fileIdMap.get(absPath.toLowerCase());

        if (!sourceId) continue;

        const content = fs.readFileSync(absPath, 'utf-8');

        // Regex for standard markdown links: [text](path)
        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
        let match;

        while ((match = linkRegex.exec(content)) !== null) {
            const linkUrl = match[2];

            // Check if it's a relative link to a markdown file
            if (linkUrl.endsWith('.md') && !linkUrl.startsWith('http')) {
                try {
                    // Resolve path
                    const dir = path.dirname(absPath);
                    const targetAbsPath = path.resolve(dir, linkUrl);

                    const targetId = fileIdMap.get(targetAbsPath.toLowerCase());

                    if (targetId) {
                        links.push({
                            source: sourceId,
                            target: targetId
                        });

                        // Increase weight of source and target
                        const sourceNode = nodes.find(n => n.id === sourceId);
                        const targetNode = nodes.find(n => n.id === targetId);
                        if (sourceNode) sourceNode.val += 0.5;
                        if (targetNode) targetNode.val += 0.5;
                    }
                } catch (e) {
                    console.error(`Failed to resolve link ${linkUrl} in ${file}`, e);
                }
            }
        }
    }

    return { nodes, links };
}

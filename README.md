# Nexus Graph

![Nexus Graph Banner](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/version-0.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Nexus Graph** is a lightweight Visual Studio Code extension that visualizes the connections between your Markdown files. It helps you understand the structure of your documentation, notes, or Zettelkasten without the complexity of full-blown knowledge base tools.

## ✨ Features

*   **Zero Config**: Works out of the box. Just open a folder and run the command.
*   **Lightweight**: Uses a simple force-directed graph to visualize nodes (files) and edges (links).
*   **Workspace Scanning**: Automatically finds all `.md` files in your current workspace.
*   **Link Detection**: Identifies standard Markdown links `[Title](./path/to/file.md)`.
*   **Interactive**:  Visualizes your improved "weight" of connections (more links = stronger pull).

## 🚀 Usage

1.  Open a folder containing Markdown files in VS Code.
2.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
3.  Run the command: **Nexus Graph: Open Graph**.
4.  A new panel will open showing the visual graph of your notes.
5.  Click the **Refresh** button (or re-run command) to update the graph after changing files.

## 📦 Installation

(Coming soon to the VS Code Marketplace)

1.  Clone this repository.
2.  Run `npm install` to install dependencies.
3.  Press `F5` to start debugging.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Created by [damdavidprieto](https://github.com/damdavidprieto)**

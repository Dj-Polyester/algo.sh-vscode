// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

class ViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "colorSelected": {
          vscode.window.activeTextEditor?.insertSnippet(
            new vscode.SnippetString(`#${data.value}`)
          );
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.css")
    );
    const styleHighlightUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "styles", "dark.css")
    );
    const scriptHighlightUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "highlight.pack.js")
    );
    const scriptMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <!--
            Use a content security policy to only allow loading images from https or from our extension directory,
            and only allow scripts that have a specific nonce.
          -->
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="${styleHighlightUri}" rel="stylesheet" />
        <link href="${styleResetUri}" rel="stylesheet" />
        <link href="${styleVSCodeUri}" rel="stylesheet" />
        <link href="${styleMainUri}" rel="stylesheet" />
        
        <title>Cat Colors</title>
        </head>
        <body>
        <input type="text" placeholder="Enter here" />
        <button class="add-color-button">Add Color</button>
        <ul id="code-list">
        <pre>
          <code>
#hello world
print(31)
          </code>
        </pre>
        <pre>
          <code>
#hello world
print(31)
          </code>
        </pre>
        <pre>
          <code>
#hello world
print(31)
          </code>
        </pre>
        <pre>
          <code>
#hello world
print(31)
          </code>
        </pre>
        <pre>
          <code>
#hello world
print(31)
          </code>
        </pre>
        <pre>
          <code>
#hello world
print(31)
          </code>
        </pre>
        </ul>
        
        <script nonce="${nonce}" charset="utf-8" src="${scriptHighlightUri}"></script>
        <script nonce="${nonce}" charset="utf-8" src="${scriptMainUri}"></script>
      </body>
    </html>
    `;
  }
}
function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "algo-sh" is now active!');

  const provider = new ViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("algo-sh-sidebar", provider)
  );

  //   // The command has been defined in the package.json file
  //   // Now provide the implementation of the command with registerCommand
  //   // The commandId parameter must match the command field in package.json
  //   let disposable = vscode.commands.registerCommand("algo-sh.helloWorld", () => {
  //     // The code you place here will be executed every time your command is executed

  //     // Display a message box to the user
  //     vscode.window.showInformationMessage("Hello World from algo.sh!");
  //   });

  //   context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

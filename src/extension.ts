// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";
import { DEBUG } from "./debug";
import { exec } from "child_process";
import * as os from "os";
let config: vscode.WorkspaceConfiguration;

const PATH_OPT: string = path.join(
  __dirname,
  "..",
  "api",
  "core",
  "options.json"
);
var OPTIONS = JSON.parse(fs.readFileSync(PATH_OPT, "utf8"));
process.chdir(path.join(__dirname, "..", "api"));
console.log("Current working directory: ", process.cwd());

//determine OS
// switch (os.platform()) {
//   case "linux":
//     exec("systemctl start postgresql.service", (error, stdout, stderr) => {
//       console.log(`stdout: ${stdout}`);
//       console.log(`stderr: ${stderr}`);
//       if (error !== null) {
//         DEBUG(error);
//       }
//     });
//     break;
//   case "win32": //windows
//     exec("sc start postgresql.service", (error, stdout, stderr) => {
//       console.log(`stdout: ${stdout}`);
//       console.log(`stderr: ${stderr}`);
//       if (error !== null) {
//         DEBUG(error);
//       }
//     });
//     break;
//   case "darwin": //macOS
//     exec("launchctl start postgresql.service", (error, stdout, stderr) => {
//       console.log(`stdout: ${stdout}`);
//       console.log(`stderr: ${stderr}`);
//       if (error !== null) {
//         DEBUG(error);
//       }
//     });
//     break;
//   default:
//     DEBUG("OS platform is not defined");
//     break;
// }
import "../api";

class ViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _theme?: string;
  private _config?: vscode.WorkspaceConfiguration;
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public updateWebviewView() {
    //set highlight
    this._config = vscode.workspace.getConfiguration();
    this._theme = this._config.get("algo-sh.highlight");

    //set options
    var OPTIONS = JSON.parse(fs.readFileSync(PATH_OPT, "utf8"));
    OPTIONS.load = this._config.get("algo-sh.load");
    fs.writeFileSync(PATH_OPT, JSON.stringify(OPTIONS));

    this._view.webview.html = this._getHtmlForWebview(this._view.webview);
  }

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

    this.updateWebviewView();

    // webviewView.webview.onDidReceiveMessage((data) => {
    //   switch (data.type) {
    //     case "colorSelected": {
    //       vscode.window.activeTextEditor?.insertSnippet(
    //         new vscode.SnippetString(`#${data.value}`)
    //       );
    //       break;
    //     }
    //   }
    // });
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
      vscode.Uri.joinPath(
        this._extensionUri,
        "media",
        "styles",
        this._theme + ".css"
      )
    );
    const scriptHighlightUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "highlight.pack.js")
    );
    const scriptMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );
    const scriptDebugUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "debug.js")
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
        <meta http-equiv="Content-Security-Policy" 
        content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="${styleHighlightUri}" rel="stylesheet" />
        <link href="${styleResetUri}" rel="stylesheet" />
        <link href="${styleVSCodeUri}" rel="stylesheet" />
        <link href="${styleMainUri}" rel="stylesheet" />
        
        <title>Cat Colors</title>
      </head>
      <body>
        <input id="typeinp" type="text" placeholder="Enter here" />
        <span class="err-txt">Input field is empty</span>
        <select id="chooseinp">
          <option value="item">language</option>
          <option value="arduino">arduino</option>
          <option value="assembly">assembly</option>
          <option value="awk">awk</option>
          <option value="bash">bash</option>
          <option value="basic">basic</option>
          <option value="bf">bf</option>
          <option value="c">c</option>
          <option value="chapel">chapel</option>
          <option value="clean">clean</option>
          <option value="clojure">clojure</option>
          <option value="coffee">coffee</option>
          <option value="cpp">cpp</option>
          <option value="csharp">csharp</option>
          <option value="d">d</option>
          <option value="dart">dart</option>
          <option value="delphi">delphi</option>
          <option value="dylan">dylan</option>
          <option value="eiffel">eiffel</option>
          <option value="elixir">elixir</option>
          <option value="elisp">elisp</option>
          <option value="elm">elm</option>
          <option value="erlang">erlang</option>
          <option value="factor">factor</option>
          <option value="fortran">fortran</option>
          <option value="forth">forth</option>
          <option value="fsharp">fsharp</option>
          <option value="go">go</option>
          <option value="groovy">groovy</option>
          <option value="haskell">haskell</option>
          <option value="java">java</option>
          <option value="js">js</option>
          <option value="julia">julia</option>
          <option value="kotlin">kotlin</option>
          <option value="latex">latex</option>
          <option value="lisp">lisp</option>
          <option value="lua">lua</option>
          <option value="matlab">matlab</option>
          <!--DBMS-->
          <option value="mongodb">mongodb</option>
          <option value="nim">nim</option>
          <option value="ocaml">ocaml</option>
          <option value="octave">octave</option>
          <option value="perl">perl</option>
          <option value="perl6">perl6</option>
          <option value="php">php</option>
          <option value="pike">pike</option>
          <option value="python">python</option>
          <option value="python3">python3</option>
          <option value="r">r</option>
          <option value="racket">racket</option>
          <!--DBMS-->
          <option value="redis">redis</option>
          <option value="ruby">ruby</option>
          <option value="rust">rust</option>
          <option value="scala">scala</option>
          <option value="scheme">scheme</option>
          <option value="solidity">solidity</option>
          <!--DBMS-->
          <option value="sql">sql</option>
          <option value="swift">swift</option>
          <option value="tcsh">tcsh</option>
          <option value="tcl">tcl</option>
          <option value="objective-c">objective-c</option>
          <option value="vb">vb</option>
          <option value="vbnet">vbnet</option>
        </select>
        <span class="err-txt">Please choose a valid item</span>
        <button id="searchbtn">Search</button>
        
        <ul id="code-list"></ul>
        <script nonce="${nonce}" charset="utf-8" src="${scriptDebugUri}"></script>
        <script nonce="${nonce}" charset="utf-8" src="${scriptHighlightUri}"></script>
        <script nonce="${nonce}" charset="utf-8" src="${scriptMainUri}"></script>
        <script nonce="${nonce}" charset="utf-8" src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
        <lottie-player
          src="https://assets5.lottiefiles.com/packages/lf20_dkvy24ug.json"
          background="transparent"
          speed="1"
          style="width: 64px; height: 64px"
          loop
          autoplay
        ></lottie-player>
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
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "algo-sh" is now active!');

  const provider = new ViewProvider(context.extensionUri);

  vscode.workspace.onDidChangeConfiguration((event) => {
    provider.updateWebviewView();

    // let affected = event.affectsConfiguration("riot.compiler");
    // if (affected) {
    //   // rebuild cpp project settings
    // }
  });

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

var html_value;
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    styleActiveLine: true,
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    mode: "shell",
    theme: "base16-dark",
    extraKeys: {
        "Enter": run
    }
});
editor.setSize('100%', 500);

function run() {
    const lastLine = editor.lastLine();
    html_value = editor.getLine(lastLine);
    if (html_value === "docker pull nginx") {
        document.querySelector("#motion-demo").classList.add("animate-image")
    }
    console.log(html_value)
    return CodeMirror.Pass
}
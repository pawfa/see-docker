const DIR = "user@host:/$ ";
let newLine = '';
let isWaitingForResponse = false;

const imagesArr = [];
const containersArr = [];

const dockerCommands = ["pull", "run", "rm", "ps", "images", "container"]

let input = {
    command: '',
    options: [],
    args: [],
    name: ''
}
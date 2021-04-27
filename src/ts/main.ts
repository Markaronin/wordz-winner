import { words } from "./words";

const lettersInput = document.getElementById("letters") as HTMLInputElement;
const wordzSimulatorDiv = document.getElementById("wordzSimulator") as HTMLDivElement;
const findWordzButton = document.getElementById("findWordz") as HTMLButtonElement;
const wordzDiv = document.getElementById("wordz") as HTMLDivElement;
const arrowSVG = document.getElementById("arrowSVG") as HTMLOrSVGImageElement;

let letters = "";
function render() {
    wordzSimulatorDiv.innerHTML = "";

    Array.from(letters).forEach((letter) => {
        const letterDiv = document.createElement("div");

        letterDiv.innerText = letter;
        wordzSimulatorDiv.appendChild(letterDiv);
    });
}

const resizeArrowSVG = () => {
    arrowSVG.setAttribute("height", document.body.scrollHeight.toString());
    arrowSVG.setAttribute("width", document.body.scrollWidth.toString());
};
resizeArrowSVG();
window.onresize = resizeArrowSVG;

function existsWordStartingWithLetters(letters: string): boolean {
    let low = 0;
    let high = words.length;
    let middle = Math.floor(high / 2);
    while (high > low) {
        if (words[middle].startsWith(letters)) {
            return true;
        } else if (words[middle] > letters) {
            high = middle - 1;
            middle = Math.floor(low + (high - low) / 2);
        } else if (words[middle] < letters) {
            low = middle + 1;
            middle = Math.floor(low + (high - low) / 2);
        }
    }
    return words[middle].startsWith(letters);
}
function existsWordWithLetters(letters: string): boolean {
    let low = 0;
    let high = words.length;
    let middle = Math.floor(high / 2);
    while (high > low) {
        if (words[middle] === letters) {
            return true;
        } else if (words[middle] > letters) {
            high = middle - 1;
            middle = Math.floor(low + (high - low) / 2);
        } else if (words[middle] < letters) {
            low = middle + 1;
            middle = Math.floor(low + (high - low) / 2);
        }
    }
    return words[middle] === letters;
}

function getWordFromPath(path: number[]) {
    return path.map((index) => letters[index]).join("");
}

function possibleNextLetters(path: number[]): number[] {
    const last = path[path.length - 1];
    const possibleNext = [];
    if (last % 4 < 3) {
        possibleNext.push(last + 1);
    }
    if (last % 4 > 0) {
        possibleNext.push(last - 1);
    }
    if (last < 12) {
        possibleNext.push(last + 4);
    }
    if (last > 3) {
        possibleNext.push(last - 4);
    }
    if (last < 12 && last % 4 > 0) {
        possibleNext.push(last + 3);
    }
    if (last > 3 && last % 4 < 3) {
        possibleNext.push(last - 3);
    }
    if (last < 12 && last % 4 < 3) {
        possibleNext.push(last + 5);
    }
    if (last > 3 && last % 4 > 0) {
        possibleNext.push(last - 5);
    }
    return possibleNext.filter((possibility) => !path.includes(possibility));
}
function getAllCombinations() {
    const allPaths: number[][] = [];
    const queue: number[][] = [];
    for (let i = 0; i < 16; i++) {
        if (existsWordStartingWithLetters(getWordFromPath([i]))) {
            queue.push([i]);
        }
    }
    while (queue.length > 0) {
        const currentPathToLookAt = queue.shift()!;
        if (currentPathToLookAt.length >= 3 && existsWordWithLetters(getWordFromPath(currentPathToLookAt))) {
            allPaths.push(currentPathToLookAt);
        }
        possibleNextLetters(currentPathToLookAt).forEach((possibleNextLetter) => {
            const possiblePath = [...currentPathToLookAt, possibleNextLetter];
            if (existsWordStartingWithLetters(getWordFromPath(possiblePath))) {
                queue.push(possiblePath);
            }
        });
    }
    return allPaths.sort((a, b) => b.length - a.length);
}

function drawArrow(x1: number, y1: number, x2: number, y2: number) {
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
    arrow.setAttribute("x1", x1.toString());
    arrow.setAttribute("y1", y1.toString());
    arrow.setAttribute("x2", x2.toString());
    arrow.setAttribute("y2", y2.toString());
    arrow.classList.add("arrow");
    arrowSVG.appendChild(arrow);
}

function getCenterOfDiv(div: HTMLDivElement): { x: number; y: number } {
    return {
        x: div.offsetLeft + div.offsetWidth / 2,
        y: div.offsetTop + div.offsetHeight / 2,
    };
}

function drawGraphicFromPath(path: number[]) {
    const graphicDiv = document.createElement("div");
    graphicDiv.classList.add("miniWordzSimulator");
    graphicDiv.classList.add("wordzSimulator");
    const allLetterDivs: HTMLDivElement[] = [];
    Array.from(letters).forEach((letter) => {
        const letterDiv = document.createElement("div");
        allLetterDivs.push(letterDiv);

        letterDiv.innerText = letter;
        graphicDiv.appendChild(letterDiv);
    });
    wordzDiv.appendChild(graphicDiv);
    for (let i = 1; i < path.length; i++) {
        let pos1 = getCenterOfDiv(allLetterDivs[path[i - 1]]);
        let pos2 = getCenterOfDiv(allLetterDivs[path[i]]);
        drawArrow(pos1.x, pos1.y, pos2.x, pos2.y);
    }
}

findWordzButton.onclick = () => {
    const allCombinations = getAllCombinations();
    allCombinations.forEach((combination) => {
        wordzDiv.appendChild(document.createElement("hr"));
        drawGraphicFromPath(combination);
        const wordSpan = document.createElement("span");
        wordSpan.innerText = getWordFromPath(combination);
        wordzDiv.appendChild(wordSpan);
    });
    resizeArrowSVG();
};

lettersInput.onkeyup = () => {
    letters = lettersInput.value;
    render();
    if (letters.length === 16) {
        findWordzButton.style.display = "block";
    } else {
        findWordzButton.style.display = "none";
    }
};

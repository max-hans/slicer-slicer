const fs = require("fs-extra");
const commandLineArgs = require("command-line-args");
const utils = require("./utils");

const optionDefinitions = [
  { name: "path", alias: "p", type: String },
  { name: "maxlength", alias: "l", type: Number, defaultValue: 1 },
  { name: "accuracy", alias: "a", type: Number, defaultValue: 3 },
  { name: "inplace", alias: "i", type: Boolean, defaultValue: false },
];

const head = [
  ";",
  ";",
  "; !!! ATTENTION !!!",
  "; !!! never let code generated from this script run unattended !!!",
  ";",
  ";created with slicer-slicer by @max-hans",
  ";-> https://github.com/max-hans",
  ";",
  ";",
];

const LINEBREAK = "\r";

const coordinateArrayMap = {
  X: 0,
  Y: 1,
  Z: 2,
  E: 3,
};
const coordinateCount = Object.keys(coordinateArrayMap).length;

const { path, maxlength, accuracy, inplace } = commandLineArgs(
  optionDefinitions
);

const splitPath = (start, end, segmentCount) => {
  const delta = [];

  for (let i = 0; i < coordinateCount; i++) {
    delta[i] = end[i] - start[i];
  }
  const axisSteps = delta.map((elem) => elem / segmentCount);

  const outCoordinates = [];
  for (let i = 1; i < segmentCount; i++) {
    const newCoordinate = start.map(
      (coordinate, j) => coordinate + axisSteps[j] * i
    );
    outCoordinates.push(newCoordinate);
  }
  outCoordinates.push(end);

  return outCoordinates;
};

const distanceBetweenPoints = (start, end) => {
  return Math.sqrt(
    Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
  );
};

const extractCommandName = (row) => {
  const chunks = row.split(" ");
  const command = chunks[0].trim();
  return command;
};

const extractCoordinates = (row) => {
  const chunks = row.split(" ");
  let feedRate;
  const newCoordinate = new Array(coordinateCount);
  chunks.forEach((chunk) => {
    const data = parseFloat(chunk.substring(1));
    if (chunk.charAt(0) === "F") {
      feedRate = data;
    } else {
      const index = coordinateArrayMap[chunk.charAt(0)];
      if (index !== undefined) {
        newCoordinate[index] = data;
      }
    }
  });
  return { newCoordinate, feedRate };
};

const createGcodeRow = (
  coordinates,
  { feedRate, comment, initialRow, partOfSplit, mask }
) => {
  const axisNames = Object.keys(coordinateArrayMap);
  const coordinateString = coordinates
    .map(
      (coordinate, i) =>
        `${axisNames[i]}${utils.trimFloat(coordinate, accuracy)}`
    )
    .filter((coordinate, i) => mask[i])
    .join(" ");
  const commandString = `G1 ${coordinateString}${
    feedRate ? " F" + feedRate : ""
  } ; - ${initialRow} ${partOfSplit}`;
  return commandString;
};

const mergeCoordinates = (oldCoordinates, newCoordinates) => {
  const merged = [...newCoordinates];
  oldCoordinates.forEach((elem, j) => {
    if (merged[j] === undefined) {
      merged[j] = elem;
    }
  });
  return merged;
};

const splitComment = (row) => {
  return row.includes(";")
    ? row.split(";").map((fragment) => fragment.trim())
    : [row, ""];
};

const interpolate = (rows) => {
  const newRows = [];

  head.forEach((row) => {
    newRows.push(row);
  });

  let lastPosition = [0, 0, 0, 0];

  for (let i = 0; i < rows.length; i++) {
    const currentRow = rows[i].trim();

    if (currentRow.charAt(0) === ";") {
      newRows.push(currentRow);
    } else {
      switch (extractCommandName(currentRow)) {
        case "G0": {
          const rowCleaned = splitComment(currentRow)[0];

          const { newCoordinate } = extractCoordinates(rowCleaned);

          const currentPosition = mergeCoordinates(lastPosition, newCoordinate);

          lastPosition = currentPosition;
          newRows.push(currentRow);
          break;
        }
        case "G1": {
          const [rowCleaned, comment] = splitComment(currentRow);

          const { newCoordinate, feedRate } = extractCoordinates(rowCleaned);

          const activeAxes = newCoordinate.map((axis) => Boolean(axis));

          const currentPosition = mergeCoordinates(lastPosition, newCoordinate);

          const distance = distanceBetweenPoints(lastPosition, currentPosition);

          if (distance > maxlength) {
            const segmentCount = Math.floor(distance / maxlength + 1);

            const pathSegments = splitPath(
              lastPosition,
              currentPosition,
              segmentCount
            );

            pathSegments.forEach((coordinate, i) => {
              const commandString = createGcodeRow(coordinate, {
                feedRate,
                initialRow: currentRow,
                partOfSplit: `${i}/${pathSegments.length - 1}`,
                mask: activeAxes,
              });

              newRows.push(commandString);
            });

            lastPosition = currentPosition;
          } else {
            lastPosition = currentPosition;
            newRows.push(currentRow);
          }
          break;
        }
        case "G92": {
          const [rowCleaned, comment] = splitComment(currentRow);

          const { newCoordinate } = extractCoordinates(rowCleaned);
          const currentPosition = mergeCoordinates(lastPosition, newCoordinate);

          lastPosition = currentPosition;
          newRows.push(currentRow);
          break;
        }
        default: {
          newRows.push(currentRow);
        }
      }
    }
  }

  return newRows;
};

if (path) {
  console.log(path);

  const fileContent = fs.readFileSync(path, { encoding: "utf-8" });
  const rows = fileContent.split("\n");

  console.log(`read ${rows.length} rows of gcode`);

  // this is where the magic happens
  const editedGcode = interpolate(rows);

  console.log(`created ${editedGcode.length} rows of gcode`);

  // stringify gcode
  const gcodeStringified = editedGcode
    .filter((row) => row.length > 0)
    .join(LINEBREAK);

  let outputPath;

  if (inplace) {
    outputPath = `${path
      .trim()
      .substring(0, path.length - 6)}-edit-${Date.now()}.gcode`;
  } else {
    const fileName = path
      .split("\\")
      .map((elem) => elem.trim())
      .reverse()[0];
    outputPath = `./output/edit-${Date.now()}-${fileName}`;
  }

  console.log(outputPath);
  fs.writeFileSync(outputPath, gcodeStringified);
  console.log("done");
  console.error(
    "attention! never let code generated from this script run unattended!"
  );
} else {
  throw new Error("no file provided");
}

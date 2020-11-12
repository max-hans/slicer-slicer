# slicer-slicer

this script is used to slice edges created from a slicer into smaller chunks. i use it for robotics, no idea what someone else could use it for.

## !!! warning !!!

**this is highly experimental. never let your printer run with gcode generated with this script without paying attention!**

![logo](github/slicer-slicer-logo.png)

## install

cd into this directory and run:

```
npm install
```

## run

cd into this repo and run:

```
node src/index.js -p c:\path\to\your\file\yourgcode.gcode
```

_(dont forget replacing the path with the path to your code)_

## options

### --path / p

path to gcode file to work on (mandatory)

### maxlength / l

maximum edge length. every edge longer than that will be sliced into segments

_default_: 1mm

### accuracy

float accuary

_default_: 3 digits

### inplace

will save new file next to the original file. if omitted, it will save the file in the output-folder of this project

_default_: save in output folder

## platforms

this was tested on a win10 machine running node v12.10.0 and gcode created by Cura 4.7.1.

it only uses pretty standard modules, so it should work on other platforms as well.

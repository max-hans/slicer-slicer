# slicer-slicer

this script is used to slice edges created from a slicer into smaller chunks. i use it for robotics, no idea what someone else could use it for.

## !!! warning !!!

**this is highly experimental. never let your printer run with gcode generated with this script without paying attention!**

![logo](github/slicer-slicer-logo.png)

## what it does

this was made in a hurry to achieve something for a very specific use case.
for a robotics project i needed gcode, that has a high resolution for moves. so even straight moves needed to be split into smaller steps.

it will turn this:

```gcode
G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position
```

into this:

```gcode
G1 X0.005 Y0.952 Z1.919 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 0/20
G1 X0.01 Y1.905 Z1.838 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 1/20
G1 X0.014 Y2.857 Z1.757 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 2/20
G1 X0.019 Y3.81 Z1.676 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 3/20
G1 X0.024 Y4.762 Z1.595 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 4/20
G1 X0.029 Y5.714 Z1.514 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 5/20
G1 X0.033 Y6.667 Z1.433 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 6/20
G1 X0.038 Y7.619 Z1.352 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 7/20
G1 X0.043 Y8.571 Z1.271 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 8/20
G1 X0.048 Y9.524 Z1.19 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 9/20
G1 X0.052 Y10.476 Z1.11 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 10/20
G1 X0.057 Y11.429 Z1.029 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 11/20
G1 X0.062 Y12.381 Z0.948 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 12/20
G1 X0.067 Y13.333 Z0.867 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 13/20
G1 X0.071 Y14.286 Z0.786 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 14/20
G1 X0.076 Y15.238 Z0.705 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 15/20
G1 X0.081 Y16.19 Z0.624 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 16/20
G1 X0.086 Y17.143 Z0.543 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 17/20
G1 X0.09 Y18.095 Z0.462 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 18/20
G1 X0.095 Y19.048 Z0.381 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 19/20
G1 X0.1 Y20 Z0.3 F5000 ; - G1 X0.1 Y20 Z0.3 F5000.0 ; Move to start position 20/20
```

## install

clone directory:

```
git clone https://github.com/max-hans/slicer-slicer.git
```

cd into this directory and run:

```
cd slicer-slicer
npm install
```

## run

when in this directory run:

```
node src/index.js -p c:\path\to\your\file\yourgcode.gcode
```

_dont forget replacing the path with the path to your code. usually dragging a file into the terminal works, too_

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

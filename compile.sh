#!/bin/sh
tsc ./src/**.ts --outDir ./dist
webpack

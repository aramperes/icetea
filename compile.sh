#!/bin/sh
tsc --outDir ./dist --jsx react ./src/**/*.ts ./src/**/*.tsx ./src/web/components/*.tsx ./src/*.ts ./src/*.tsx
webpack

#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const config = {
  input: path.resolve(__dirname, '../../style/variables/colors.styl'),
  output: path.resolve(__dirname, '../src/assets/klara.sketchpalette'),
};

const colorsFile = fs.readFileSync(config.input, 'utf8');
const colorPattern = /#([a-f0-9]{1,2}){3}/g;
const stylusColors = colorsFile.match(colorPattern);

const sketchColors = stylusColors.map((stylusColor) => {
  const r = stylusColor.substr(1).substr(0, 2);
  const g = stylusColor.substr(1).substr(2, 2);
  const b = stylusColor.substr(1).substr(4, 2);

  return {
    alpha: 1,
    red: parseInt(r, 16) / 255,
    green: parseInt(g, 16) / 255,
    blue: parseInt(b, 16) / 255,
  };
});

const sketchPalette = {
  compatibleVersion: '1.4',
  pluginVersion: '1.5',
  colors: sketchColors,
};

fs.writeFileSync(config.output, JSON.stringify(sketchPalette, null, 2));

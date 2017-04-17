#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const parseEntry = require('./lib/parseEntry');
const parseOutput = require('./lib/parseOutput');
const collectFiles = require('./lib/collectFiles');
const wrapToModules = require('./lib/wrapToModules');
const generateChunks = require('./lib/generateChunks');
const generateAssets = require('./lib/generateAssets');
const outputAssets = require('./lib/outputAssets');
// read lspack.config.js and parse
const config = require(path.resolve('./lspack.config.js'));

const entry = parseEntry(config.entry);

const files = collectFiles(entry);

const moduleGraph = wrapToModules(files, config.rules);

const chunks = generateChunks(entry, moduleGraph);

const assets = generateAssets(chunks, moduleGraph);

const output = parseOutput(config.output);

outputAssets(assets, output);


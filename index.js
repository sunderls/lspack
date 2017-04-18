#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Compiler = require('./lib/compiler');

const config = require(path.resolve('./lspack.config.js'));
const compiler = new Compiler(config);
compiler.compile();
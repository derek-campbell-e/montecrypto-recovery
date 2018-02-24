const debug = require('debug')("montecrypto");
const fs = require('fs');
const path = require('path');
const shuffle = require('shuffle-array');

let montecrypto = require('./src/montecrypto')();

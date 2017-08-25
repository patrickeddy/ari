#! /usr/bin/env node
'use strict';

var _apprecom = require('apprecom');

var _apprecom2 = _interopRequireDefault(_apprecom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// SIMPLE CONFIGURATION
var MIN_SUPPORT = 0.02;
var MIN_CONFIDENCE = 0.4;
var TEST_RATIO = 0.9;
var DEBUG = false; // Toggle this true or false for debug logs

// FILE PATHS
var DATA_FILE = "data.csv";

// Requires

var AR = new _apprecom2.default(DEBUG);
var ARRules = {};

var fs = require('fs');
var csv = require('csv');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Csv settings
var CSV_ENCODING = "utf-8";
var CSV_OPTIONS = {
  columns: true
};

main();

function clear() {
  process.stdout.write('\x1Bc');
}

/**
 * This program's main function.
 */
function main() {
  clear();
  rl.write("ARI - AppRecom Interactive\nLocation based App recommendation algorithm\n\n");
  prompt();
}

function prompt() {
  rl.write("\nCHOOSE OPTION:\n");
  rl.write("   1 - train on data.csv\n");
  rl.write("   2 - get app recommendations\n");
  rl.write("   q - quit\n\n");
  rl.question(": ", function (answer) {
    if (hasSubStr(answer, "1")) {
      readDataAndMine(); // mine
    } else if (hasSubStr(answer, "2")) {
      var locations = Object.keys(AR.rules);
      // We have locations
      if (locations && locations.length > 0) {
        var promptMessage = 'Enter a location category\n[' + locations.toString().replace(/,/g, ", ") + ']: ';

        clear();
        print("APP RECOMMENDATIONS\n");
        rl.question(promptMessage, function (locationCategory) {
          getAppRecommendations(locationCategory);
        });
      } else {
        // didn't find locations
        print("\nTrain the recommender first.");
        prompt();
      }
    } else if (hasSubStr(answer, "q")) {
      var code = 0;
      process.exit(code);
    } else {
      print("\nHuh?");
      prompt();
    }
  });
}

/**
 * Read the data file and mine for rules.
 */
function readDataAndMine() {
  // Create some space
  printNewLine();
  // Read the file
  fs.readFile(DATA_FILE, CSV_ENCODING, function (err, data) {
    if (err) throw console.log(err); // throw an error if couldn't read
    csv.parse(data.replace(/,\s/g, ","), CSV_OPTIONS, function (err, data) {
      if (err) throw console.log(err);
      // TRAIN RECOMMENDER
      AR.train(data, MIN_SUPPORT, MIN_CONFIDENCE, TEST_RATIO);
      print("Trained!");
      prompt();
    });
  });
}

/**
 * Gets the app recommendations.
 */
function getAppRecommendations(locationCategory) {

  // GET THE RECOMMENDATION
  var apps = AR.getApps(locationCategory);

  var reply = '\nApp Recommendations for ' + locationCategory.toUpperCase() + ':\n';
  if (apps && apps.length > 0) {
    for (var app in apps) {
      reply += '\n   ' + (Number(app) + 1) + '. ' + apps[app];
    }
  } else reply += "\n     None";
  print(reply);
  print("\n----------------------");
  prompt(); // prompt again
}

// Helper functions

function printNewLine() {
  var times = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  for (var i = 0; i < times; i++) {
    print("\n");
  }
}

function hasSubStr(str, sub) {
  return str.indexOf(sub) !== -1;
}

function print(str) {
  console.log(str);
}
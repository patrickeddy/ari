#! /usr/bin/env node
'use strict';

var _apprecom = require('apprecom');

var _apprecom2 = _interopRequireDefault(_apprecom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FILE PATHS
var DATA_FILE = "data.csv";

// Requires

var AR = new _apprecom2.default(); // create the AppRecom object

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

/**
 * This program's main function.
 */
function main() {
  process.stdout.write('\x1Bc');
  rl.write("ARI - AppRecom Interactive\nLocation based App recommendation algorithm\n\n");
  prompt();
}

function prompt() {
  rl.write("\nCHOOSE OPTION:\n");
  rl.write("1 - train on data.csv\n");
  rl.write("2 - get app recommendations\n");
  rl.write("q - quit\n\n");
  rl.question(": ", function (answer) {
    if (hasSubStr(answer, "1")) {
      readDataAndMine(); // mine
    } else if (hasSubStr(answer, "2")) {
      rl.question("\nEnter a location category: ", function (locationCategory) {
        getAppRecommendations(locationCategory);
      });
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

      // TRAIN RECOMMENDER
      AR.train(data, 0.1, 0.8).then(function () {
        print("=> Trained!");
        prompt();
      });
    });
  });
}

/**
 * Gets the app recommendations.
 */
function getAppRecommendations(locationCategory) {

  // GET THE RECOMMENDATION
  AR.getApps(locationCategory).then(function (apps) {
    console.log("\nApp Recommendations:\n=> " + apps);
    prompt(); // prompt again
  }).catch(function (err) {
    print("\n=> Error finding rules. Did you first call the train method?\n\n");
    prompt();
  });
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
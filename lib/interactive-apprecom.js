#! /usr/bin/env node
"use strict";

var _AppRecom = require("./AppRecom");

var _AppRecom2 = _interopRequireDefault(_AppRecom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FILE PATHS
var DATA_FILE = "./src/data.csv";

// Requires

var AR = new _AppRecom2.default("./src/");

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
  rl.write("Interactive AppRecom - Location based app recommendation alg\n");
  prompt();
}

function prompt() {
  rl.write("\nChoose an option:\n");
  rl.write("1 - mine the data.csv file for rules\n");
  rl.write("2 - receive an app recommendation based on the rules in rules.txt\n");
  rl.write("q - quit\n\n");
  rl.question(": ", function (answer) {
    if (hasSubStr(answer, "1")) {
      readDataAndMine(); // mine
    }
    if (hasSubStr(answer, "2")) {
      rl.question("\nEnter a location category: ", function (locationCategory) {
        getAppRecommendations(locationCategory);
      });
    }
    if (hasSubStr(answer, "q")) {
      var code = 0;
      process.exit(code);
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
      AR.train(data).then(function () {
        print("Trained!");
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
    console.log("\nApps found are:\n" + apps);
    prompt(); // prompt again
  }).catch(function (err) {
    console.log(err);
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
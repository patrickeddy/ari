#! /usr/bin/env node

// SIMPLE CONFIGURATION
const MIN_SUPPORT = 0.02;
const MIN_CONFIDENCE = 0.4;
const TEST_RATIO = 0.9;
const DEBUG = false; // Toggle this true or false for debug logs

// FILE PATHS
const DATA_FILE = "big_data.csv";

// Requires
import AppRecom from 'apprecom';
const AR = new AppRecom(DEBUG);
let ARRules = {};

const fs = require('fs');
const csv = require('csv');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Csv settings
const CSV_ENCODING = "utf-8";
const CSV_OPTIONS = {
  columns: true
}

main();

function clear() {
  process.stdout.write('\x1Bc');
}

/**
 * This program's main function.
 */
function main(){
  clear();
  rl.write("ARI - AppRecom Interactive\nLocation based App recommendation algorithm\n\n");
  prompt();
}

function prompt(){
  rl.write("\nCHOOSE OPTION:\n");
  rl.write("   1 - train on data.csv\n");
  rl.write("   2 - get app recommendations\n");
  rl.write("   q - quit\n\n");
  rl.question(": ", (answer)=>{
    if (hasSubStr(answer, "1")){
      readDataAndMine(); // mine
    }else if (hasSubStr(answer, "2")){
      const locations = Object.keys(AR.rules);
      // We have locations
      if (locations && locations.length > 0){
        const promptMessage = `Enter a location category\n[${locations.toString().replace(/,/g, ", ")}]: `;

        clear();
        print("APP RECOMMENDATIONS\n");
        rl.question(promptMessage, (locationCategory)=>{
          getAppRecommendations(locationCategory);
        });
      } else { // didn't find locations
        print("\nTrain the recommender first.");
        prompt();
      }
    } else if (hasSubStr(answer, "q")){
      const code = 0;
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
function readDataAndMine(){
  // Create some space
  printNewLine();
  // Read the file
  fs.readFile(DATA_FILE, CSV_ENCODING, (err, data)=>{
    if (err) throw console.log(err); // throw an error if couldn't read
    csv.parse(data.replace(/,\s/g, ","), CSV_OPTIONS, (err, data)=>{
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
function getAppRecommendations(locationCategory){

  // GET THE RECOMMENDATION
  const apps = AR.getApps(locationCategory);

  let reply = `\nApp Recommendations for ${locationCategory.toUpperCase()}:\n`;
  if (apps && apps.length > 0) {
    for (const app in apps) reply += `\n   ${Number(app)+1}. ${apps[app]}`;
  } else reply += "\n     None";
  print(reply);
  print("\n----------------------");
  prompt(); // prompt again
}

// Helper functions

function printNewLine(times = 1){
  for (let i = 0; i < times; i++) print("\n");
}

function hasSubStr(str, sub){
  return str.indexOf(sub) !== -1;
}

function print(str){
  console.log(str);
}

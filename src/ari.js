#! /usr/bin/env node

// FILE PATHS
const DATA_FILE = "data.csv";

// Requires
import AppRecom from 'apprecom';
const AR = new AppRecom(); // create the AppRecom object

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

/**
 * This program's main function.
 */
function main(){
  process.stdout.write('\x1Bc');
  rl.write("ARI - AppRecom Interactive\nLocation based App recommendation algorithm\n\n");
  prompt();
}

function prompt(){
  rl.write("\nCHOOSE OPTION:\n");
  rl.write("1 - train on data.csv\n");
  rl.write("2 - get app recommendations\n");
  rl.write("q - quit\n\n");
  rl.question(": ", (answer)=>{
    if (hasSubStr(answer, "1")){
      readDataAndMine(); // mine
    }else if (hasSubStr(answer, "2")){
      rl.question("\nEnter a location category: ", (locationCategory)=>{
        getAppRecommendations(locationCategory);
      });
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

      // TRAIN RECOMMENDER
      AR.train(data, 0.1, 0.8).then(()=>{
        print("=> Trained!");
        prompt();
      });

    });
  });
}

/**
 * Gets the app recommendations.
 */
function getAppRecommendations(locationCategory){

  // GET THE RECOMMENDATION
  AR.getApps(locationCategory).then((apps)=>{
    console.log("\nApp Recommendations:\n=> " + apps);
    prompt(); // prompt again
  }).catch((err)=>{
    print("\n=> Error finding rules. Did you first call the train method?\n\n");
    prompt();
  });

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

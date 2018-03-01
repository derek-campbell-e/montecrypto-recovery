module.exports = function MonteCrypto(){
  // list our dependencies
  const debug = require('debug')("montecrypto");
  const fs = require('fs');
  const path = require('path');
  const shuffle = require('shuffle-array');

  // define an object to hold our cli
  let cli = null;

  // main application module 
  let mc = {};
  mc.meta = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));

  // load the passwords into a var
  // will make this bug-free soon
  let passwords = JSON.parse(fs.readFileSync(path.join(__dirname,'..', "passwords.json"), 'utf-8'));
  
  // this is the foundation of it all, from the specific clue
  // could be wrong?
  let piDigits = "093844609550582231725359"; // clue found that has pi above 121-144 possibly indicating word order
  let piDigitsArray = piDigits.split("");

  // function to find all enigma codes that have the [number] in their name
  mc.getEnigmaCodesByNumber = function(number){
    debug("finding rooms in file with number:", number);
    number = parseInt(number);
    let enigmaCodes = [];
    for(let roomKey in passwords){
      let room = passwords[roomKey];
      let codeNumber = parseInt(room.number);
      if(number === codeNumber){
        debug("room:", roomKey, "enigma code starts with number", number);
        room.roomName = roomKey;
        enigmaCodes.push(room);
      }
    }
    return enigmaCodes;
  };
  
  // creates the btcrecover text line given the options from our cli
  // options: 
  // -N : don't use numbers from the enigma code 
  // -T : don't use translated words, only use the original found in-game
  // -W : don't use word found in game, use only translation(s)
  mc.createPasswordLine = function(enigmaCode, options){
    
    debug("creating password line with options:", options);
  
    let words = [];

    if(!options.word){
      words.push(enigmaCode.word);
    }
    
    if(!options.trans){
      if(Array.isArray(enigmaCode.translation)){
        words = words.concat(enigmaCode.translation);
      } else {
        words.push(enigmaCode.translation);
      }
    }

    let passwordLine = "";
    
    for(let wordIndex in words){
      let word = words[wordIndex];
      let thisLine = "";
      if(!options.num) {
        thisLine += enigmaCode.number+word+" ";
      }
      thisLine += word + " ";
      passwordLine += thisLine;
    }
    return passwordLine;
  };
  
  // creates the commented out + passsword lines for each iteration of the pi digits split
  // fyi: since we don't know which 5word 5anotherword comes first we mash them together
  mc.createBTCRecoverLine = function(position, number, enigmaCodes, options){
    let line = "# PI POSITION: "+position+"\n";
    line += "# PI NUMBER: "+number+"\n";
    let enigmaCopy = shuffle(enigmaCodes, {copy: true});
    let rooms = [];
    let passwordText = "";
    passwordText += "+^" + (parseInt(position)+1) + "^";
    for(let enigmaIndex in enigmaCopy){
      let enigma = enigmaCopy[enigmaIndex];
      rooms.push(enigma.roomName);
      passwordText += mc.createPasswordLine(enigma, options);
    }

    if(options.word && options.trans && options.num){
      passwordText = "# nothing to show, don't use all the options";
    }

    let roomText = "# ROOMS: " + rooms.join(" || ");
    line += roomText + "\n";
    line += passwordText + "\n";
    line += "\n";
    return line;
  };

  // writes the output of the recover line to a file
  // this file should be located in project root directory
  mc.writeFile = function(filename, text, callback){
    callback = callback || function(){};
    let fullFilepath = path.join(__dirname, "..", filename);
    fs.writeFile(fullFilepath, text, callback);
  };

  // called from our cli, begins the process of going through each pi digit
  // and finding rooms that have that number in their solved code
  // and so on...
  mc.createBTCRecoverFile = function(args, callback){
    callback = callback || function(){};
    let BTCRecoverFileText = "";
    for(let piDigitIndex in piDigitsArray){
      let piPart = piDigitsArray[piDigitIndex];
      debug("currently on piIndex:", piDigitIndex, "using pi digit:", piPart);
      let enigmaCodes = mc.getEnigmaCodesByNumber(piPart);
      let BTCRecoverLine = mc.createBTCRecoverLine(piDigitIndex, piPart, enigmaCodes, args.options);
      BTCRecoverFileText += BTCRecoverLine;
    }
    //debug(BTCRecoverFileText);

    mc.writeFile(args.filename, BTCRecoverFileText, function(error){
      if(!error){
        debug("write went successfully");
      } else {
        debug("an error occured: ", error);
      }
    });

    if(args.options.output){
      callback(BTCRecoverFileText);
      return BTCRecoverFileText;
    }
    
    callback();
    return BTCRecoverFileText;

  };

  // our initializer 
  let init = function(){
    cli = require('./cli')(mc);
    return mc;
  };

  return init();
};
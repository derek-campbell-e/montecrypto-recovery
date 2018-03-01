# MonteCrypto Recovery File Builder

This module is for building the recovery file to get that sweet sweet bitcoin as per [btcrecover](https://github.com/gurnec/btcrecover)

In order to run this code you need:
1. Patience
2. A keen watch on all the enigma code updates
3. A little organization skills
4. [Node.js installed](https://nodejs.org/en/)

## Assumptions regarding how this program works
1. I assume that the order of the words isn't by numerical order (because there's duplicates of course)
2. I assume that the clue found [here](https://www.reddit.com/r/montecrypto/comments/7zkv7k/i_started_to_break_the_game_and_i_found_one/) pertains to the order of the words (there are 24 digits / 24 passwords)
    + `093844609550582231725359`
3. I assume that there is no way to know if you must use the translated or english word or original world

## How to use this program
1. First clone this repo by downloading or running (if you have git installed): ` git clone https://derek-campbell-e@github.com/derek-campbell-e/montecrypto-btcrecovery.git `
2. cd into that directory 
3. In the terminal run `npm install` to install the minimal dependencies
4. Create a .json file named `passwords.json` in the project's root directory, add entries for each room / enigma code using this template

        {
          "ROOM NAME": {
            "number": 0,
            "word": "word",
            "translation": "translatedWord"
          },
          "ANOTHER ROOM NAME": {
            "number": 0,
            "word": "word",
            "translation": "translatedWord"
          }
        }

    Also make sure your json is valid!

5. Once installed, in the terminal type `npm start` 
6. You'll see the command prompt and can enter the command to generate the text file `gen <filenameToWrite> [-o, -N, -T, -W]`

### Text file generation options
`-o` output the contents to the console

`-N` DONT use the numbers as part of the recovery file (I don't know if the numbers are part of the passphrase)

`-T` DONT use the translation of the word, only use the word found from solving the enigma

`-W` DONT use the word found from solving the enigma, only use the translated word(s) (some words may have other translations??)

## Notes
I will update this as much as possible.

I will also write tests just to make sure everything is working as it should

# GOOD LUCK EVERYONE
# cli-learning-cards
Small CLI application for repeating terms with a card system.

## Setup

```bash
git clone git@github.com:ger-benjamin/cli-learning-cards.git

npm install

npm run build
```

Add a `source.json` file with this structure in the `data` folder:

```json
{
  "items": [
    {
      "id": "My beautiful sentence",
      "card": {
        "front": {
          "main": "My beautiful sentence"
        },
        "back": {
          "main": "Ma belle phrase"
        }
      }
    }
  ]
}

```

Or a more complete one, see the possibilities in the `src/source-json.ts` file.

## Run

Running the game and saving it will modify the source file placed in the data
folder!

```bash
npm start
```

## Next steps
 * Add a "help" scene.
 * Add colors.
 * Add a possibility to select the strategy.
 * Add a possibility to start up with a configuration (args)
 * Add a possibility to edit answers.
 * Release and run it without compiling it.
 * Move to deno ?
 * Add import source script.

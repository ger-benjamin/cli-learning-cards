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
      "id": "The money",
      "card": {
        "front": {
          "main": "The Money",
        },
        "back": {
          "main": "L'argent",
        }
      }
    }
  ]
}


Or a more complete one, see the possibilities in the `src/source-json.ts` file.

```

## Run

Running the game and saving it will modify the source file placed in the data
folder!

```bash
npm start
```

## Ideas
 * Add a possibility to edit answers.
 * Add colors.
 * Add a possibility to select the "select card" strategy.
 * Add more choice, random order, time, challenge....
 * Release and run it without compiling it.
 * Move to deno ?
 * Add a json schema and validate source.
 * Add import source script.

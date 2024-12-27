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
      "cards": {
        "front": {
          "key": "The Money",
          "variations": ["The currency", "The cash"]
        },
        "back": {
          "key": "L'argent",
          "variations": ["La devise", "Les liquidités"]
        }
      },
      "last_revision": "2024-12-16T13:33:45.609Z",
      "revision_count": 0,
      "favorite_lvl": 0,
      "errors_last": 0,
      "errors_total": 0
    }
  ]
}
```


## Run

```bash
npm start
```

## Ideas
 * Add a possibility to edit answers.
 * Add colors.
 * Add a "thema" field. Set some fields as optional. Add info about fields.
 * Add a possibility to select the "select card" strategy.
 * Add more choice, random order, time, challenge....
 * Release and run it without compiling it.
 * Move to deno ?
 * Add a json schema and validate source.
 * Add import source script.

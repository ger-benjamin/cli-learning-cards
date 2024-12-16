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
      "source_key_text": "Tree",
      "source_value_text": "Arbre",
      "cards": {
        "Tree": "Arbre"
      },
      "last_revision": "2024-12-16T13:33:45.609Z",
      "revision_count": 0,
      "favorite_lvl": 0,
      "error_count": 0
    }
  ]
}
```


## Run

```bash
npm start
```

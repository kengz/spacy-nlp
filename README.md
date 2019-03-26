# spacy-nlp [![npm version](https://badge.fury.io/js/spacy-nlp.svg)](https://badge.fury.io/js/spacy-nlp) [![CircleCI](https://circleci.com/gh/kengz/spacy-nlp.svg?style=shield)](https://circleci.com/gh/kengz/spacy-nlp) [![Code Climate](https://codeclimate.com/github/kengz/spacy-nlp/badges/gpa.svg)](https://codeclimate.com/github/kengz/spacy-nlp) [![Test Coverage](https://codeclimate.com/github/kengz/spacy-nlp/badges/coverage.svg)](https://codeclimate.com/github/kengz/spacy-nlp/coverage)

Expose Spacy nlp text parsing to Nodejs (and other languages) via socketIO

<!-- TOC -->

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
  - [Syntax Parsing](#syntax-parsing)
  - [Noun Parsing](#noun-parsing)
  - [Verb Parsing](#verb-parsing)
  - [Adjective Parsing](#adjective-parsing)
  - [Named Entity Parsing](#named-entity-parsing)
  - [Date Parsing](#date-parsing)
  - [Time Parsing](#time-parsing)
- [Helpers](#helpers)
  - [Splitting Large Text](#splitting-large-text)
  - [Duplicate Removal](#duplicate-removal)
  - [Top n Words in a String](#top-n-words-in-a-string)

<!-- /TOC -->

## Installation

```shell
# install spacy in python3
python3 -m pip install -U socketIO-client
python3 -m pip install -U spacy==2.1.3
python3 -m spacy download en_core_web_md

# install this npm package
npm i --save spacy-nlp
```

## Usage

```js
const spacyNLP = require("spacy-nlp");
// default port 6466
// start the server with the python client that exposes spacyIO (or use an existing socketIO server at IOPORT)
var serverPromise = spacyNLP.server({ port: process.env.IOPORT });
// Loading spacy may take up to 15s
```

_Note that `python3` is preferred. If you use `python2`, at each run set the env var `USE_PY2=true`._

You'll see log like:

```shell
[Sun Oct 09 2016 16:53:33 GMT-0400 (EDT)] INFO Starting poly-socketio server on port: 6466, expecting 1 IO clients
[Sun Oct 09 2016 16:53:33 GMT-0400 (EDT)] INFO Starting socketIO client for python3 at 6466
[Sun Oct 09 2016 16:53:44 GMT-0400 (EDT)] DEBUG cgkb-py mXjDqupv852zUeMPAAAA joined, 0 remains
[Sun Oct 09 2016 16:53:44 GMT-0400 (EDT)] INFO All 1 IO clients have joined
```

Since it uses [`poly-socketio`](https://github.com/kengz/poly-socketio), there'll be one IO server, and one `global.client`(internal to this module) in the same process, no matter how many times `poly-socketio` is called. This resolves conflicts for cross-project usage.

E.g. [`AIVA`](https://github.com/kengz/aiva) uses `poly-socketio` to start a server for its internal cross-language communication, and uses `spacy-nlp` too. `spacy-nlp` will automatically use the IO server and the `global.client` from `AIVA`.

## Methods

### Syntax Parsing

Once it is ready, i.e. you can use the nodejs client `nlp` to parse texts:

```js
const spacyNLP = require("spacy-nlp");
const nlp = spacyNLP.nlp;

// Note you can pass multiple sentences concat in one string.
nlp.parse("Bob Brought the pizza to Alice.").then(output => {
  console.log(output);
  console.log(JSON.stringify(output[0].parse_tree, null, 2));
});

// Store output into variable
const result = await nlp.parse("Bob Brought the pizza to Alice.");
```

And the output is the syntax parse tree with POS tagging. For the `parse_tree`, `NE` means `Named Entity` for NER; `arc` of an object is incident on it. An arc points from `head` word to `modifier` word. See the explanation on [Tensorflow/syntaxnet](https://github.com/tensorflow/models/tree/master/syntaxnet#dependency-parsing-transition-based-parsing).

```shell
[ { text: 'Bob Brought the pizza to Alice.',
    len: 7,
    tokens: [ 'Bob', 'Brought', 'the', 'pizza', 'to', 'Alice', '.' ],
    noun_phrases: [ 'Bob', 'the pizza', 'Alice' ],
    parse_tree:
     [ { word: 'Brought',
         lemma: 'bring',
         NE: '',
         POS_fine: 'VBD',
         POS_coarse: 'VERB',
         arc: 'ROOT',
         modifiers:
          [ { word: 'Bob',
              lemma: 'Bob',
              NE: 'PERSON',
              POS_fine: 'NNP',
              POS_coarse: 'PROPN',
              arc: 'nsubj',
              modifiers: [] },
            { word: 'pizza',
              lemma: 'pizza',
              NE: '',
              POS_fine: 'NN',
              POS_coarse: 'NOUN',
              arc: 'dobj',
              modifiers:
               [ { word: 'the',
                   lemma: 'the',
                   NE: '',
                   POS_fine: 'DT',
                   POS_coarse: 'DET',
                   arc: 'det',
                   modifiers: [] } ] },
            { word: 'to',
              lemma: 'to',
              NE: '',
              POS_fine: 'IN',
              POS_coarse: 'ADP',
              arc: 'prep',
              modifiers:
               [ { word: 'Alice',
                   lemma: 'Alice',
                   NE: 'PERSON',
                   POS_fine: 'NNP',
                   POS_coarse: 'PROPN',
                   arc: 'pobj',
                   modifiers: [] } ] },
            { word: '.',
              lemma: '.',
              NE: '',
              POS_fine: '.',
              POS_coarse: 'PUNCT',
              arc: 'punct',
              modifiers: [] } ] } ],
    parse_list:
     [ { word: 'Bob',
         lemma: 'Bob',
         NE: 'PERSON',
         POS_fine: 'NNP',
         POS_coarse: 'PROPN' },
       { word: 'Brought',
         lemma: 'bring',
         NE: '',
         POS_fine: 'VBD',
         POS_coarse: 'VERB' },
       { word: 'the',
         lemma: 'the',
         NE: '',
         POS_fine: 'DT',
         POS_coarse: 'DET' },
       { word: 'pizza',
         lemma: 'pizza',
         NE: '',
         POS_fine: 'NN',
         POS_coarse: 'NOUN' },
       { word: 'to',
         lemma: 'to',
         NE: '',
         POS_fine: 'IN',
         POS_coarse: 'ADP' },
       { word: 'Alice',
         lemma: 'Alice',
         NE: 'PERSON',
         POS_fine: 'NNP',
         POS_coarse: 'PROPN' },
       { word: '.',
         lemma: '.',
         NE: '',
         POS_fine: '.',
         POS_coarse: 'PUNCT' } ] } ]
```

### Noun Parsing

```js
// Available options are count (returns the total count) and text (returns the parsed strings) You can specify one or both.
const options = ["count"];

// Note you can pass multiple sentences concat in one string.
nlp
  .parse_nouns(
    "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
    options
  )
  .then(output => {
    console.log(output);
  });

// Store output into variable
const result = await nlp.parse_nouns(
  "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
  options
);

// 19
```

### Verb Parsing

```js
// Available options are count (returns the total count) and text (returns the parsed strings) You can specify one or both.
const options = ["count"];

// Note you can pass multiple sentences concat in one string.
nlp
  .parse_verbs(
    "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
    options
  )
  .then(output => {
    console.log(output);
  });

// Store output into variable
const result = await nlp.parse_verbs(
  "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
  options
);

// 7
```

### Adjective Parsing

```js
// Available options are count (returns the total count) and text (returns the parsed strings) You can specify one or both.
const options = ["count"];

// Note you can pass multiple sentences concat in one string.
nlp
  .parse_adj(
    "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
    options
  )
  .then(output => {
    console.log(output);
  });

// Store output into variable
const result = await nlp.parse_adj(
  "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
  options
);

// 8
```

### Named Entity Parsing

```js
// Available options are count (returns the total count) and text (returns the parsed strings) You can specify one or both.
const options = ["count"];

// Note you can pass multiple sentences concat in one string.
nlp
  .parse_named_entities(
    "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
    options
  )
  .then(output => {
    console.log(output);
  });

// Store output into variable
const result = await nlp.parse_named_entities(
  "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
  options
);

// 8
```

### Date Parsing

```js
// Available options are count (returns the total count) and text (returns the parsed strings) You can specify one or both.
const options = ["text"];

// Note you can pass multiple sentences concat in one string.
nlp
  .parse_date(
    "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
    options
  )
  .then(output => {
    console.log(output);
  });

// Store output into variable
const result = await nlp.parse_date(
  "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
  options
);

// ['22 June 1941', 'from 1939 to 1945']
```

### Time Parsing

```js
// Available options are count (returns the total count) and text (returns the parsed strings) You can specify one or both.
const options = ["count"];

// Note you can pass multiple sentences concat in one string.
nlp
  .parse_time(
    "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
    options
  )
  .then(output => {
    console.log(output);
  });

// Store output into variable
const result = await nlp.parse_time(
  "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
  options
);

// 0
```

## Helpers

The following helper functions are not asynchronous and will not return a promise.

### Splitting Large Text

If you have very large text to process, it's best to split the text as Spacy has a max_length limit of 1,000,000 characters.

```js
const text =
  "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.";

const textArray = nlp.split_text(text);

// ["On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of", "war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often", "abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945."]
```

### Duplicate Removal

If you want to return an array of words, the result will include duplicate strings. To remove duplicates you can use `nlp.remove_duplicates`.

```js
const text =
  "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.";

const verbArray = await nlp.parse_verbs(text);
// ["war", "war", "war", "war", "war", "world", "world", "world", "axis", "axis", "ww2", "wwii", "land", "wehrmacht", "union", "powers", "attrition"]

const result = nlp.remove_duplicates(verbArray);

// ["war", "world", "axis", "ww2", "wwii", "land", "wehrmacht", "union", "powers", "attrition"]
```

### Top n Words in a String

```js
const text =
  "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.";

// Arguments are text and cutoff (Top n Words). Returns an array of objects.
const result = nlp.top_words(text, 5);

[
  { word: "the", count: 6 },
  { word: "of", count: 3 },
  { word: "war", count: 3 },
  { word: "Axis", count: 2 },
  { word: "a", count: 2 }
];
```

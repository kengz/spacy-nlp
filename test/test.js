const Promise = require("bluebird");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();
const spacyNLP = require("../index");
const nlpSpacy = spacyNLP.nlp;

describe("start poly-socketio", () => {
  spacyNLP.server().then(() => {
    global.ioPromise.should.be.fulfilled;
  });

  it("resolve global.ioPromise when all joined", () => {
    var globalClient = spacyNLP.nlp;
    return global.ioPromise;
  });
});

describe("parse", () => {
  it("parse text", async () => {
    const result = await nlpSpacy.parse("Bob Brought the pizza to Alice.");
    chai.assert.deepEqual(result, [
      {
        text: "Bob Brought the pizza to Alice.",
        len: 7,
        tokens: ["Bob", "Brought", "the", "pizza", "to", "Alice", "."],
        noun_phrases: ["Bob", "the pizza", "Alice"],
        parse_tree: [
          {
            word: "Brought",
            lemma: "bring",
            NE: "",
            POS_fine: "VBD",
            POS_coarse: "VERB",
            arc: "ROOT",
            modifiers: [
              {
                word: "Bob",
                lemma: "Bob",
                NE: "PERSON",
                POS_fine: "NNP",
                POS_coarse: "PROPN",
                arc: "nsubj",
                modifiers: []
              },
              {
                word: "pizza",
                lemma: "pizza",
                NE: "",
                POS_fine: "NN",
                POS_coarse: "NOUN",
                arc: "dobj",
                modifiers: [
                  {
                    word: "the",
                    lemma: "the",
                    NE: "",
                    POS_fine: "DT",
                    POS_coarse: "DET",
                    arc: "det",
                    modifiers: []
                  }
                ]
              },
              {
                word: "to",
                lemma: "to",
                NE: "",
                POS_fine: "IN",
                POS_coarse: "ADP",
                arc: "prep",
                modifiers: [
                  {
                    word: "Alice",
                    lemma: "Alice",
                    NE: "PERSON",
                    POS_fine: "NNP",
                    POS_coarse: "PROPN",
                    arc: "pobj",
                    modifiers: []
                  }
                ]
              },
              {
                word: ".",
                lemma: ".",
                NE: "",
                POS_fine: ".",
                POS_coarse: "PUNCT",
                arc: "punct",
                modifiers: []
              }
            ]
          }
        ],
        parse_list: [
          {
            word: "Bob",
            lemma: "Bob",
            NE: "PERSON",
            POS_fine: "NNP",
            POS_coarse: "PROPN"
          },
          {
            word: "Brought",
            lemma: "bring",
            NE: "",
            POS_fine: "VBD",
            POS_coarse: "VERB"
          },
          {
            word: "the",
            lemma: "the",
            NE: "",
            POS_fine: "DT",
            POS_coarse: "DET"
          },
          {
            word: "pizza",
            lemma: "pizza",
            NE: "",
            POS_fine: "NN",
            POS_coarse: "NOUN"
          },
          {
            word: "to",
            lemma: "to",
            NE: "",
            POS_fine: "IN",
            POS_coarse: "ADP"
          },
          {
            word: "Alice",
            lemma: "Alice",
            NE: "PERSON",
            POS_fine: "NNP",
            POS_coarse: "PROPN"
          },
          { word: ".", lemma: ".", NE: "", POS_fine: ".", POS_coarse: "PUNCT" }
        ]
      }
    ]);
  });
});

describe("parse nouns", () => {
  it("parse nouns with words as an option", async () => {
    const options = ["words"];
    const result = await nlpSpacy.parse_nouns(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "words",
        result: [
          "powers",
          "invasion",
          "land",
          "theatre",
          "war",
          "history",
          "war",
          "attrition",
          "war"
        ]
      }
    ]);
  });

  it("parse nouns with count as an option", async () => {
    const options = ["count"];
    const result = await nlpSpacy.parse_nouns(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "count",
        result: 9
      }
    ]);
  });
});

describe("parse verbs", () => {
  it("parse verbs with words as an option", async () => {
    const options = ["words"];
    const result = await nlpSpacy.parse_verbs(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "words",
        result: [
          "launched",
          "opening",
          "trapped",
          "abbreviated",
          "known",
          "was",
          "lasted"
        ]
      }
    ]);
  });

  it("parse verbs with count as an option", async () => {
    const options = ["count"];
    const result = await nlpSpacy.parse_verbs(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "count",
        result: 7
      }
    ]);
  });
});

describe("parse adjectives", () => {
  it("parse adjectives with words as an option", async () => {
    const options = ["words"];
    const result = await nlpSpacy.parse_adj(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "words",
        result: ["largest", "German", "global"]
      }
    ]);
  });

  it("parse adjectives with count as an option", async () => {
    const options = ["count"];
    const result = await nlpSpacy.parse_adj(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "count",
        result: 3
      }
    ]);
  });
});

describe("parse named entities", () => {
  it("parse named entities with words as an option", async () => {
    const options = ["words"];
    const result = await nlpSpacy.parse_named_entities(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "words",
        result: [
          "European",
          "the Soviet Union",
          "Axis",
          "German",
          "Wehrmacht",
          "World War II",
          "WWII",
          "WW2",
          "the Second World War"
        ]
      }
    ]);
  });

  it("parse named entities with count as an option", async () => {
    const options = ["count"];
    const result = await nlpSpacy.parse_named_entities(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "count",
        result: 9
      }
    ]);
  });
});

describe("parse dates", () => {
  it("parse dates with words as an option", async () => {
    const options = ["words"];
    const result = await nlpSpacy.parse_date(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "words",
        result: ["22 June 1941", "from 1939 to 1945"]
      }
    ]);
  });

  it("parse dates with count as an option", async () => {
    const options = ["count"];
    const result = await nlpSpacy.parse_date(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "count",
        result: 2
      }
    ]);
  });
});

describe("parse time", () => {
  it("parse time with words as an option", async () => {
    const options = ["words"];
    const result = await nlpSpacy.parse_time(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "words",
        result: []
      }
    ]);
  });

  it("parse time with count as an option", async () => {
    const options = ["count"];
    const result = await nlpSpacy.parse_time(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    );
    chai.assert.deepEqual(result, [
      {
        type: "count",
        result: 0
      }
    ]);
  });
});

describe("split text", () => {
  it("split text into 3 chuncks", () => {
    const result = nlpSpacy.split_text(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945."
    );
    chai.assert.deepEqual(result, [
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of",
      "war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often",
      "abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945."
    ]);
  });
});

describe("remove duplicates", () => {
  it("remove dupliates from an array", () => {
    const result = nlpSpacy.remove_duplicates([
      "war",
      "war",
      "war",
      "war",
      "war",
      "world",
      "world",
      "world",
      "axis",
      "axis",
      "ww2",
      "wwii",
      "land",
      "wehrmacht",
      "union",
      "powers",
      "attrition"
    ]);
    chai.assert.deepEqual(result, [
      "war",
      "world",
      "axis",
      "ww2",
      "wwii",
      "land",
      "wehrmacht",
      "union",
      "powers",
      "attrition"
    ]);
  });

  describe("get top words", () => {
    it("get the 5 top words in a string", () => {
      const text =
        "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.";

      const result = nlpSpacy.top_words(text, 5);

      chai.assert.deepEqual(result, [
        { word: "the", count: 6 },
        { word: "of", count: 3 },
        { word: "war", count: 3 },
        { word: "Axis", count: 2 },
        { word: "a", count: 2 }
      ]);
    });
  });
});

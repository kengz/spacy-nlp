// assuming server is started and ready
const polyIO = require("poly-socketio");
/* istanbul ignore next */
process.env.IOPORT = process.env.IOPORT || 6466;

function parse(text) {
  polyIO.client({ port: process.env.IOPORT });
  const msg = {
    input: text,
    to: "nlp.cgkb-py",
    intent: "parse"
  };
  return global.client.pass(msg).then(reply => {
    return reply.output;
  });
}

function parse_nouns(text, options) {
  polyIO.client({ port: process.env.IOPORT });
  const msg = {
    input: [text],
    options: options,
    to: "nlp.cgkb-py",
    intent: "parse_nouns"
  };
  return global.client.pass(msg).then(reply => {
    return reply.output;
  });
}

function parse_verbs(text, options) {
  polyIO.client({ port: process.env.IOPORT });
  const msg = {
    input: [text],
    options: options,
    to: "nlp.cgkb-py",
    intent: "parse_verbs"
  };
  return global.client.pass(msg).then(reply => {
    return reply.output;
  });
}

function parse_adj(text, options) {
  polyIO.client({ port: process.env.IOPORT });
  const msg = {
    input: [text],
    options: options,
    to: "nlp.cgkb-py",
    intent: "parse_adj"
  };
  return global.client.pass(msg).then(reply => {
    return reply.output;
  });
}

function parse_named_entities(text, options) {
  polyIO.client({ port: process.env.IOPORT });
  const msg = {
    input: [text],
    options: options,
    to: "nlp.cgkb-py",
    intent: "parse_named_entities"
  };
  return global.client.pass(msg).then(reply => {
    return reply.output;
  });
}

function parse_date(text, options) {
  polyIO.client({ port: process.env.IOPORT });
  const msg = {
    input: [text],
    options: options,
    to: "nlp.cgkb-py",
    intent: "parse_date"
  };
  return global.client.pass(msg).then(reply => {
    return reply.output;
  });
}

function parse_time(text, options) {
  polyIO.client({ port: process.env.IOPORT });
  const msg = {
    input: [text],
    options: options,
    to: "nlp.cgkb-py",
    intent: "parse_time"
  };
  return global.client.pass(msg).then(reply => {
    return reply.output;
  });
}

function split_text(text) {
  let wordArray = [];
  const tokens = text.split(" ");
  const n = Math.floor(tokens.length / 3);
  const n1 = tokens.slice(0, n).join(" ");
  const n2 = tokens.slice(n, n * 2).join(" ");
  const n3 = tokens.slice(n * 2, tokens.length).join(" ");
  wordArray.push(n1, n2, n3);
  return wordArray;
}

function remove_duplicates(input) {
  const filterResult = input.map(x => String(x).trim());
  const finalResult = [...new Set(filterResult)];
  return finalResult;
}

function top_words(string, cutOff) {
  const re = /'?\w[\w']*(?:-\w+)*'?/g;
  let words = string.match(re);
  let frequencies = {};
  let word;

  for (let i = 0; i < words.length; i++) {
    word = words[i];
    frequencies[word] = frequencies[word] || 0;
    frequencies[word]++;
  }
  const result = Object.keys(frequencies).map(key => [key, frequencies[key]]);

  const sortedResult = result.sort((a, b) => b[1] - a[1]).slice(0, cutOff);
  let finalResult = [];
  for (let x = 0; x < sortedResult.length; x++) {
    const resultObject = {
      word: sortedResult[x][0],
      count: sortedResult[x][1]
    };
    finalResult.push(resultObject);
  }
  return finalResult;
}

module.exports = {
  parse: parse,
  parse_nouns: parse_nouns,
  parse_verbs: parse_verbs,
  parse_adj: parse_adj,
  parse_named_entities: parse_named_entities,
  parse_date: parse_date,
  parse_time: parse_time,
  split_text: split_text,
  remove_duplicates: remove_duplicates,
  top_words: top_words
};

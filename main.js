const spacyNLP = require("./index.js");

const serverPromise = spacyNLP.server({ port: 9551 });
const nlpSpacy = spacyNLP.nlp;

const options = ["words"];

setTimeout(() => {
  nlpSpacy
    .parse_nouns(
      "On 22 June 1941, the European Axis powers launched an invasion of the Soviet Union, opening the largest land theatre of war in history, which trapped the Axis, most crucially the German Wehrmacht, into a war of attrition. World War II (often abbreviated to WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945.",
      options
    )
    .then(output => {
      console.log(output);
    });
}, 15000);

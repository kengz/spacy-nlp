from collections import OrderedDict
import spacy  # NLP with spaCy https://spacy.io
nlp = spacy.load('en_core_web_md')  # will take some time to load

# Helper methods
##########################################


def merge_ents(doc):
    '''Helper: merge adjacent entities into single tokens; modifies the doc.'''
    for ent in doc.ents:
        ent.merge(ent.root.tag_, ent.text, ent.label_)
    return doc


def format_POS(token, light=False, flat=False):
    '''helper: form the POS output for a token'''
    subtree = OrderedDict([
        ("word", token.text),
        ("lemma", token.lemma_),  # trigger
        ("NE", token.ent_type_),  # trigger
        ("POS_fine", token.tag_),
        ("POS_coarse", token.pos_),
        ("arc", token.dep_),
        ("modifiers", [])
    ])
    if light:
        subtree.pop("lemma")
        subtree.pop("NE")
    if flat:
        subtree.pop("arc")
        subtree.pop("modifiers")
    return subtree


def POS_tree_(root, light=False):
    '''
    Helper: generate a POS tree for a root token.
    The doc must have merge_ents(doc) ran on it.
    '''
    subtree = format_POS(root, light=light)
    for c in root.children:
        subtree["modifiers"].append(POS_tree_(c))
    return subtree


def parse_tree(doc, light=False):
    '''generate the POS tree for all sentences in a doc'''
    merge_ents(doc)  # merge the entities into single tokens first
    return [POS_tree_(sent.root, light=light) for sent in doc.sents]


def parse_list(doc, light=False):
    '''tag the doc first by NER (merged as tokens) then
    POS. Can be seen as the flat version of parse_tree'''
    merge_ents(doc)  # merge the entities into single tokens first
    return [format_POS(token, light=light, flat=True) for token in doc]

# s = "find me flights from New York to London next month"
# doc = nlp(s)
# parse_list(doc)


# Primary methods
##########################################

def parse_sentence(sentence):
    '''
    Main method: parse an input sentence and return the nlp properties.
    '''
    doc = nlp(sentence)
    reply = OrderedDict([
        ("text", doc.text),
        ("len", len(doc)),
        ("tokens", [token.text for token in doc]),
        ("noun_phrases", [token.text for token in doc.noun_chunks]),
        ("parse_tree", parse_tree(doc)),
        ("parse_list", parse_list(doc))
    ])
    return reply

# res = parse_sentence("find me flights from New York to London next month.")


def parse(input):
    '''
    parse for multi-sentences; split and apply parse in a list.
    '''
    doc = nlp(input)
    return [parse_sentence(sent.text) for sent in doc.sents]

# print(parse("Bob brought the pizza to Alice. I saw the man with glasses."))


def parse_nouns(input, options):
    nounCount = 0
    nounArray = []
    resultArray = []
    for doc in nlp.pipe(input, disable=['ner', 'parser', 'textcat']):
        for token in doc:
            if 'count' in options:
                if token.pos_ == 'NOUN':
                    nounCount += 1
            if 'words' in options:
                if token.pos_ == 'NOUN':
                    nounArray.append(token.text)
    if 'count' in options:
        inner = {}
        inner['type'] = 'count'
        inner['result'] = nounCount
        resultArray.append(inner)
    if 'words' in options:
        inner = {}
        inner['type'] = 'words'
        inner['result'] = nounArray
        resultArray.append(inner)
    return resultArray


def parse_verbs(input, options):
    verbCount = 0
    verbArray = []
    resultArray = []
    for doc in nlp.pipe(input, disable=['ner', 'parser', 'textcat']):
        for token in doc:
            if 'count' in options:
                if token.pos_ == 'VERB':
                    verbCount += 1
            if 'words' in options:
                if token.pos_ == 'VERB':
                    verbArray.append(token.text)
    if 'count' in options:
        inner = {}
        inner['type'] = 'count'
        inner['result'] = verbCount
        resultArray.append(inner)
    if 'words' in options:
        inner = {}
        inner['type'] = 'words'
        inner['result'] = verbArray
        resultArray.append(inner)
    return resultArray


def parse_adj(input, options):
    adjCount = 0
    adjArray = []
    resultArray = []
    for doc in nlp.pipe(input, disable=['ner', 'parser', 'textcat']):
        for token in doc:
            if 'count' in options:
                if token.pos_ == 'ADJ':
                    adjCount += 1
            if 'words' in options:
                if token.pos_ == 'ADJ':
                    adjArray.append(token.text)
    if 'count' in options:
        inner = {}
        inner['type'] = 'count'
        inner['result'] = adjCount
        resultArray.append(inner)
    if 'words' in options:
        inner = {}
        inner['type'] = 'words'
        inner['result'] = adjArray
        resultArray.append(inner)
    return resultArray


def parse_named_entities(input, options):
    entCount = 0
    entArray = []
    resultArray = []
    for doc in nlp.pipe(input, disable=['textcat']):
        for ent in doc.ents:
            if 'count' in options:
                if ent.label_ not in {'DATE', 'TIME', 'ORDINAL', 'QUANTITY', 'PERCENT', 'CARDINAL', 'MONEY'}:
                    entCount += 1
            if 'words' in options:
                if ent.label_ not in {'DATE', 'TIME', 'ORDINAL', 'QUANTITY', 'PERCENT', 'CARDINAL', 'MONEY'}:
                    entArray.append(ent.text)
    if 'count' in options:
        inner = {}
        inner['type'] = 'count'
        inner['result'] = entCount
        resultArray.append(inner)
    if 'words' in options:
        inner = {}
        inner['type'] = 'words'
        inner['result'] = entArray
        resultArray.append(inner)
    return resultArray


def parse_date(input, options):
    dateCount = 0
    dateArray = []
    resultArray = []
    for doc in nlp.pipe(input, disable=['textcat']):
        for ent in doc.ents:
            if 'count' in options:
                if ent.label_ == 'DATE':
                    dateCount += 1
            if 'words' in options:
                if ent.label_ == 'DATE':
                    dateArray.append(ent.text)
    if 'count' in options:
        inner = {}
        inner['type'] = 'count'
        inner['result'] = dateCount
        resultArray.append(inner)
    if 'words' in options:
        inner = {}
        inner['type'] = 'words'
        inner['result'] = dateArray
        resultArray.append(inner)
    return resultArray


def parse_time(input, options):
    timeCount = 0
    timeArray = []
    resultArray = []
    for doc in nlp.pipe(input, disable=['textcat']):
        for ent in doc.ents:
            if 'count' in options:
                if ent.label_ == 'TIME':
                    timeCount += 1
            if 'words' in options:
                if ent.label_ == 'TIME':
                    timeArray.append(ent.text)
    if 'count' in options:
        inner = {}
        inner['type'] = 'count'
        inner['result'] = timeCount
        resultArray.append(inner)
    if 'words' in options:
        inner = {}
        inner['type'] = 'words'
        inner['result'] = timeArray
        resultArray.append(inner)
    return resultArray

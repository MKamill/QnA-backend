from transformers import BertForQuestionAnswering, AutoTokenizer
from transformers import pipeline
from flask import request
import flask
from flask_cors import CORS

modelname = 'deepset/bert-base-cased-squad2'
model = BertForQuestionAnswering.from_pretrained(modelname)
tokenizer = AutoTokenizer.from_pretrained(modelname)

nlp = pipeline('question-answering', model=model, tokenizer=tokenizer)

def readContext(fileName):
    return open(fileName).read()

context = readContext('context.txt')

server = flask.Flask(__name__)
cors = CORS(server, resources={r'/': {'origins': '*'}})
server.config['DEBUG'] = True

def getAnswer(question):
    return nlp({'question': question, 'context': context})['answer']

@server.route('/', methods=['GET'])
def home(): 
    return getAnswer(request.args.get('question'))

server.run()
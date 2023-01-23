# all imported packages needs to be installed on the virtual environment (flask_server) 
# cd to flask_server\env and run Scripts\activate this will activate the env
# then run all pip installs needed 
from flask import *
import pandas as pd
import numpy as np
import spacy_sentence_bert
from sklearn.metrics.pairwise import cosine_similarity 
import csv
import os

dirname = os.path.dirname(__file__)

app = Flask(__name__, static_folder='../build', static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route("/api/readCsv")
def readCsv():
    json_data = {}
     # Open a csv reader called DictReader
     
    with open(os.path.join(dirname, 'data.csv')) as csvf:
        csvReader = csv.DictReader(csvf)
        for row in csvReader:
            key_symptom = row['symptomA']
            key_symptom_value = {row['symptomB'] : {
                row['symptomC'] : row['problem']
            }}

            if key_symptom not in json_data:
                json_data[key_symptom] = {}

            if row['symptomB'] not in json_data[key_symptom].keys():
                json_data[key_symptom][row['symptomB']] = {}
            
            else:
                json_data[key_symptom][row['symptomB']][row['symptomC']] = row['problem']

        print("-------> json_data : ", json.dumps(json_data, indent=4))

    return json.dumps(json_data, indent=4)


@app.route("/api/getGaragesListByLambda/<problem>/<lam>")
def getGaragesListByLambda(problem, lam):
    lamValue = np.float16(lam)
    garage_df = pd.read_csv(os.path.join(dirname, 'garage_data.csv'))
    rank_df = garage_df[garage_df.problem == problem]
    sum_dist, sum_price = rank_df["distance"].sum(), rank_df["price"].sum()
    #rank_df
    rank_df["score"] = rank_df.apply(lambda row: lamValue*int(row["distance"])/sum_dist + (1-lamValue)*int(row["price"])/sum_price, axis = 1)
    rank_df = rank_df.sort_values("score")
    return rank_df.to_json(orient="records")

@app.route('/api/getFreeText/<free_text>')
def getFreeText(free_text):
    nlp = spacy_sentence_bert.load_model('en_stsb_distilbert_base')
    df = pd.read_csv(os.path.join(dirname, 'data.csv'))
    df["text"] = df["symptomA"] +" "+ df["symptomB"] +" "+ df["symptomC"] +" "+ df["problem"]
    df["vector"] = df["text"].apply(lambda x: nlp(x).vector)
    free_vector = nlp(free_text).vector
    df["free_score"] = df["vector"].apply(lambda x: cosine_similarity(x.reshape(1, -1),free_vector.reshape(1, -1))[0][0])
    result = (df.sort_values("free_score", ascending = False))[:3]
    return result.to_json(orient="records")


if __name__ == "__main__":
    app.run(debug=True)
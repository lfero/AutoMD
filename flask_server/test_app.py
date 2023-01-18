# all imported packages needs to be installed on the virtual environment (flask_server) 
# cd to flask_server\env and run Scripts\activate this will activate the env
# then run all pip installs needed 
from flask import *
import pandas as pd
import numpy as np
import spacy_sentence_bert
from sklearn.metrics.pairwise import cosine_similarity 
import csv

app = Flask(__name__)

@app.route("/readCsv")
def readCsv():
    json_data = {}
     # Open a csv reader called DictReader
    with open(r'C:\Users\lfero\OneDrive - Intel Corporation\Desktop\autoMD_app\flask_server\data.csv') as csvf:
        csvReader = csv.DictReader(csvf)
        for row in csvReader:
            key_symptom = row['symptomA']
            key_symptom_value = {row['symptomB'] : {
                row['symptomC'] : row['problem']
            }}

            if key_symptom not in json_data:
                #print("11111111 new symptom A: ", key_symptom)
                json_data[key_symptom] = {}

            if row['symptomB'] not in json_data[key_symptom].keys():
                #print("22222222 row['symptomB']: ", row['symptomB'] )
                #print("22222222 not in json_data[key_symptom].keys(): ", json_data[key_symptom].keys())
                #json_data[key_symptom] = key_symptom_value
                json_data[key_symptom][row['symptomB']] = {}
            
            else:
                json_data[key_symptom][row['symptomB']][row['symptomC']] = row['problem']

        print("-------> json_data : ", json.dumps(json_data, indent=4))

    return json.dumps(json_data, indent=4)

@app.route('/getGaragesByProblem/<problem>')
def getGaragesByProblem(problem):
    garage_df = pd.read_csv(r'C:\Users\lfero\OneDrive - Intel Corporation\Desktop\autoMD_app\flask_server\garage_data.csv')
    df_by_problem = garage_df[garage_df.problem == problem]
    return df_by_problem.to_json(orient="records")

@app.route("/getGaragesListByLambda/<problem>/<lam>")
def getGaragesListByLambda(problem, lam):
    lamValue = np.float16(lam)
    garage_df = pd.read_csv(r'C:\Users\lfero\OneDrive - Intel Corporation\Desktop\autoMD_app\flask_server\garage_data.csv')
    rank_df = garage_df[garage_df.problem == problem]
    sum_dist, sum_price = rank_df["distance"].sum(), rank_df["price"].sum()
    #rank_df
    rank_df["score"] = rank_df.apply(lambda row: lamValue*int(row["distance"])/sum_dist + (1-lamValue)*int(row["price"])/sum_price, axis = 1)
    rank_df = rank_df.sort_values("score")
    return rank_df.to_json(orient="records")

@app.route('/getFreeText/<free_text>')
def getFreeText(free_text):
    nlp = spacy_sentence_bert.load_model('en_stsb_distilbert_base')
    df = pd.read_csv(r'C:\Users\lfero\OneDrive - Intel Corporation\Desktop\autoMD_app\flask_server\data.csv')
    df["text"] = df["symptomA"] +" "+ df["symptomB"] +" "+ df["symptomC"] +" "+ df["problem"]
    df["vector"] = df["text"].apply(lambda x: nlp(x).vector)
    free_vector = nlp(free_text).vector
    df["free_score"] = df["vector"].apply(lambda x: cosine_similarity(x.reshape(1, -1),free_vector.reshape(1, -1))[0][0])
    result = (df.sort_values("free_score", ascending = False))[:3]
    return result.to_json(orient="records")


if __name__ == "__main__":
    app.run(debug=True)
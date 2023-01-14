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
                json_data[key_symptom] = {}

            if row['symptomB'] not in json_data[key_symptom].keys():
                json_data[key_symptom] = key_symptom_value
            
            else:
                json_data[key_symptom][row['symptomB']][row['symptomC']] = row['problem']

        print("-------> json_data : ", json.dumps(json_data, indent=4))

    return json.dumps(json_data, indent=4)

@app.route('/getGaragesByProblem/<problem>')
def getGaragesByProblem(problem):
    garage_df = pd.read_csv(r'C:\Users\lfero\OneDrive - Intel Corporation\Desktop\autoMD_app\flask_server\garage_data.csv')
    df_by_problem = garage_df[garage_df.problem == problem]
    return df_by_problem.to_json(orient="records")

@app.route("/getGaragesList")
def getGaragesList(lam=0.5):
    '''
    df = pd.read_csv("data.csv")
    problems = list(set(df.problem))
    garage_names = ["Grease Monkey Mechanics","The Wrench Whisperers","Clutch & Cogs Garage"]
    data = []
    for garage in garage_names:
        data.append({"garage name":garage, "distance (meters)":np.random.randint(10,50)*100})
    garage_df = pd.DataFrame(data)
    garage_df = garage_df.merge(df["problem"], how = "cross")
    garage_df["price (shekels)"] = np.random.randint(20,50, size=len(garage_df))*100
    garage_df.to_csv("garage_data.csv", index = False)'''

    garage_df = pd.read_csv(r'C:\Users\lfero\OneDrive - Intel Corporation\Desktop\autoMD_app\flask_server\garage_data.csv')
    print("*************** garage_df", garage_df)
    lam = 0.2 #lam
    problem = problems[1]
    rank_df = garage_df[garage_df.problem == problem]
    sum_dist, sum_price = rank_df["distance (meters)"].sum(), rank_df["price (shekels)"].sum()
    #rank_df
    rank_df["score"] = rank_df.apply(lambda row: lam*row["distance (meters)"]/sum_dist + (1-lam)*row["price (shekels)"]/sum_price, axis = 1)
    rank_df = rank_df.sort_values("score")
    return rank_df

@app.route('/getFreeText/<free_text>')
def getFreeText(free_text):
    nlp = spacy_sentence_bert.load_model('en_stsb_distilbert_base')
    df = pd.read_csv(r'C:\Users\lfero\OneDrive - Intel Corporation\Desktop\autoMD_app\flask_server\data.csv')
    df["text"] = df["symptomA"] +" "+ df["symptomB"] +" "+ df["symptomC"] +" "+ df["problem"]
    df["vector"] = df["text"].apply(lambda x: nlp(x).vector)
    free_vector = nlp(free_text).vector
    df["free_score"] = df["vector"].apply(lambda x: cosine_similarity(x.reshape(1, -1),free_vector.reshape(1, -1))[0][0])
    result = df.sort_values("free_score", ascending = False)
    return result.to_json(orient="records")


if __name__ == "__main__":
    app.run(debug=True)
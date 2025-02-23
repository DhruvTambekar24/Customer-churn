from pyspark.ml.classification import RandomForestClassifier
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("ChurnPrediction").getOrCreate()
model = RandomForestClassifier.load("churn_model_spark")

predictions = model.transform(new_data)
predictions.show()

# Data Hub Example: Integrating Insurance Customer Data

## Scenario

- Sunrise Insurance has bought two other insurance companies, Advantage Insurance and Bedrock Insurance.
- Each company has a database of customers; in each database, customers are represented differently.
- Sunrise Insurance wants to integrate the customers from Advantage and Bedrock with its own.
- Sunrise Insurance wants to enrich Advantage Insurance data via a custom step called enrichAdvantage that
    - Takes the U.S. five-digit zip code from a customer document
    - Looks up the corresponding latitude and longitude coordinates
      - This is achieved by calling a library(zipcodeData.sjs) invoked within the custom step 
    - Writes those coordinates as new document properties

## Prerequisites

- Docker environment
- Have valid docker credentials in `$DOCKERUSER` and `$DOCKERPW`
- Java 8
- MarkLogic Data Hub Quickstart 5.0.2
- Commands are based on OSX/Linux shell

## Run MarkLogic 10 from Docker Hub

Open the Docker Hub at https://hub.docker.com/_/marklogic, login with your credentials, and checkout the MarkLogic Developer version.

On the host machine:

```sh
docker login -u $DOCKERUSER -p $DOCKERPW
docker run -d -it -p 8000-8020:8000-8020 \
     -v `pwd`/MarkLogic:/var/opt/MarkLogic \
     -e MARKLOGIC_INIT=true \
     -e MARKLOGIC_ADMIN_USERNAME=admin \
     -e MARKLOGIC_ADMIN_PASSWORD=admin \
     --name insurance store/marklogicdb/marklogic-server:10.0-2-dev-centos
```

## Run MarkLogic Data Hub Quickstart

On the host machine:

```sh
java -jar marklogic-datahub-5.0.2.war
```

## Run Pipes

On the host machine:

```sh
java -jar marklogic-pipes-1.0-beta.1.jar --deployBackend=true
```


## Predefined Flows

The project has flows predefined for integrating the customer data.

- **AdvantageFlow**: Has steps for ingesting and mapping Advantage customer data.
- **BedrockFlow**: Has steps for ingesting and mapping Bedrock customer data.
- **CustomerMastering**: Has a mastering step for matching and merging duplicate customers across the Advantage and Bedrock datasets.

There is also a flow to enrich data (OPTIONAL)

- **customEnrichment**: Has steps for ingestion and a custom step to enrich customer data

You can finish configuring the flows and run the steps to complete the integration.

## How to Integrate the Customer Data

1. View the `AdvantageFlow` flow. Configure the `AdvantageIngest` step by setting the Source Directory Path to the `datasets/advantage` directory (exact path will depend on your filesystem).
1. Ingest the Advantage dataset by running the `AdvantageIngest` step. This ingests 100 Advantage customer documents into the staging database. You can view the documents in the Browse Data view.
1. With the Advantage customer data ingested, configure the `AdvantageMap` step in the `AdvantageFlow` flow.
1. Run the `AdvantageMap` step in the `AdvantageFlow` flow. This harmonizes the 100 Advantage customer documents into the final database. You can view the documents in the Browse Data view.
1. View the `BedrockFlow` flow. Configure the `BedrockIngest` step by setting the Source Directory Path to the `datasets/bedrock` directory (exact path will depend on your filesystem).
1. Ingest the Bedrock dataset by running the `BedrockIngest` step. This ingests 100 Bedrock customer documents into the staging database. You can view the documents in the Browse Data view.
1. With the Bedrock customer data ingested, configure the `BedrockMap` step in the `BedrockFlow` flow.
1. Run the `BedrockMap` step in the `BedrockFlow` flow. This harmonizes the 100 Bedrock customer documents into the final database. You can view the documents in the Browse Data view.
1. Run the `CustomerMaster` flow to master the Advantage and Bedrock customer data. This merges documents for two matching customers in the final database. You can view the results in the Browse Data view.


## How to Enrich Customer Data Using Custom Step (OPTIONAL)

1. Using Data Hub QuickStart with a clean MarkLogic server, select and install the example project folder: examples/insurance. Skip this step if this insurance example has been installed already
1. View the `AdvantageEnrichment` flow. It has 2 steps, one for ingestion called `AdvantageIngest` and a custom step called `AdvantageEnrich`
1. Configure the `AdvantageIngest` step by setting the Source Directory Path to the `datasets/advantage` directory (exact path will depend on your filesystem)
1. View the custom step `AdvantageEnrich`. It was created by selecting the type as "Custom" when creating a new step. When adding a custom step to a flow, Data Hub generates a scaffolded custom module for that step at: `src/main/ml-modules/root/custom-modules/custom/STEPNAME/main.sjs`. In this example, the custom module for `AdvantageEnrich` has been edited to enrich the instances with geospatial information corresponding to the postal codes.  The resulting URI has also been prepended with `/enriched` in the FINAL database  
1. Run the `AdvantageEnrichment` flow. This ingests and enriches the Advantage customer documents. You can view the enriched documents in the Browse Data view against FINAL database

## Example Customer Data

### Advantage Customer (JSON)

```
{
  "ObjectID": {
    "$oid": "5cd0da4d1d6d56542262c347"
  },
  "CustomerID": "82ff687e-210c-42c2-9f33-907a45929c73",
  "FirstName": "Alice",
  "LastName": "Hopper",
  "Email": "alicehopper@comvex.com",
  "Postal": "87779-4238",
  "Phone": "(870) 409-2724",
  "PIN": 6454,
  "Updated": "2015-05-17T08:24:16"
}
```

### Snippet of Enriched Data

```
"instance": {
  "ObjectID": {
    "$oid": "5cd0da4d4162c033d57dc2f6"
  },
  "CustomerID": "bc0dd434-232b-4ff9-bef9-c0cd2fcb72be",
  "FirstName": "Camille",
  "LastName": "Case",
  "Email": "camillecase@comvex.com",
  "Postal": "45348-4317",
  "Phone": "(935) 438-3459",
  "PIN": 4019,
  "Updated": "2018-02-12T03:33:41",
  "latitude": "40.316833",
  "longitude": "-84.633911"
}
```

### Bedrock Insurance Customer (CSV)

```
id, first_name, last_name, email, zip, pin, insurance_id, last_updated
22, Gisella, Raven, gravenl@furl.net, 186018, 4369, BTGbvwJw, 2010-09-06T15:09:40
```

## Sunrise Insurance Target Entity

```
CUSTOMER
id         string
firstname  string
lastname   string
postal     string
phone      string
email      string
pin        int
updated    dateTime
```

## Show Operational use-case
Open the default search endpoint at http://localhost:8011/v1/search and search for Ms. gates using q=Gates
You could also use Postman to do this.

Additionally pull the document from the Data Hub at http://localhost:8011/v1/documents using uri=<uri id>.

## Show analytical use-case
Use MS Power BI using DirectQuery connector to connect to MarkLogic. In order to enable this, an ODBC server has been created within MarkLogic Server running on port 8014, during deployment.

Now connect to the ODBC endpoint using odbc://localhost:8014 (or 10.0.2.2:8014 on Virtualbox) and show that PBI is able to fetch the data based on the entity defintion 'Customer'.

## Show Data Scientist use-case
For this use-case, use your favorite Jupyter Notebook environment. For instance the excellent package from Anaconda: https://www.anaconda.com/

### Run Jupyter as Data Scientist environment

```sh
jupyter notebook
```
### Use the Jupyter notebook for retrieving data

Open the Jupyter notebook at http://0.0.0.0:8888/. Open the 'Get_SQL_from_DataHub.ipynb' notebook and run in sequence.

This step retrieves the data from the Data Hub using SQL so it can be used by the Data Scientist.
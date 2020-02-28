const DataHub = require("/data-hub/5/datahub.sjs");
var gHelper  = require("/custom-modules/pipes/graphHelper")
const datahub = new DataHub();


function getGraphDefinition() {

  return {"models":[{"label":"rawBedrock","collection":"rawBedrock","source":"Sources","fields":[{"label":"email [id11]","field":"email","value":"email","path":"/envelope/instance/text('email')","type":3,"children":[],"parent":"/envelope/instance"},{"label":"first_name [id9]","field":"first_name","value":"first_name","path":"/envelope/instance/text('first_name')","type":3,"children":[],"parent":"/envelope/instance"},{"label":"id [id8]","field":"id","value":"id","path":"/envelope/instance/text('id')","type":3,"children":[],"parent":"/envelope/instance"},{"label":"insurance_id [id14]","field":"insurance_id","value":"insurance_id","path":"/envelope/instance/text('insurance_id')","type":3,"children":[],"parent":"/envelope/instance"},{"label":"last_name [id10]","field":"last_name","value":"last_name","path":"/envelope/instance/text('last_name')","type":3,"children":[],"parent":"/envelope/instance"},{"label":"last_updated [id15]","field":"last_updated","value":"last_updated","path":"/envelope/instance/text('last_updated')","type":3,"children":[],"parent":"/envelope/instance"},{"label":"pin [id13]","field":"pin","value":"pin","path":"/envelope/instance/text('pin')","type":3,"children":[],"parent":"/envelope/instance"},{"label":"zip [id12]","field":"zip","value":"zip","path":"/envelope/instance/text('zip')","type":3,"children":[],"parent":"/envelope/instance"}],"options":["nodeInput","fieldsOutputs"],"metadata":{"dateCreated":"2020-02-28T12:17:16.385Z"}},{"label":"Customer","collection":"Customer","source":"Entities","fields":[{"label":"email","field":"email","path":"//email"},{"label":"firstname","field":"firstname","path":"//firstname"},{"label":"id","field":"id","path":"//id"},{"label":"lastname","field":"lastname","path":"//lastname"},{"label":"phone","field":"phone","path":"//phone"},{"label":"pin","field":"pin","path":"//pin"},{"label":"postal","field":"postal","path":"//postal"},{"label":"updated","field":"updated","path":"//updated"}],"options":["fieldsInputs","nodeOutput"]}],"executionGraph":{"last_node_id":5,"last_link_id":12,"nodes":[{"id":2,"type":"dhf/output","pos":[1514,684],"size":[180,160],"flags":{},"order":4,"mode":0,"inputs":[{"name":"output","type":0,"link":2}],"properties":{}},{"id":1,"type":"dhf/input","pos":[117,223],"size":[180,60],"flags":{},"order":0,"mode":0,"outputs":[{"name":"input","type":"","links":[1,4]},{"name":"uri","type":"","links":[5]},{"name":"collections","type":"","links":null}],"properties":{}},{"id":3,"type":"Sources/rawBedrock","pos":[373,333],"size":[305,228],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Node","type":0,"link":1}],"outputs":[{"name":"email","links":[6]},{"name":"first_name","links":[7]},{"name":"id","links":[8]},{"name":"insurance_id","links":null},{"name":"last_name","links":[9]},{"name":"last_updated","links":[10]},{"name":"pin","links":[11]},{"name":"zip","links":[12]}],"properties":{},"widgets_values":[true]},{"id":4,"type":"Entities/Customer","pos":[874,356],"size":[305,228],"flags":{},"order":2,"mode":0,"inputs":[{"name":"email","type":0,"link":6},{"name":"firstname","type":0,"link":7},{"name":"id","type":0,"link":8},{"name":"lastname","type":0,"link":9},{"name":"phone","type":0,"link":null},{"name":"pin","type":0,"link":11},{"name":"postal","type":0,"link":12},{"name":"updated","type":0,"link":10}],"outputs":[{"name":"Node","type":"Node","links":[3]},{"name":"Prov","type":null,"links":null}],"properties":{},"widgets_values":[true]},{"id":5,"type":"dhf/envelope","pos":[1250,669],"size":[180,160],"flags":{},"order":3,"mode":0,"inputs":[{"name":"headers","type":0,"link":null},{"name":"triples","type":0,"link":null},{"name":"instance","type":0,"link":3},{"name":"attachments","type":0,"link":4},{"name":"uri","type":0,"link":5},{"name":"collections","type":0,"link":null}],"outputs":[{"name":"output","type":null,"links":[2]}],"properties":{}}],"links":[[1,1,0,3,0,0],[2,5,0,2,0,0],[3,4,0,5,2,0],[4,1,0,5,3,0],[5,1,1,5,4,0],[6,3,0,4,0,0],[7,3,1,4,1,0],[8,3,2,4,2,0],[9,3,4,4,3,0],[10,3,5,4,7,0],[11,3,6,4,5,0],[12,3,7,4,6,0]],"groups":[],"config":{},"version":0.4}}}

function main(content, options) {

  //grab the doc id/uri
  let id = content.uri;

  //here we can grab and manipulate the context metadata attached to the document
  let context = content.context;

  //let's set our output format, so we know what we're exporting
  let outputFormat = options.outputFormat ? options.outputFormat.toLowerCase() : datahub.flow.consts.DEFAULT_FORMAT;

  //here we check to make sure we're not trying to push out a binary or text document, just xml or json
  if (outputFormat !== datahub.flow.consts.JSON && outputFormat !== datahub.flow.consts.XML) {
    datahub.debug.log({
      message: 'The output format of type ' + outputFormat + ' is invalid. Valid options are ' + datahub.flow.consts.XML + ' or ' + datahub.flow.consts.JSON + '.',
      type: 'error'
    });
    throw Error('The output format of type ' + outputFormat + ' is invalid. Valid options are ' + datahub.flow.consts.XML + ' or ' + datahub.flow.consts.JSON + '.');
  }

  /*
  This scaffolding assumes we obtained the document from the database. If you are inserting information, you will
  have to map data from the content.value appropriately and create an instance (object), headers (object), and triples
  (array) instead of using the flowUtils functions to grab them from a document that was pulled from MarkLogic.
  Also you do not have to check if the document exists as in the code below.

  Example code for using data that was sent to MarkLogic server for the document
  let instance = content.value;
  let triples = [];
  let headers = {};
   */

  //Here we check to make sure it's still there before operating on it
  if (!fn.docAvailable(id)) {
    datahub.debug.log({message: 'The document with the uri: ' + id + ' could not be found.', type: 'error'});
    throw Error('The document with the uri: ' + id + ' could not be found.')
  }

  //grab the 'doc' from the content value space
  let doc = content.value;

  // let's just grab the root of the document if its a Document and not a type of Node (ObjectNode or XMLNode)
  //if (doc && (doc instanceof Document || doc instanceof XMLDocument)) {
  //  doc = fn.head(doc.root);
  //}

  /*
  //get our instance, default shape of envelope is envelope/instance, else it'll return an empty object/array
  let instance = datahub.flow.flowUtils.getInstance(doc) || {};

  // get triples, return null if empty or cannot be found
  let triples = datahub.flow.flowUtils.getTriples(doc) || [];

  //gets headers, return null if cannot be found
  let headers = datahub.flow.flowUtils.getHeaders(doc) || {};

  //If you want to set attachments, uncomment here
  // instance['$attachments'] = doc;
  */



  //insert code to manipulate the instance, triples, headers, uri, context metadata, etc.


  let results = gHelper.executeGraphStep(doc,id,getGraphDefinition(),{collections: xdmp.documentGetCollections(id)})
  return results;
}

module.exports = {
  main: main
};

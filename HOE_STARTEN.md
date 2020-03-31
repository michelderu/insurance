Opstarten van pipes door de config te nemen van `application.properties`: 

java -jar marklogic-pipes-*.jar --deployBackend=true --mlUsername=<user> --mlPassword=<password>

Opstarten van pipes door de config te nemen uit een afwijkende properties file, in dit voorbeeld `application-docker.properties`:

java -jar marklogic-pipes-*.jar --deployBackend=true --spring.config.location=application-docker.properties --mlUsername=<user> --mlPassword=<password>


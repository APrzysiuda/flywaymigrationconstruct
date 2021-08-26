package be.necko.tech.flywayjar;

import com.amazonaws.services.s3.model.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.flywaydb.core.Flyway;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.secretsmanager.AWSSecretsManagerClientBuilder;
import com.amazonaws.services.secretsmanager.*;
import com.amazonaws.services.secretsmanager.model.*;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;


import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import be.necko.tech.flywayjar.S3Client;

public class Main {
    private static final Logger logger = LoggerFactory.getLogger(Main.class);
    public String handleRequest(Map<String, Object> input, Context context) throws IOException {
        //parameter
        String bucketName = System.getenv("BUCKETNAME");
        String arn = System.getenv("ARN");

        //SecretsManager
        AWSSecretsManagerClientBuilder secretsManager = AWSSecretsManagerClientBuilder.standard();
        AWSSecretsManager clientManager = secretsManager.build();
        GetSecretValueRequest getSecretValueRequest = new GetSecretValueRequest().withSecretId(arn);
        GetSecretValueResult getSecretValueResult = null;
        try {
            getSecretValueResult = clientManager.getSecretValue(getSecretValueRequest);
        } catch (ResourceNotFoundException e) {
            logger.error("The requested secret " + arn + " was not found");
        } catch (InvalidRequestException e) {
            logger.error("The request was invalid due to: " + e.getMessage());
        } catch (InvalidParameterException e) {
            logger.error("The request had invalid params: " + e.getMessage());
        }


        String secret = getSecretValueResult.getSecretString();

        JsonObject jsonSecret = new Gson().fromJson(secret, JsonObject.class);
        String password = jsonSecret.get("password").getAsString();
        String username = jsonSecret.get("username").getAsString();
        String host = jsonSecret.get("host").getAsString();
        String port = jsonSecret.get("port").getAsString();
        String dbname = jsonSecret.get("dbname").getAsString();
        String engine = jsonSecret.get("engine").getAsString();
        String url = "jdbc:" + engine + "://" + host + ":" + port + "/" + dbname;


        logger.debug(url);
        //path for files (always tmp for flyway)
        Path outputPath = Paths.get("/tmp");
        logger.info("initialisation du client s3");
        //S3Client
        S3Client client = new S3Client();
        logger.info("Client creer");
        List<String> objectList = client.getBucketObjectNames(bucketName);
        logger.info("entrer dans la boucle");
        //save object in tmp
        for (String objectName : objectList) {
            GetObjectRequest getObjectRequest = new GetObjectRequest(bucketName, objectName);
            String paths = "/tmp/" + objectName;
            client.getObject(getObjectRequest, new File(paths));
        }
        logger.info("initialisation de la migration");
        //configure flyway with
        Flyway flyway = Flyway.configure().dataSource(url, username, password).locations("filesystem:/tmp/").load();
        // Start the migration
        flyway.migrate();

        return "Migrate successfull";
    }
}

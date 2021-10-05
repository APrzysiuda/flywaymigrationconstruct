package tech.necko.flywayjar;

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

import tech.necko.flywayjar.S3Client;
import tech.necko.flywayjar.ClientException;

public class Main {
    private static final Logger LOGGER = LoggerFactory.getLogger(Main.class);
    public String handleRequest(Map<String, Object> input, Context context) throws ClientException {
        //parameter
        System.out.println("entrez dans mon handler");
        String bucketName = System.getenv("BUCKET_NAME");
        String mehdi = "ca marche poas osecour";
        String arn = System.getenv("ARN");
        //add string prefix = System.getenv("PREFIX");

        //SecretsManager
        System.out.println(arn);
        AWSSecretsManagerClientBuilder secretsManager = AWSSecretsManagerClientBuilder.standard();
        AWSSecretsManager clientManager = secretsManager.build();
        GetSecretValueRequest getSecretValueRequest = new GetSecretValueRequest().withSecretId(arn);
        GetSecretValueResult getSecretValueResult = null;
        try {
            System.out.println("entrez dans mon try catch");
            getSecretValueResult = clientManager.getSecretValue(getSecretValueRequest);
            System.out.println(getSecretValueResult);
        } catch (ResourceNotFoundException e) {
            throw new ClientException("The requested secret " + arn + " was not found");
        } catch (InvalidRequestException e) {
            throw new ClientException("The request was invalid due to: " + e.getMessage());
        } catch (InvalidParameterException e) {
            throw new ClientException("The request had invalid params: " + e.getMessage());
        }
        System.out.println("Sortie de mon try catch");


        String secret = getSecretValueResult.getSecretString();

        JsonObject jsonSecret = new Gson().fromJson(secret, JsonObject.class);
        String password = jsonSecret.get("password").getAsString();
        System.out.println(password);
        String username = jsonSecret.get("username").getAsString();
        String host = jsonSecret.get("host").getAsString();
        String port = jsonSecret.get("port").getAsString();
        String dbname = jsonSecret.get("dbname").getAsString();
        String engine = jsonSecret.get("engine").getAsString();

        // for SAP jdbc url
        String url = "jdbc:" + engine + "://" + host + ":" + port + "/";
        if (engine=="sap") {
            url= url +"?databaseName="+ dbname;
        }
        else {
            url = url+ dbname;
        };


        LOGGER.debug(url);
        //path for files (always tmp for flyway)
        Path outputPath = Paths.get("/tmp");
        System.out.println("S3 client initialization");
        //S3Client
        S3Client client = new S3Client();
        //LOGGER.info("Client created");
        List<String> objectList = client.getBucketObjectNames(bucketName); //add prefix
        //LOGGER.info("Loop start");
        //save object in tmp
        for (String objectName : objectList) {
            GetObjectRequest getObjectRequest = new GetObjectRequest(bucketName, objectName);
            String path = "/tmp/" + objectName;
            client.s3Client.getObject(getObjectRequest, new File(path));
        }
        //LOGGER.info("migration initialization");
        //configure flyway with
        Flyway flyway = Flyway.configure().dataSource(url, username, password).locations("filesystem:/tmp/").load();
        // Start the migration
        flyway.migrate();

        return "Migrate successfull";
    }
}

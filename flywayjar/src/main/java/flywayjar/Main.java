package flywayjar;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.AmazonClientException;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.flywaydb.core.Flyway;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.secretsmanager.AWSSecretsManagerClientBuilder;
import com.amazonaws.services.secretsmanager.*;
import com.amazonaws.services.secretsmanager.model.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

class s3client extends AmazonS3Client{
    //S3client
    public s3client(){
        AmazonS3ClientBuilder.standard().build();
    }

    //listing object in bucket
    public List<S3ObjectSummary> getBucketObjectSummaries(String bucketName){
        List<S3ObjectSummary> s3ObjectSummaries=new ArrayList<S3ObjectSummary>();
        try {
            ListObjectsRequest listObjectsRequest = new ListObjectsRequest().withBucketName(bucketName);
            ObjectListing objectListing;

            do {
                objectListing = this.listObjects(listObjectsRequest);
                for (S3ObjectSummary objectSummary : objectListing.getObjectSummaries()) {
                    s3ObjectSummaries.add(objectSummary);
                }
                listObjectsRequest.setMarker(objectListing.getNextMarker());
            } while (objectListing.isTruncated());

        } catch (AmazonServiceException ase) {
            System.out.println("Caught an AmazonServiceException, " +
                    "which means your request made it " +
                    "to Amazon BdS3Client, but was rejected with an error response " +
                    "for some reason.");
            System.out.println("Error Message:    " + ase.getMessage());
            System.out.println("HTTP Status Code: " + ase.getStatusCode());
            System.out.println("AWS Error Code:   " + ase.getErrorCode());
            System.out.println("Error Type:       " + ase.getErrorType());
            System.out.println("Request ID:       " + ase.getRequestId());

        } catch (AmazonClientException ace) {
            System.out.println("Caught an AmazonClientException, " +
                    "which means the client encountered " +
                    "an internal error while trying to communicate" +
                    " with BdS3Client, " +
                    "such as not being able to access the network.");
            System.out.println("Error Message: " + ace.getMessage());
        }
        return s3ObjectSummaries;
    }


    public List<String> getBucketObjectNames(String bucketName){
        List<String> s3ObjectNames = new ArrayList<String>();
        System.out.println("in bucket");
        List<S3ObjectSummary> s3ObjectSummaries = getBucketObjectSummaries(bucketName);

        for(S3ObjectSummary s3ObjectSummary : s3ObjectSummaries){
            s3ObjectNames.add(s3ObjectSummary.getKey());
        }
        return s3ObjectNames;
    }

}

public class Main {
    public String handleRequest (Map<String, Object> input, Context context) throws IOException {
        //parameter
        String bucketName= System.getenv("BUCKETNAME");

        //login ID (name, password and url) (depend of the db and the type of db)

        //String username=System.getenv("user");
        String arn=System.getenv("ARN");
        //String password=System.getenv("password");
        AWSSecretsManagerClientBuilder secretsManager= AWSSecretsManagerClientBuilder.standard();
        AWSSecretsManager clientManager = secretsManager.build();
        GetSecretValueRequest getSecretValueRequest = new GetSecretValueRequest().withSecretId(arn);
        GetSecretValueResult getSecretValueResult=null;
        try{
            getSecretValueResult = clientManager.getSecretValue(getSecretValueRequest);
        }catch(ResourceNotFoundException e) {
            System.out.println("The requested secret " + arn + " was not found");
        } catch (InvalidRequestException e) {
            System.out.println("The request was invalid due to: " + e.getMessage());
        } catch (InvalidParameterException e) {
            System.out.println("The request had invalid params: " + e.getMessage());
        }


        String secret= getSecretValueResult.getSecretString();

        JsonObject jsonsecret = new Gson().fromJson(secret,JsonObject.class);

        String password=jsonsecret.get("password").toString().replace('"',' ').strip();
        String username=jsonsecret.get('username').toString().replace('"',' ').strip();
        String host=jsonsecret.get("host").toString().replace('"',' ').strip();
        String port=jsonsecret.get("port").toString().replace('"',' ').strip();
        String dbname=jsonsecret.get("dbname").toString().replace('"',' ').strip();
        String engine=jsonsecret.get("engine").toString().replace('"',' ').strip();
        String url="jdbc:"+engine+"://"+host+":"+port+"/"+dbname;

        /*String engine= secretsManager.secretValueFromJson("engine").toString();
        String password= secretsManager.secretValueFromJson("password").toString();
        String user= secretsManager.secretValueFromJson("username").toString();
        String host= secretsManager.secretValueFromJson("host").toString();
        String port= secretsManager.secretValueFromJson("port").toString();
        String dbname= secretsManager.secretValueFromJson("dbname").toString();
        String url= "jdbc:"+engine+"://"+host+":"+port+"/"+dbname;*/

        System.out.println(url);
        //path for files (always tmp for flyway)
        Path outputPath= Paths.get("/tmp");
        System.out.println("initialisation du client s3");
        //s3client
        s3client client =new s3client();
        System.out.println("Client créer");
        List<String> objectList = client.getBucketObjectNames(bucketName);
        System.out.println("entrer dans la boucle");
        //save object in tmp
        for(String objectName: objectList){
            GetObjectRequest getObjectRequest=new GetObjectRequest(bucketName,objectName);
            String paths="/tmp/"+objectName;
            client.getObject(getObjectRequest,new File(paths));
        }
        System.out.println("initialisation de la migration");
        //configure flyway with
        Flyway flyway = Flyway.configure().dataSource(url, username, password).locations("filesystem:/tmp/").load();
        // Start the migration
        flyway.migrate();

        return "Migrate successfull";
    }
}

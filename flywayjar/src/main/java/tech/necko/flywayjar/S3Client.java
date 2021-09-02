package tech.necko.flywayjar;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

import java.util.ArrayList;
import java.util.List;

import tech.necko.flywayjar.ClientException;

public class S3Client{

    private static final Logger LOGGER = LoggerFactory.getLogger(S3Client.class);

    //S3client
    public AmazonS3 s3Client=AmazonS3ClientBuilder.standard().build();

    //listing object in bucket
    public List<S3ObjectSummary> getBucketObjectSummaries(String bucketName) throws ClientException {
        LOGGER.info("in getBucketObjectSummaries");
        List<S3ObjectSummary> s3ObjectSummaries = new ArrayList<S3ObjectSummary>();
        try {
            ListObjectsV2Request listObjectsRequest = new ListObjectsV2Request().withBucketName(bucketName);//add with prefix
            ListObjectsV2Result objectListing;

            do {
                objectListing = s3Client.listObjectsV2(listObjectsRequest);
                for (S3ObjectSummary objectSummary : objectListing.getObjectSummaries()) {
                    s3ObjectSummaries.add(objectSummary);
                }
                listObjectsRequest.setContinuationToken(objectListing.getNextContinuationToken());
            } while (objectListing.isTruncated());

        } catch (AmazonServiceException ase) {
            throw new ClientException("Caught an AmazonServiceException, " +
                    "which means your request made it " +
                    "to Amazon BdS3Client, but was rejected with an error response " +
                    "for some reason." +
                    " Error Message:    " + ase.getMessage() +
                    "HTTP Status Code: " + ase.getStatusCode() +
                    "Error Type:       " + ase.getErrorType() +
                    "Request ID:       " + ase.getRequestId());

        } catch (AmazonClientException ace) {
            throw new ClientException("Caught an AmazonClientException, " +
                    "which means the client encountered " +
                    "an internal error while trying to communicate" +
                    " with BdS3Client, " +
                    "such as not being able to access the network." +
                    "Error Message: " + ace.getMessage());
        }
        return s3ObjectSummaries;
    }


    public List<String> getBucketObjectNames(String bucketName) throws ClientException {
        List<String> s3ObjectNames = new ArrayList<String>();
        LOGGER.info("in getBucketObjectNames");
        List<S3ObjectSummary> s3ObjectSummaries = getBucketObjectSummaries(bucketName);//add prefix

        for (S3ObjectSummary s3ObjectSummary : s3ObjectSummaries) {
            s3ObjectNames.add(s3ObjectSummary.getKey());
        }
        return s3ObjectNames;
    }

}

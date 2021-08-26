package be.necko.tech.flywayjar;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

import java.util.ArrayList;
import java.util.List;


class S3Client extends AmazonS3Client {
    //S3client
    public S3Client() {
        AmazonS3ClientBuilder.standard().build();
    }
    private static final Logger logger = LoggerFactory.getLogger(Main.class);
    //listing object in bucket
    public List<S3ObjectSummary> getBucketObjectSummaries(String bucketName) {
        logger.info("in getBucketObjectSummaries");
        List<S3ObjectSummary> s3ObjectSummaries = new ArrayList<S3ObjectSummary>();
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
            logger.error("Caught an AmazonServiceException, " +
                    "which means your request made it " +
                    "to Amazon BdS3Client, but was rejected with an error response " +
                    "for some reason.");
            logger.error("Error Message:    " + ase.getMessage());
            logger.error("HTTP Status Code: " + ase.getStatusCode());
            logger.error("AWS Error Code:   " + ase.getErrorCode());
            logger.error("Error Type:       " + ase.getErrorType());
            logger.error("Request ID:       " + ase.getRequestId());

        } catch (AmazonClientException ace) {
            logger.error("Caught an AmazonClientException, " +
                    "which means the client encountered " +
                    "an internal error while trying to communicate" +
                    " with BdS3Client, " +
                    "such as not being able to access the network.");
            logger.error("Error Message: " + ace.getMessage());
        }
        return s3ObjectSummaries;
    }


    public List<String> getBucketObjectNames(String bucketName) {
        List<String> s3ObjectNames = new ArrayList<String>();
        logger.info("in getBucketObjectNames");
        List<S3ObjectSummary> s3ObjectSummaries = getBucketObjectSummaries(bucketName);

        for (S3ObjectSummary s3ObjectSummary : s3ObjectSummaries) {
            s3ObjectNames.add(s3ObjectSummary.getKey());
        }
        return s3ObjectNames;
    }

}

# AWS Lambda function with Flyway
## Flyway --> Migrate/Evolve your database schema
Flyway is an opensource tool to easily evolve your db : https://flywaydb.org/

## Flyway Migration Construct 
This AWS CDK construct allows you to scale your db schema with a lambda function. 

The lambda function code is upload on S3 bucket "flywaymigrationconstruct". The construct retrieves the code on it according
to the version of the construct. 

You must pass arguments, most of which are optional and are parameters of your lambda function except two of them,
which are environment variables. 

warning: vpc, subnet and securitygroups are optional, but if one of them is provided, others must be too. 

## Migration DB SecretManager 
Migration DB SecretManager is the Secret of the DB you want to manage with Flyway. 
It has to have 6 arguments : 

username : the username of your DB

password : the password of your DB

engine : the type of your db (Redshift, Aurora MySQL, ...)

host: the host of your DB 

port: the port of your DB 

dbname: the name of your DB


## Bucket Migration SQL
Bucket Migration SQL is the S3 Bucket where you will put your SQL files 
(warning : you have to comply with the naming pattern of Flyway). 

## Enable in Python and TS (maybe more soon):
PyPI: https://pypi.org/project/flywaymigrationconstruct/

npmjs: https://www.npmjs.com/package/flywaymigrationconstruct

## NB : 
Flyway Migration Construct manages the lambda function permissions for the secret and the bucket. 

Warning : Version 0.3.0 only allows DB on Amazon Redshift, MySQL, PostgreSQL and SAP HANA.




# AWS Lambda function with Flyway
## Flyway --> Migrate/Evolve your database schema
Flyway is an opensource tool to evolve easily your db : https://flywaydb.org/

##Flyway Migration Construct 
This AWS CDK construct allows you to evolve your db schema with a lambda function. 

The lambda function code is upload on "flywaymigrationconstruct" S3 bucket. The construct get the code on it according
to the construct version. 

You must pass arguments, most of them are optional and are params of our lambda function except two of them,
which are environment variables. 

## Migration DB SecretManager 
Migration DB SecretManager is the Secret of the DB that you want to manage with Flyway. 
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
Flyway Migration Construct manages authorizations of the lambda function for the secret and the bucket. 

Warning : Version 0.2.0 only allows Redshift DB

##Credits: 

Arnaud Przysiuda, internship at Necko Technologies. 



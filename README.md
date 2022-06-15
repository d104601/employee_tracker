# Employee Tracker

## Description
Command Line Interface Application to manage a company's employee database, using Node.js, Inquirer, and MySQL.


## Installation 
Download all files in the repository. This application requires "Node.js", "Mysql" and package list in "pacakge.json". To install required package, please enter following in same directory:
```
npm install
```


## Usage
Before running the application, populate the database by following command
```
mysql -u root -p
```
followed by own password. And then, type following command to create database
```
source db/schema.sql
```
If you want to use sample database for the test, please type following command also.
```
source db/seeds.sql
```
Type following in command line in the same directory to run the application:
```
node index.js
```

## App Demonstration
![sample](https://github.com/d104601/employee_tracker/blob/main/demo.gif)

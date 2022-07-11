# ensemble
This project is comprised of two parts; the frontend and the backend  
The frontend is done in react while the backend is done in springboot  

# Getting the project
  1 Open terminal/cmd  
  2 Change directory to a folder where you want the project to be stored  
  3 Clone the project using the command "git clone https://github.com/869324/ensemble.git"  
  4 After the command runs you will have the project in the folder named "ensemble"  

# Running frontend
  1 Open terminal/cmd and navigate to ensemble/frontend  
  2 run command "npm install"  
  3 run command "npm install -g sass"  
  4 run command "npm run start"  
  
  
# Running the database 
  visit this link for a more complete guide -->  https://phoenixnap.com/kb/install-sql-express  
  The guide will help you install the Microsoft SQL Server(MS SQL), SQL Server Management Studio (SSMS) and configure them  
  The SSMS is used to interact with the Database Server via GUI   
  I recommend using DBeaver instead of SSMS: DBeaver is a database browser that works with common databases like MySql, MsSQl, Postgres etc  
  
  # Import the project database to your server
   1 Open your SSMS/DBeaver and connect to the server  
   2 Create a new database and name it "ensemble"  
   3 Incase of DBeaver terminate the current connection and create a new one; this time putting in the created DB as the target database  
   4 Incase of SSMS; refresh the panel on the left and select the new database from the dropdown as the current database  
   5 From SSMS/DBeaver open the sql script located in backend/database/tables; the file is named "ensemble.sql"  
   6 Run the script; This will create the tables  
   7 From the same folder run the script "admin.sql" to create the initial admin account
   7 To see the database schema/design right click on the schema (dbo) and select ER Diagram  
   8 Open and run all sql scripts located in backend/database/stored procedures  
  
  
# Installing Java (JDK)
  1 Download and install java 18.0.1 from oracle  
   
# Running backend
  1 download and install Intellij Idea community edition; its free  
  2 Open Intellij and from it open backend/API  
  3 Make sure you are connected to internet as Intellij downloads the neccesary dependecies  
  4 Open src/main/resources/application.properties. This file contains configurations to connect to the database  
    change the username and password to the ones you entered when setting up the Database Server  
    If you changed the port from default (1433) then change the port number as well in the file; 1st line next to localhost  
  5 Open the main class src/main/java/com/ensemble/app/ApiApplication.java right click on it and select run  
   
 
 

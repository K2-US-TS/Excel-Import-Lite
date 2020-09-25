# Excel-Import-Lite
Lite version of an Excel import using combination of javascript and SQL Server stored procedures to import data from a selected Excel spreadsheet into a SQL Server table.

## Excel Import Client View

1. Add the **Excel Import Client** view to an form.

2. Add a rule on the form **When the server loads the Form** and call the Server rule for the view as show below: 

![Server Load Rule](/Images/ServerLoadRule.png)

## What the View Does

All of the "work" is done in the **[Internal] - Upload File** rule. The follow occurs:

1. After an Excel file is selected via the File Attachment control the base64 contents of the file along with the file name are loaded into a table in the POC database called **ExcelImportFile**.

2. A stored procedure strips off the tags surrounding the actual base64 file content updates the **Content** field in the **ExcelFileImport** table.

3. The base64 content is loaded into a hidden textbox control on the view.

4. A short script is executed which calls a function in the JavaScript embedded in the view. The function reads the base64 contents from the textbox control and outputs the results as JSON to another hidden textbox control.

5. The JSON is then saved to the **ExcelFileImport** table in the **JSON** field.

5. The resulting JSON can then be used to insert or update records in a SmartObject using a [stored procedure](#sql-server-stored-procedure) as described below.

## SQL Server Stored Procedure

The 


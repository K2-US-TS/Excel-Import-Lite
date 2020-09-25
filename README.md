# Excel-Import-Lite
Lite version of an Excel import using combination of JavaScript and SQL Server stored procedures to import data from a selected Excel spreadsheet into a SQL Server table. The component uses an open source community edition of the SheetJS Excel JavaScript library ([https://docs.sheetjs.com/](https://docs.sheetjs.com/)  


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


## Using the View

1. Add the view to a form.

2. Add actions to the **[Override] - File Import is Changed** rule to update or insert records in a SQL Server table. Here are the example actions in the rule from the **Excel File Import Demo Items** form which calls a SmartObject method that reads the JSON from the **ExcelFileImport** table and passes it to a SQL Server stored procedure as described in the [SQL Server Stored Procedure](#sql-server-stored-procedure) section below.

![Override Actions 1](/Images/OverrideFileImportChanged1.png)
![Override Actions 2](/Images/OverrideFileImportChanged2.png)

3. The chaining of the serviceobject methods in the **Insert from JSON** method of the **Excel File Import Demo Items** SmartObject is shown below. Look at the design of the SmartObject for more details.

![Insert into JSON SmO](/Images/InsertIntoJSON.png)


## SQL Server Stored Procedure

The JSON data saved in the **ExcelFileImport** table can be read and passed into a SQL Server Stored Procedure to update or insert records in a table. Below is the stored procedure used in **Excel File Import Demo Items** SmartObject's **Insert from JSON** method in the **Excel Import Test** form.

```
/****** Object:  StoredProcedure [dbo].[usp_Import_ExcelImportLite_DemoItems]    Script Date: 9/25/2020 6:48:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER proc [dbo].[usp_Import_ExcelImportLite_DemoItems]
	 @pJSON nvarchar(max)

as

/*******************************************************************************************

This stored procedure takes JSON formatted data and inserts records into a table using
SQL Server's OPENJSON table-valued function and returns the entire table.

NOTE: Special handling of Excel DATE or DATE/TIME fields:

Date/Time fields need to be converted from Excel's numerical value to a SQL Server Date or 
DateTime using the following function:

DATEADD(mi, CONVERT(numeric(17,5), <DateTimeField>) * 1440, '1899-12-30') as <DateTimeField>

Where: <DateTimeField> is the SQL Server table column name

Also, the column definition in the "WITH" clause of the JSON definition must be NVARCHAR(50).

*******************************************************************************************/

DECLARE @sheetJSON NVARCHAR(MAX) 
DECLARE @sheetName NVARCHAR(255)

-- Get first sheet name (key) from JSON

select @sheetName = [key]
from (
select *
	from OPENJSON (@pJSON)
) s1
order by (select null)

select @sheetJSON = [value]
from (
select *
	from OPENJSON (@pJSON)
) s1
where [key] = @sheetName


INSERT INTO [dbo].[ExcelImportLite_DemoItems] (
       [ItemNumber]
      ,[ItemStatus]
      ,[ItemShortDescription]
      ,[Size]
      ,[LabelBrand]
      ,[ItemType]
      ,[AlcoholByVolume]
      ,[UnitsPerCase]
      ,[UnitVolume]
      ,[ItemImageURL]
      ,[CreatedDate]
)

select 
       [ItemNumber]
      ,[ItemStatus]
      ,[ItemShortDescription]
      ,[Size]
      ,[LabelBrand]
      ,[ItemType]
      ,[AlcoholByVolume]
      ,[UnitsPerCase]
      ,[UnitVolume]
      ,[ItemImageURL]
	  ,dateadd(mi, CONVERT(numeric(17,5), CreatedDate) * 1440,'1899-12-30') as CreatedDate

from (
	select *
	from OPENJSON (@sheetJSON)
	-- NOTE: Field names in the WITH clause must match column headings in Excel sheet
	with (
       [ItemNumber] nvarchar(50)
      ,[ItemStatus] nvarchar(50)
      ,[ItemShortDescription] nvarchar(50)
      ,[Size] nvarchar(50)
      ,[LabelBrand] nvarchar(50)
      ,[ItemType] nvarchar(50)
      ,[AlcoholByVolume] nvarchar(50)
      ,[UnitsPerCase] nvarchar(50)
      ,[UnitVolume] decimal(13,3)
      ,[ItemImageURL] nvarchar(2048)
      ,[CreatedDate] nvarchar(50)
	)
) S1

-- Return all data from the table, including newly added records
SELECT
       [ID]
      ,[ItemNumber]
      ,[ItemStatus]
      ,[ItemShortDescription]
      ,[Size]
      ,[LabelBrand]
      ,[ItemType]
      ,[AlcoholByVolume]
      ,[UnitsPerCase]
      ,[UnitVolume]
      ,[ItemImageURL]
      ,[CreatedDate]
FROM [dbo].[ExcelImportLite_DemoItems]
```





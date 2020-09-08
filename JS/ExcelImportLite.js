<script lang="javascript">
         
function to_json(workbook) {	
	
	var result = {};
	
	workbook.SheetNames.forEach(function(sheetName) {
	
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);	
	
		if(roa.length) result[sheetName] = roa;	
		}
	);	
	
	return JSON.stringify(result, 2, 2);
}

function process_wb(wb) {	
	
	var output = "";	
	
	output = to_json(wb); 
	
	SetControlValue('txtImportJSON', output);
}

function get64BitContent() { 

	var data = $("[name='txtImportFileContents']").SFCTextBox('option', 'text');	
	
	var wb = XLSX.read(data, {type:'base64', WTF:false});	

	process_wb(wb);
}

</script>

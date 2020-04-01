({
    parseRawData : function(data) {
        var rows = data.split('\n');
        for (i = 0; i < rows.length; i++) {		   	   
            rows[i] = rows[i].split('\t');		
        }
        //Assuming First Row Is Always Header
        var headers = rows[0];
        
        var headersMetadata = [];     
        
        var mergedColumnsCounter = 1;
        for(var i = headers.length -1; i >= 0; i--){
            var value =  headers[i];
            if(value == ""){
                mergedColumnsCounter++;
            }else{     
                headersMetadata.push({Value: value, Columns: mergedColumnsCounter});
                mergedColumnsCounter = 1;
            }   
        }
        
        headersMetadata = headersMetadata.reverse();
        
        //Skip Header Row and Get the Data
        var table = [];
        var headerRow = [];
        headersMetadata.forEach(function(header){		
            headerRow.push(header.Value);
        });
        
        table.push(headerRow);
        
        for(var i= 1; i< rows.length; i++){
            var row = [];
            var columns = rows[i];      
            var index = 0;
            headersMetadata.forEach(function(header){
                var limit = (index == columns.length - 1) ? index + 1 : index + header.Columns;
                var value = "";
                for(var j= index; j< limit; j++){
                    if(columns[j] != ""){
                        value = columns[j];
                    }
                }
                row.push(value);
                index = index + header.Columns;
            });      
            table.push(row);
        }
        console.log(rows);
        
        console.log(headersMetadata);
        
        console.log(table);
        
        return table;		
    }
})
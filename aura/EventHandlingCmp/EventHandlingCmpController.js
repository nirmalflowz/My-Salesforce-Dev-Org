({
    fireClickEvent : function(component, event, helper) {
        var cmpEvent = $A.get("e.c:ceEvent");//component.getEvent('cmpEvent');
        cmpEvent.setParams({
            message:'Hi hello Component.'
        });
        
        cmpEvent.fire();
        //_customMethods.accessArrayElements();
        //_customMethods.getTableElements();
    },
    getText : function(){
      var text = document.getElementsByClassName('test1');
        alert(text[0].value);
    },
    scriptsLoaded : function(cmp, evt, h){
        
        h.redipsInit();
        
        /*debugger;
        var mygrid = cmp.find('myGrid').getElement();
        var columnDefs = [
                {headerName: "Make", field: "make", checkboxSelection: true},
                {headerName: "Model", field: "model"},
                {headerName: "Price", field: "price"}
            ];
            
            // specify the data
            var rowData = [
                {make: "Toyota", model: "Celica", price: 35000},
                {make: "Ford", model: "Mondeo", price: 32000},
                {make: "Porsche", model: "Boxter", price: 72000}
            ];
            
            // let the grid know which columns and what data to use
            var gridOptions = {
                columnDefs: columnDefs,
                rowData: rowData,
                enableSorting : true,
  				enableFilter: true,
                rowSelection: 'multiple'
            };
            
        	cmp.set('v.gridOptions',gridOptions);
            // lookup the container we want the Grid to use
            var eGridDiv = mygrid;//document.querySelector('#myGrid');
            
            // create the grid passing in the div to use together with the columns & data we want to use
            new agGrid.Grid(eGridDiv, gridOptions); */
    },
    getSelectedRowData : function(cmp, evt, h){
        var selectedNodes = cmp.get('v.gridOptions').api.getSelectedNodes();  
        var selectedData = selectedNodes.map( function(node) { return node.data });
        var selectedDataStringPresentation = selectedData.map( function(node) { return node.make + ' ' + node.model }).join(', ');
        console.log('Selected nodes: ' + selectedDataStringPresentation);
    }
})
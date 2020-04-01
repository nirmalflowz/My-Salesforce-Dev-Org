


window._customMethods = (function() {
    
    return { //public API
        accessArrayElements: function() {
            var selectOptions = $('#optionSelect > option');
            $.each(selectOptions, function(idx, value){
                console.log(value);
            });
        },
        getTableElements : function(){
            var tableTr = $('#got > tr');
            $.each(tableTr, function(idx, tr){
                console.log(tr) ;
                var firstTd = $(tr).find('td:first');
                var checkboxtd = $('<td></td>').append("<input type='checkbox' name='record'>");
                $(firstTd).before(checkboxtd);
            });
        },
        loadAgGrid : function(mygrid,aggridjs){
            // specify the columns
            /*debugger;
            var imported = document.createElement('script');
            imported.src = aggridjs;
            document.head.appendChild(imported);*/
            
            
        }
    };
}());
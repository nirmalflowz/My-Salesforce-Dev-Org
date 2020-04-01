({
    
    doInit : function(component, event, helper) {
        console.log('Component Load');
        component.set('v.progressBarWidth','0%');
        component.set('v.currentStep','0');
        component.set('v.hideBackBtn','true');
        helper.getData(component);
    },
    handleCmpEvent:function(cmp, evt, helper){
        //alert(evt.getParams('message'));
        cmp.set('v.msgFromCmp',evt.getParam('message'));
    },
    scriptsLoaded:function(component,event,helper){
        if ( ! $.fn.DataTable.isDataTable( $('#example') ) ) {
       var table = $('#example').DataTable( {
           "aaData": component.get('v.listData'),
           "aoColumns": [{ "mData": "Id",
                         render: function( data, type, full, meta ) {
                    return '';
                }},
               { "mData": "Name",
                render: function( data, type, full, meta ) {
                    return data ? data : '';
                }
               },
               { "mData": "Phone",
                render: function( data, type, full, meta ) {
                    return data ? data : '';
                } },
               { "mData": "Email",
                render: function( data, type, full, meta ) {
                    return data ? data : '';
                } }
           ],
                columnDefs: [ {
                    orderable: false,
                    className: 'select-checkbox',
                    targets:   0
                } ],
                select: {
                    style:    'os',
                    selector: 'td:first-child',
                    items : 'row'
                },
                order: [[ 1, 'asc' ]]
            } );
            window.tableData = table;
        }else{
            window.tableData.fnDraw();
        }
        //table.rows().select();
        
    },
	getRecords : function(component, event, helper) {
		
        var data = window.tableData.rows().data();
        var selectedRows = window.tableData.rows({selected:true}).data();
        console.log(data);
        console.log(selectedRows);
        var step = component.find("step")[component.get('v.currentStep')];
        if(component.get('v.currentStep')=="0"){
            component.set('v.currentStep','1');
            $A.util.removeClass(step,"show");
            $A.util.addClass(step,"hide");
            component.set('v.progressBarWidth','50%');
            component.set('v.hideBackBtn','false');
            $A.enqueueAction(component.get('c.setNewStep'));
            component.set('v.selectedRows',selectedRows);
            $A.enqueueAction(component.get('c.initSelectedTable'));
            
        }else if(component.get('v.currentStep')=="1"){
            component.set('v.currentStep','2');
            $A.util.removeClass(step,"show");
            $A.util.addClass(step,"hide");
            component.set('v.progressBarWidth','100%');
            component.set('v.hideBackBtn','false');
            $A.enqueueAction(component.get('c.setNewStep'));
        }
        console.log(" Step : "+step);
        //$A.util.toggleClass(toggleText, "toggle");
        //if()
	},
    setNewStep:function(component,event,helper){
        var step = component.find("step")[component.get('v.currentStep')];
        $A.util.removeClass(step,"hide");
        $A.util.addClass(step,"show");
    },
    initSelectedTable:function(component,event,helper){
        if ( ! $.fn.DataTable.isDataTable( $('#selectedTable') ) ) {
        var selectedTable = $('#selectedTable').DataTable( {
            "aaData": component.get('v.selectedRows'),
            "aoColumns": [
                { 
                    "mData": "Name",
                    render: function( data, type, full, meta ) {
                        return data ? data : '';
                    }
                },
                { 
                    "mData": "Phone",
                    render: function( data, type, full, meta ) {
                        return data ? data : '';
                    } 
                },
                { 
                    "mData": "Email",
                    render: function( data, type, full, meta ) {
                        return data ? data : '';
                    } 
                }
            ]
            } );
            window.selectedTable = selectedTable;
        }else{
            window.selectedTable.clear().draw();
            window.selectedTable.rows.add(component.get('v.selectedRows')).draw();
        }
            //selectedTable.rows().select();
        	
    },
    prevStep:function(component,event,helper){
        var step = component.find("step")[component.get('v.currentStep')];
        if(component.get('v.currentStep')=="1"){
            component.set('v.currentStep','0');
             $A.util.removeClass(step,"show");
            $A.util.addClass(step,"hide");
            component.set('v.hideBackBtn','true');
            component.set('v.progressBarWidth','0%');
            $A.enqueueAction(component.get('c.setNewStep'));
        }else if(component.get('v.currentStep')=="2"){
            component.set('v.currentStep','1');
            $A.util.removeClass(step,"show");
            $A.util.addClass(step,"hide");
            component.set('v.hideBackBtn','false');
            component.set('v.progressBarWidth','50%');
            $A.enqueueAction(component.get('c.setNewStep'));
        }
    },
    showDetails : function( component , event, helper ){
        
        console.log(JSON.stringify(event.getSource().get("v.value")));
        var jsonStr = event.getSource().get("v.value");
        $A.createComponent('c:customModal', {},
                           function(content, status) {
                               if (status === 'SUCCESS') {
                                   component.find('overlayLib').showCustomModal({
                                       header: 'Flow Window',
                                       body: jsonStr,
                                       showCloseButton: true
                                   })
                               }
                           }
        );
    }
})
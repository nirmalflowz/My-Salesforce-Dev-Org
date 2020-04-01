({
    doInit : function(component, event, helper) {
        helper.component = component
        var record = component.get('v.record');
        var FieldName = component.get('v.fieldName');
        var fieldValue = helper.findByPath(record, FieldName);
        component.set("v.fieldvalue", fieldValue);
    },
    
    navigateToDetail : function(component, event, helper) {        
        var recId = event.currentTarget.dataset.recId;
        console.log('slected record id = ', recId);
        if(recId){
            console.log("navigate To recId =", recId);
            helper.navigateToSobject(recId);
        }        
    },
})
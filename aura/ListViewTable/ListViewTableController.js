({
	doInit : function(component, event, helper) {
        helper.component = component;
        helper.loadInitialData();        
    },
    handelInlineEdit: function(component, event, helper){
        var columnRecord = event.currentTarget.dataset.columnRecord;
        var fieldArr = columnRecord.split('-');
        if(fieldArr.length){
            component.set('v.isEditMode',true);
            component.set('v.columnToEdit',fieldArr[0]);
            component.set('v.recordIdToEdit',fieldArr[1]);
        }
        
    },
    handleMassUpdate: function(component, event, helper) {
        var casesData = component.get('v.CasesData');
        var ListCases = casesData.ListCases;
        // filter cases which are having "isSelected" = true
        console.log('Handle Mass Update');
        console.log(ListCases);
        var casesIds = [];
        ListCases.forEach(sCase => {
            if( sCase.isSelected ){
                casesIds.push(sCase.Id);
            }
        });

        component.set("v.casesIds", casesIds);

        
        component.set("v.ModalBoxCmp" , true);
        console.log('Modal window opened');

        var a = component.get('c.fireCasesMassUpdateEvent');
        $A.enqueueAction(a);
    },
    
    /* handle ListView Change in picklist */
    handleListViewChange : function(component, event, helper) {
        var listViewId = component.get('v.selectedViewId');        
        if(listViewId){
            helper.getListViewData(1);
        }else{
            component.set("v.CasesData.ListCases", [] );
        }
    },
    
    /* navigate To Detail Page of records */
    navigateToDetail : function(component, event, helper) {        
        var recId = event.currentTarget.dataset.recId;
        console.log('slected record id = ', recId);
        if(recId){
            console.log("navigate To Contact Detail recId =", recId);
            helper.navigateToSobject(recId);
        }        
    },
    
    /* Show Details in hover popup */
    showDetails: function(component, event, helper) {
        
        var recId = event.currentTarget.dataset.recId;
        var caserec = component.get('v.CaseRecord');
        if(recId && (!caserec || recId != caserec.Id) ){
            
            console.log("Show Detail for recId =", recId);
            helper.getCaseData(recId);
        }        
    },
    
    /* Show EditForm From hover popup */
    showEditForm : function(component, event, helper) {
        
        var caserec = component.get('v.CaseRecord');
        if(caserec && caserec.Id != undefined ){
            console.log("Show edit for recId =", caserec.Id);
            var editRecordEvent = $A.get("e.force:editRecord");
            editRecordEvent.setParams({
                "recordId": caserec.Id 
            });
            editRecordEvent.fire();
        }
    },
    
    createNewCaseRecord : function (component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Case"
        });
        createRecordEvent.fire();
    },
    
    applySorting : function(component, event, helper){
       var sortColumn = event.currentTarget.dataset.sortColumn;
        var sortColumnLabel = event.currentTarget.dataset.sortColumnLabel;
        console.log('sortColumn Selected',sortColumn);     
        if(sortColumn){
            if(sortColumn == component.get("v.sortColumn").Name){
                var isAscending = component.get("v.isAscending");
                component.set("v.isAscending", !isAscending);
            }else{
                component.set("v.sortColumn", { Name : sortColumn, Label : sortColumnLabel});
                component.set("v.isAscending", true);
            }
            helper.getListViewData(1);
        }
    },
    
    onRecordSizeChange : function(component, event, helper) {
        helper.getListViewData(1);
    },
    
    nextPage : function(component, event, helper) {
        var pagenum = component.get("v.currentPage");
        helper.getListViewData(pagenum+1);
    },
    
    prevPage : function(component, event, helper) {
        var pagenum = component.get("v.currentPage");       
        helper.getListViewData(pagenum-1);
    },
    
    firstpage : function(component, event, helper) {
        helper.getListViewData(1);
    },
    
    lastPage : function(component, event, helper) {
        var pagenum = component.get("v.totalPages");         
        helper.getListViewData(pagenum);
    },   

    
    fireCasesMassUpdateEvent : function(c, e, h) {
        var casesIds = c.get("v.casesIds");
        
        console.log('Firing massUpdateEvent with cases: ');
        console.log(casesIds);
        var massUpdateEvent = $A.get("e.c:CasesMassUpdateEvent");
        massUpdateEvent.setParams({
            "cases" : casesIds
        });
        massUpdateEvent.fire();
        console.log('massUpdateEvent fired correctly');
    },
    closeDlPopup: function (c, e, h) {
        c.set("v.ModalBoxCmp", false);
    },
    
    
})
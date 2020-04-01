({
    component :null,
    
    /* Purpose :  load Initial Data
     * Param : 
     */
    loadInitialData : function() {
        this.component.set("v.Spinner", true);  
        this.callServer("getInitialData", null, false, function(response) {             
            if(!response.isSuccess) {
                this.showErrorToast(response.error);
                this.component.set("v.Spinner", false); 
                return;
            }             
            var resultMap = response.data;
            console.log('getInitialData - Response Contents from server',resultMap);        
            var metaInfo = {
                ListViewsOptions : resultMap.ListViewsOptions,
                setEditableFileds : resultMap.setEditableFileds
            };
            this.component.set('v.MetaInfo', metaInfo);
            this.component.set('v.selectedViewId', metaInfo.ListViewsOptions[0].Id);
                  
            this.component.set("v.sortColumn",{Name:'CaseNumber', Label:'Case Number'});
            
            this.getListViewData(1);
        });
    },
    
    /* Purpose :  get List View Data for selected listViewId
     * Param : pageNumber
     */
    getListViewData : function(pageNumber) {
        this.component.set("v.Spinner", true); 
        
        var listViewId = this.component.get('v.selectedViewId');
     
        var param = {
            listViewId : listViewId,
            pageNumber: ''+ pageNumber,
            recordsSize : ''+ this.component.get("v.recordsPerPage"),
            sortColumnName : this.component.get("v.sortColumn").Name,
            isAscending : this.component.get("v.isAscending")
        };
        console.log('getListViewData param : ',param);
        this.callServer("getListViewData", param, false, function(response) {             
            console.log('Response Contents from server',response);
            if(!response.isSuccess) {
                this.showErrorToast(response.error);
                this.component.set("v.Spinner", false); 
                return;
            } 
            var resultMap = response.data;
            var setEditableFileds = this.component.get('v.MetaInfo').setEditableFileds;
            Array.prototype.forEach.call(resultMap.ListColumns, function(field, idx){
                if(setEditableFileds.indexOf(field['fieldNameOrPath'].toLowerCase()) > -1){
                    field.isUpdatable = true;
                    field.isEditMode = false;
                    field.fieldApiName = field['fieldNameOrPath'];
                }
            });
            console.log('Response Contents from server',resultMap);
            this.component.set("v.CasesData", resultMap);
            this.component.set("v.totalPages", resultMap.totalPages);
            this.component.set("v.currentPage", resultMap.currentPageNum);
            this.component.set("v.totalrecords", resultMap.totalRecords);
            
            this.component.set("v.Spinner", false);
        });
    },
    
    /* Purpose :  getCaseData to show in hover popup
     * Param : Case Id
     */
    getCaseData : function(recId) {       
        this.component.set("v.DetailSpinner", true); 
        var param = {
            caseId : recId
        };
        console.log('getCaseDetails param : ',param);
        this.callServer("getCaseDetails", param, true, function(response) {             
            console.log('Response Contents from server',response);
            if(!response.isSuccess) {
                this.showErrorToast(response.error);
                this.component.set("v.Spinner", false); 
                return;
            } 
            var resultMap = response.data;
            console.log('getCaseDetails - Response Contents from server',resultMap);
            this.component.set("v.CaseRecord", resultMap.CaseRecord);
            this.component.set("v.DetailSpinner", false);
        });
    },
    
    /* Purpose :  navigateToSobject
     * Param : recId
     */
    navigateToSobject : function(recId) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            recordId: recId,
            slideDevName: 'detail'
        });
        navEvt.fire();
    },
    
    /* Purpose : Calling Apex method
     * Param : apexMethod name, params, isCacheable
     * Return : callback
    */
    callServer : function(apexMethod, params, cacheable, callback) {        
        var method = "c." + apexMethod;
        var action = this.component.get(method);
        
        if(params) {
            action.setParams(params);
        }
        
        if(cacheable) {
            action.setStorable();
        }
        action.setCallback(this, function(response) {
            var state = response.getState();  
            
            if(state === "SUCCESS") {
                callback.call(this, response.getReturnValue())
            } else if(state === "ERROR") {
                this.handleActionFailedState( response.getError());
                this.component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },
    
    /* Show Error Toast */
    showErrorToast : function(message) {
        this.showToast("error", message);
    },
    
    /* Show Toast */
    showToast : function(toastType, message) {
        var toastEvent = $A.get("e.force:showToast");
        var toastTitle = toastType == "success" ? "Success!" : "Error!";
        toastEvent.setParams({
            "type" : toastType,
            "title": toastTitle,            
            "message": message,
            "duration": 8000
        });
        toastEvent.fire();
    },
    
    /* Purpose to Show error List on component  */
    handleActionFailedState : function(errors) {
        var errorTxt;
        console.log('errors',errors);
        if(errors) {
            var errorMsgs = [];
            for(var index in errors) {
                errorMsgs.push(errors[index].message);
            }            
            errorTxt = errorMsgs.join('<br/>');
        } else {
            errorTxt = 'Something went wrong!';
        }
        console.log('\n errorTxt:', errorTxt);
        this.showErrorToast(errorTxt);
    },
})
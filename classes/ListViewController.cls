/*
* @ Purpose	: Controller Class for CaseListView Component 
* @ LastModiifedDate : 06-11-2018
*/ 
public class ListViewController {
    
    /* Purpose : getInitialData
     * Param : -
     * Return : ActionResult
    */
    @AuraEnabled
    public static ActionResult getInitialData(){
        try{
            Map<String,object> resultData = new Map<String,object>();
            resultData.put('ListViewsOptions', getListViewsForCase());  
            
            Set<String> setEditableFileds = new Set<String>();
            
            Map<String, Schema.SObjectField> mapSobjectfields = Schema.SObjectType.Case.fields.getMap(); 
            for(String fieldName : mapSobjectfields.keySet()) { 
                if(mapSobjectfields.get(fieldName).getDescribe().isUpdateable()) { 
                    setEditableFileds.add(fieldName);
                } 
            }
            resultData.put('setEditableFileds', setEditableFileds);
            
            return new ActionResult(resultData);
        }catch(Exception exec){
            return new ActionResult(exec);
        }
    }
    
    /* Purpose : getListViewData
     * Param :   listViewId, pageNumber, recordsSize, sortColumnName, isAscending
     * Return :  ActionResult
     */
    @AuraEnabled
    public static ActionResult getListViewData(String listViewId, String pageNumber, String recordsSize,
                                           	   String sortColumnName, Boolean isAscending){
        try{
            Map<String,object> resultData = new Map<String,object>();
            
            System.debug('listViewId :' + listViewId);
            
            // Get List View MetaData from Salesforce API
            HTTPResponse response = getListViewDetails(listviewId);            
            if(response.getStatusCode() != 200){
                return new ActionResult('Error in getting List View information : ' + response.getStatus());
            }            
            Map<String, Object> tokenResponse = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            String query = (String) tokenResponse.get('query');
            
            // Remove Existing Order and apply selected order
            List<String> listQueryparts = query.split('ORDER BY');
            query = listQueryparts[0];
            query += ' Order by '+ sortColumnName + (isAscending ? ' ASC NULLS LAST': ' Desc NULLS FIRST') ;
            
            List<Case> listCases = (List<Case>) database.query(query);
            
            resultData.putAll(getPaginationInfo(listCases, pageNumber, recordsSize));
            resultData.put('ListColumns', tokenResponse.get('columns'));
            resultData.put('query', tokenResponse.get('query'));
            return new ActionResult(resultData);
        }catch(Exception exec){
            System.debug('exec :' + exec);
            return new ActionResult(exec);
        }
    }
    
    public static Map<String,object> getPaginationInfo(List<Case> listCases, String pageNumber, String recordsSize){
        Map<String,object> paginationData = new Map<String,object>();
        Integer noOfRec = listCases.size();
        
        Integer pageNum = Integer.valueOf(pageNumber);
        pageNum -= 1;
        Integer pageRecordSize = Integer.valueOf(recordsSize);
        List<Case> caseRecordSet = new List<Case>();            
        Integer noOfPages = (Math.mod(noOfRec, pageRecordSize) == 0) 
            ? (noOfRec/pageRecordSize) : (noOfRec/pageRecordSize) +1;
        
        if(!listCases.isEmpty()){
            for(Integer idx= pageNum*pageRecordSize; idx < noOfRec;idx++){
                if(caseRecordSet.size() < pageRecordSize){
                    caseRecordSet.add(listCases[idx]);
                }else{
                    break;
                }
            }  
        }
        
        paginationData.put('totalPages', noOfPages);
        paginationData.put('currentPageNum', Integer.valueOf(pageNumber));
        paginationData.put('pageRecordSize', pageRecordSize);
        paginationData.put('totalRecords', noOfRec);
        paginationData.put('ListCases', caseRecordSet);
        return paginationData;
    }    
    
    /* Purpose : getCaseDetails
     * Param : caseId
     * Return : ActionResult
     */
    @AuraEnabled(cacheable=true)
    public static ActionResult getCaseDetails(Id caseId){
        try{
            Map<String,object> resultData = new Map<String,object>();
            
            List<Case> listcase = [SELECT ID, Subject, Status, CaseNumber, Origin,
                                   Priority, AccountId, Account.Name , Description, TestUpdatable__c                             
                                   FROM Case 
                                   WHERE Id =: caseId];
                    
            if(listcase.size() < 1){
                return new ActionResult('Case Not Found');
            }
            List<EmailMessage> messages = [SELECT Id,TextBody FROM EmailMessage where RelatedToId=:caseId Order By CreatedDate DESC];
            if( messages.size() > 0 ){
                //Using description as placeholder for last case comment
                listcase[0].Description = messages[0].TextBody;
            }
            resultData.put('CaseRecord', listcase[0]);            
            return new ActionResult(resultData);
        }catch(Exception exec){
            return new ActionResult(exec);
        }
    }
    
    /* Purpose : getListViewsForCase
     * Param : caseId
     * Return : ActionResult
     */
    public static List<ListView> getListViewsForCase(){
        List<ListView> listviews = new List<ListView>();
        for(ListView lstObj : [SELECT Id, Name FROM ListView WHERE SobjectType = 'Case' order by name ASC]){
        	listviews.add(lstObj);
        }
        return listviews;
    }
    
   
    /* Purpose : getListViewDetails from Salesforce API
     * Param : listViewId
     * Return : HTTPResponse
     */
    public static HTTPResponse getListViewDetails(String listViewId){
        HttpRequest req = new HttpRequest();
        String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();
        String endPoinURL = baseUrl+'/services/data/v32.0/sobjects/Case/listviews/'+listViewId+'/describe';
        req.setEndpoint(endPoinURL);
        req.setMethod('GET');
        System.debug('UserInfo.getSessionId():' + getSessionIdFromVFPage()); 
        req.setHeader('Authorization',  'Bearer ' + getSessionIdFromVFPage());
        Http http = new Http();
        HTTPResponse response = http.send(req);
        System.debug('response.getBody() :' + response.getBody());
        return response;        
    }
    
    /* Purpose : getSessionIdFromVFPage (Because we need to get sessionid in Lightning component)
     * Param : -
     * Return : String
     */
    public static String getSessionIdFromVFPage(){
        
        if(Test.isRunningTest()){
            return 'SessionId';
        }
        String content = Page.GetSessionVFPage.getContent().toString();
        Integer s = content.indexOf('Start_Of_Session_Id') + 'Start_Of_Session_Id'.length(),
            e = content.indexOf('End_Of_Session_Id');
        return content.substring(s, e);
    }
    
    /* Purpose : Lightning ActionResult
     * Param : -
     * Return : -
     */
    public class ActionResult {
        @AuraEnabled
        public Boolean isSuccess;
        
        @AuraEnabled
        public String error;
        
        @AuraEnabled
        public Object data;
        
        public ActionResult(Exception ex) {
            isSuccess = false;
            error = ex.getMessage();
            data = new Map<String, Object> {'exception' => ex.getStackTraceString()};
                }
        
        public ActionResult(String errorMessage) {
            isSuccess = false;
            error = errorMessage;
        }
        
        public ActionResult(Map<String, Object> mapData) {
            isSuccess = true;
            data = mapData;
        }
    }
}
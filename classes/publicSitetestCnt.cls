public class publicSitetestCnt {
    //private final Account acct;
    public Account accountRec{get;set;}
    public string addressD{get; set;}
    public Integer NOE{get; set;}
    public string accountId{get;set;}
    public string contactId{get;set;}
    public Contact contactRec{get;set;}
    public String ownerId{get;set;}
    public publicSitetestCnt(ApexPages.StandardController stdController) {
        //this.acct = (Account)stdController.getRecord();
       ownerId = '0057F000001weWT';
       accountId = ApexPages.currentPage().getParameters().get('accountId');
       contactId = ApexPages.currentPage().getParameters().get('contactId');
       accountRec = [select id,name,Destination_Address__c,NumberofLocations__c from Account where id=:accountId];
       contactRec = [select id,name,OtherPhone,Fax from Contact where id=:contactId];
    }  
    public void updateAccouuntNContact() {
        try{
            system.debug('accountRec ::'+accountRec);
        //accountRec.Destination_Address__c = addressD;
        //accountRec.NumberOfEmployees = NOE;
        accountRec.OwnerId = ownerId;
        update accountRec;
        }catch(Exception e){
            system.debug(e.getLineNumber()+' '+e.getStackTraceString());
        }
        
    }   
}
global with sharing class SampleController {
    @AuraEnabled
    public static List<Contact> getContacts() {
        /*HttpRequest req = new HttpRequest();
        List<UserData> contacts;
        string jsonStr;
        req.setMethod('GET');     
        //you don't need this                               
        //Seting HttpRequest Method
        //req.setHeader('content-type', 'application/json');       
        //Seting HttpRequest header properties
        //req.setHeader('Content-Length', '2000');
        req.setEndpoint('https://soda.demo.socrata.com/resource/4tka-6guv.json');
        Http http = new Http();
        try{
            HTTPResponse res = http.send(req); 
            jsonStr = json.serialize(res);
            //contacts = List<UserData> res;
            //Executing web service call
            System.debug('STATUS:' + res.getStatus());
            System.debug('STATUS_CODE:' + res.getStatusCode());
        }
        catch(System.CalloutException e){
            //Exception handling goes here..
            system.debug(e);
        }
        

        //Add isAccessible() check
		//contacts = (List<UserData>) JSON.deserialize(jsonStr, List<UserData>.class);*/
		List<Contact> consList = [SELECT Id,Name,Phone,Email FROM Contact];
        System.debug('Contacts:' + consList);
        return consList;

    }

    public class UserData{
        public string depth {get;set;}
        public string number_of_stations {get;set;}
        public string earthquake_id {get;set;}
        public string magnitude {get;set;}
        public string source {get;set;}
        public string region {get;set;}
        public string version {get;set;}
    }
}
public class GSheetPageController {
    public List<SelectOption> options{get;set;}
    public String selectedPage{get;set;}
    
    public GSheetPageController(){
        List<Google_Sheet__mdt> lst = new List<Google_Sheet__mdt>();
        lst = [SELECT Id, Type__c, Sheet_URL__c FROM Google_Sheet__mdt];
        options = new List<SelectOption>();
        for(Google_Sheet__mdt item : lst){
            options.add(new SelectOption(item.Sheet_URL__c, item.Type__c));
        }
    }
    
    public static string ToJWT(){
        string token = '';
        string iss = 'SK5837b1533d2a1ab03f6fc11cac5c847f';
        Datetime dt = Datetime.now().addSeconds(3600);
        Long l = dt.getTime(); 
        Long epochDate = dt.getTime()/1000;
        Long exp = epochDate;
        string serviceSid = 'IS6fb0537a60934e53b5542f47643e55e3';
        List<String> segments = new List<String>(3);
        Map<String,String> header = new Map<String,String>();
        header.put('typ','JWT');
        header.put('alg','HS256');
        Payload payload = new Payload();
        payload.iss = iss;
        payload.exp = exp;
        Grants grants = new Grants();
        grants.identity = 'pdalal@officebeacon.com';
        Chat chat = new Chat();
        chat.service_sid = serviceSid;
        grants.chat = chat;
        payload.grants = grants;
        
        string headerbytes = EncodingUtil.base64Encode(Blob.valueOf(String.valueOf(header)));//EncodingUtil.urlDecode(EncodingUtil.urlEncode(String.valueOf(header), 'UTF-8'),'UTF-8');
        string payloadbytes = EncodingUtil.base64Encode(Blob.valueOf(String.valueOf(payload)));//EncodingUtil.urlDecode(EncodingUtil.urlEncode(String.valueOf(payload), 'UTF-8'),'UTF-8');
        segments.add(headerbytes);
        segments.add(payloadbytes);
        string stringToSign = string.join(segments,'.');
        string bytesToSign = EncodingUtil.base64Encode(Blob.valueOf(stringToSign));//EncodingUtil.urlDecode(EncodingUtil.urlEncode(stringToSign, 'UTF-8'),'UTF-8');
        Blob tokenTr = Crypto.generateMac('HmacSHA256', blob.valueOf(stringToSign), blob.valueOf('IFXe4HSxD496VxC9YPPJxcjwZdBQV0Im'));
        string signature = (EncodingUtil.convertToHex(tokenTr)).replace('-','');
        segments.add(signature);
        token = string.join(segments,'.');
        
        return token;
    }
    public Static String generateToken(String apiKey, String apiSecret){
        
        //Result result = new Result();
        //result.isSuccess = true;
        String token;
        try{
            
            string header = '{"typ": "JWT", "alg": "HS256"}';
            string JWTHeader = encodingUtil.base64Encode(blob.valueOf(header));
            
            string Payload = '{"iss":"'+apiKey+'", "exp":'+ ((DateTime.now().getTime() + 900000)/1000) +'}';
            string JWTPayload = encodingUtil.base64Encode(blob.valueOf(Payload));
            
            String signatureInput = JWTHeader + '.' + JWTPayload;
            Blob JWTSignature = Crypto.generateMac('HmacSHA256', Blob.valueOf(signatureInput), Blob.valueOf(''+apiSecret));
            string accessToken = signatureInput + '.' + EncodingUtil.base64Encode(JWTSignature);
            
            token = accessToken;
            
        }catch(Exception e){
            
            //result.isSuccess = false;
            //result.message = 'Wrapper Exception.generateToken '+e.getMessage();
            token = '';
        }
        
        return token;
    }
    public static String URLEncode(string str){
        string output = EncodingUtil.base64Encode(Blob.valueOf(str));
        output = output.split('=')[0];
        //string regex1 = '/\+/g';
        output = output.replace('+','-');
        output = output.replace('/','_');
        return output;
    }
    public class Payload{
        public string iss;
        public long exp;
        public Grants grants; 
    }
    public class Grants{
        public string identity;
        public Chat chat;
    }
    public class Chat{
        public string service_sid;
    }
}
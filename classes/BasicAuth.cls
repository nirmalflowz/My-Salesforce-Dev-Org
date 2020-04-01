public class BasicAuth {
    public BasicAuth(){
        HTTP auth = new HTTP();
        HTTPRequest r = new HTTPRequest();
        string endpointurl='https://dreamwares-test.chargebee.com/api/v2/' +'customers';
        r.setEndpoint(endpointurl);
        Blob headerValue = Blob.valueOf('test_0dOtvzHJ0pPdVcdwSXHKBr4manunmckrs' +':' +'');
        String authorizationHeader = 'Basic ' + EncodingUtil.base64Encode(headerValue);
        //String authorizationHeader = username+':'+password;
        system.debug('Encoder Value' + EncodingUtil.base64Encode(headerValue));
        r.setMethod('POST');
        r.setHeader('Authorization', authorizationHeader);
        r.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    	r.setHeader('Accept', 'application/json');
        Customer customer = new Customer();
        customer.first_name = 'Ajit';
        customer.last_name = 'JJJF';
        customer.email = 'ajit@dreamwares.com';
        
        r.setBody(customer.getEncodedURL());
        system.debug('request ::'+r);
        system.debug('request body ::'+JSON.serialize(customer));
        HTTPResponse authresp = auth.send(r);
        system.debug('authresp ::'+authresp);
        system.debug('data ::'+ authresp.getBody());
		system.debug('Authentication success!!!' + authresp);
        /*try
        {
            
            else
            {system.debug('Authentication failed!!!' + authresp + authresp.getStatusCode());}    
        }catch(exception e){}*/
    }
    
    public class Customer{
        public string first_name;
        public string last_name;
        public string email;
        
        public String getEncodedURL()
        {
            String encodedURL = '&first_name='+((null != this.first_name)?this.first_name:'')
                +'&last_name='+((null != this.last_name)?this.last_name:'')
                +'&email='+((null != this.email)?this.email:'');
            return encodedURL;
        }
    }
}
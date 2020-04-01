global class TwilioCapabilityNew {
    
   private class IllegalStateException extends Exception {}

    private String accountSid;
    private String authToken;

    /**
     * Create a new TwilioCapability with zero permissions. Next steps are to
     * grant access to resources by configuring this token through the functions
     * allowXXXX.
     * 
     * @param accountSid  the account sid to which this token is granted access
     * @param authToken   the secret key used to sign the token. Note, this auth token is not visible to the user of the token.
     */
    global TwilioCapabilityNew(String accountSid, String authToken) {
        this.accountSid = accountSid;
        this.authToken = authToken;
    }

    /**
     * Generates a new token based on the credentials and permissions that
     * previously has been granted to this token.
     * 
     * @return the newly generated token that is valid for 3600 seconds
     */
    global String generateToken(TwilioChatTokenGenration.Grants grantsRec) {
        return generateToken(3600, grantsRec);
    }

    /**
     * Generates a new token based on the credentials and permissions that
     * previously has been granted to this token.
     * 
     * @param expiresAt
     *            the expiration instance of the token.
     * @return the newly generated token that is valid for ttl seconds
     */
    global String generateToken(long ttl, TwilioChatTokenGenration.Grants grantsRec) {
        Map<String, Object> payload = new Map<String, Object>(); 
        payload.put('iss','SK5837b1533d2a1ab03f6fc11cac5c847f');
        payload.put('exp', System.currentTimeMillis()/1000 + ttl);
        payload.put('sub', this.accountSid);
        payload.put('jti','SK5837b1533d2a1ab03f6fc11cac5c847f'+'1450471147');
        payload.put('nbf',System.currentTimeMillis()/1000);
        payload.put('grants', grantsRec);
		system.debug('payload::'+JSON.serialize(payload));
        return jwtEncode(payload, this.authToken);
    }

    /**
     * Construct URL-style query param string, e.g. key1=val1&key2=val2&...keyN=valN
     */
    @TestVisible
    private static String generateParamString(Map<String, String> params) {
        String queryString = '';
        
        Set<String> keySet = params.keySet();
        for (String key : keySet) {
            if (queryString.length() > 0) {
                queryString += '&';
            }
            queryString += EncodingUtil.urlEncode(key, 'UTF-8') + '='
                + EncodingUtil.urlEncode(params.get(key), 'UTF-8');
        }
        return queryString;
    }

    /**
     * Construct JWT token consisting of header, payload, and signature
     *
     * See http://self-issued.info/docs/draft-jones-json-web-token.html
     */
    @TestVisible 
    private static String jwtEncode(Map<String, Object> payload, String key) {
        Map<String, Object> header = new Map<String, Object>();
        header.put('typ', 'JWT');
        header.put('alg', 'HS256');
        header.put('cty', 'twilio-fpa;v=1');

        List<String> segments = new List<String>();
        segments.add(urlSafeEncodeBase64(JSON.serialize(header)));
        segments.add(urlSafeEncodeBase64(JSON.serialize(payload)));

        String signature = sign(join(segments, '.'), key);
        segments.add(signature);

        return join(segments, '.');
    }

    @TestVisible
    private static String urlSafeEncodeBase64(String data) {
        return urlSafeEncodeBase64(Blob.valueOf(data));
    }

    @TestVisible
    private static String urlSafeEncodeBase64(Blob data) {
        String encodedString = EncodingUtil.base64Encode(data);
        return encodedString.replace('+','-').replace('/','_').replace('=', ''); // make URL-safe
    }
    
    /**
     * Construct a String containing the contents of 'vals' separated by 'sep'
     */
    @TestVisible
    private static String join(List<String> vals, String sep) {
        String sb = '';
        for (Iterator<String> it=vals.iterator(); it.hasNext(); ) {
            String value = it.next();
            if (sb.length() != 0)
                sb += sep;
            sb += value;
        }
        return sb;
    }

    /**
     * Generate a signature for the token
     *
     * See http://self-issued.info/docs/draft-jones-json-web-signature.html
     *   and http://discussion.forum.nokia.com/forum/showthread.php?130974-Help-required-How-to-generate-a-MAC-(HMAC-SHA1)-with-Java
     */
    private static String sign(String data, String key) {
        Blob mac = Crypto.generateMac('hmacSHA256', Blob.valueOf(data), Blob.valueOf(key));
        String result = urlSafeEncodeBase64(mac);
        return result;
    }
    
    private class TestOnlyException extends Exception {}   
}
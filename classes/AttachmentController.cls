public class AttachmentController {
    public List<Attachment> attachmentList{get;set;}
    
    public AttachmentController(){
        attachmentList = [SELECT Id, Name, ContentType FROM Attachment where ParentId = '0017F00000RwYP5'];
    }
}
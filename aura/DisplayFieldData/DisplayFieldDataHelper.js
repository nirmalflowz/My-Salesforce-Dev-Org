({
    component : null, 
    
    findByPath : function( obj, path) {
        if(path == undefined){
            return '';
        }
        path = path.split('.');
        var res=obj;
        for (var i=0;i<path.length;i++) {
            if(res != undefined){
                
                if(i > 0 && path[i] == 'Name'){
                    //console.log('recId= ', res['Id']);
                    this.component.set('v.recId', res['Id']);
                }
                res=res[path[i]];
            }
        }
        return res;
    },
    
    navigateToSobject : function(recId) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            recordId: recId,
            slideDevName: 'detail'
        });
        navEvt.fire();
    },
    
})
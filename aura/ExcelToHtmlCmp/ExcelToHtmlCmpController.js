({
	parse : function(component, event, helper) {
        if(component.get('v.rawData')){
            var table = helper.parseRawData(component.get('v.rawData'));
            component.set('v.table',table);
            component.set('v.showError',false);
        }else{
            component.set('v.showError',true);
        }
		
	},
    clearInput : function(component, event, helper){
        component.set('v.rawData','');
        component.set('v.table',[]);
        component.set('v.showError',false);
    },
    hideToast:function(component, event, helper){
        component.set('v.showError',false);
    }
})
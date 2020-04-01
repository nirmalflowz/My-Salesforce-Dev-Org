function numericType(){
    return {
        restrict:'A',
        require:'ngModel',
        scope:{
          showError:'&'  
        },
        link:function(scope,elem,attr,ngModel){
            var elem = elem;
            ngModel.$validators.numericType = function(modalValue,viewValue){
                //var regex = /^[0-9]*$/g;
                if(modalValue){
                    var input = modalValue.replace(/[^0-9]/g,'');
                    if(input!=modalValue){
                        ngModel.$setViewValue(input);
                        ngModel.$render();
                    }
                    return input;
                }
                
            }
            
        }
    };
}

app.directive('numericType',numericType);

function numericDot(){
    return {
        restrict:'A',
        require:'ngModel',
        link:function(scope,elem,attr,ngModel){
            ngModel.$validators.numericDot = function(modalValue,viewValue){
               // var regex = /^[0-9]*$/;
                if(modalValue){
                var input = modalValue.replace(/[^0-9\.]/g,'');
                    if(input!=modalValue){
                        ngModel.$setViewValue(input);
                        ngModel.$render();
                    }
                    return input;
                }
            }
            
        }
    };
}

app.directive('numericDot',numericDot);
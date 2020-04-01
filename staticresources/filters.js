function start(){
            return function(input,start){
                if(!input || !input.length){
                    return;
                }
                
                start = +start;
                return input.slice(start);
            }
        }
        
        app.filter('start',start);
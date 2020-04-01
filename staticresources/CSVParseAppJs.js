var quoteLineApp = angular.module("QuoteLineApp",["ngTable"]);
function RemotingFactory($q){
    	DataFactoryObj = {};
    	try{
	    		DataFactoryObj.invokeRemoteAction = function(options){
	    		var defer = $q.defer();
	    		options.callback = function(result,event){
	    			if(event.status){
	    				defer.resolve(result);
	    			}else{
	    				defer.reject(event.message);
	    			}
	    		};
	    		
	    		options.vfConfig = {escape:false};
	    		var arguments = [];
	    		
	    		arguments.push(options.url);
	    		
	    		for(var i=0,len=options.params.length;i<len;i++){
	    			arguments.push(options.params[i]);
	    		}
	    		
	    		arguments.push(options.callback);
	    		arguments.push(options.vfConfig);
	    		Visualforce.remoting.Manager.invokeAction.apply(Visualforce.remoting.Manager,arguments);
	    		return defer.promise;
    		}
    	}catch(e){
    		console.error(e.message);
    	}
    	
    	return DataFactoryObj;
}
quoteLineApp.factory('RemotingFactory',RemotingFactory);
function QuoteLineAppController($scope,RemotingFactory,NgTableParams,$filter,$window,$timeout){
    $scope.tableParams = null;
    $scope.search = { term: '' };
    $scope.parseCsvFiles = function(){
        var files = angular.element(document.getElementById('files'))[0].files;
        console.log('files ::',files);
        var dataArr=[];
        var rawData='';
        if(files.length){
            for(var i=0; i<files.length;i++){
                var reader = new FileReader();
                reader.onload = function(e) {
                    var lines = e.target.result.split('\r\n');
                    for (i = 0; i < lines.length; ++i)
                    {
                        //rawData += lines[i]+'\n';
                        //$('div').append('<br>' + lines[i]);
                        //dataArr.push(lines[i]);
                        if(i == files.length-1){
                            console.log('rawData'+i+' ::',rawData);
                            var rows = lines;//rawData.split('\n');
                            for (i = 0; i < rows.length; i++) {		   	   
                                rows[i] = rows[i].split(',');		
                            }
                            console.log('rows ::',rows);
                            //Assuming First Row Is Always Header
            				var headers = rows[0];
                            console.log('headers',headers);
                            var table = [];
                            var headerRow = {};
                            var headerField = [];
                            angular.forEach(headers,function(header,idx){		
                                headerField.push({headerName:header,headerFieldName:header.indexOf(' ') > -1 ? header.replace(/\s/g, '') : header});
                            });
                            angular.forEach(headerField, function(field,idx){
                                headerRow[field.headerFieldName] = field.headerFieldName;
                            });
                            table.push(headerRow);
                            for(var i= 1; i< rows.length; i++){
                                var row = [];
                				var columns = rows[i]; 
                                
                                //angular.forEach(headers,function(header,idx){	
                                    var limit = columns.length;
                    				var value = "";
                                	var obj = {};
                                    for(var j= 0; j< limit; j++){
                                        value = columns[j];
                                        obj[headerField[j].headerFieldName] = value;
                                    }
                                    //row.push(obj);
                                //});
                                table.push(obj);
                            }
                            console.log(table);
                            $timeout(function(){
                                createTableData(table);
                            },10);
                            
                        }
                        
                    }
                };
                reader.readAsText(files.item(i));
            }
        }
        
    }
    
    function createTableData(result){
        $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 10,
                    filter: $scope.search
                }, { 
                    dataset: result,
                    counts: [10,25,50,100],
                    total: result.length,
                    getData: function(params) {
                        
                        var orderedData;

                        if (params.filter().term) {
                            orderedData = params.filter() ? $filter('filter')(result, params.filter().term) : result;
                        } else {
                            orderedData = params.sorting() ? $filter('orderBy')(result, params.orderBy()) : result;
                        }
                        //searchText(result);
                        params.total(orderedData.length);
                        if(!orderedData.length){
                            $scope.noDataFound = true;
                        }else{
                            $scope.noDataFound = false;
                        }
                        return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        //$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        
                    }
                });
    }
    
}
quoteLineApp.controller('QuoteLineAppController',QuoteLineAppController);
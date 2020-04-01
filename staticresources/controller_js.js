function ParentController($scope,CartFactory,$compile){

        $scope.cartCollection = CartFactory.cartCollection;
        $scope.menus = [];
        $scope.activeItem = 'home';
        $scope.menus.push({
        	id:'home',
        	title:'Home',
        	url:'#'
        },{
        	id:'about',
        	title:'About Us',
        	url:'#/aboutus'
        },{
        	id:'services',
        	title:'Services',
        	url:'#/services'
        },{
        	id:'contact',
        	title:'Contact Us',
        	url:'#/contactus'
        },{
        	id:'cart',
        	title:'',
        	url:'#/cart'
        },{
        	id:'itemcount',
        	title:'',
        	url:''
        });
        
        
        
        $scope.setActiveItem = function(item){
        	$scope.activeItem = item.id;
        }
}
    
app.controller('ParentController',ParentController);

app.controller("mainController", function($scope,$location,$http,ProductFactory,CartFactory,$filter,$timeout,CategoryFactory){
        $scope.users = ProductFactory.usersCollection;
        $scope.setLoading = true;
        $scope.newItem={};
        $scope.submitted=false;
        $scope.category={};
        $scope.productId = 0;
        $scope.pageSize = 6;
        $scope.filtered={};
        $scope.gridview=true;
        $scope.slider = window.slider;
        
        
        //$scope.listview=false;
        $scope.dismiss='';
        $scope.numPages = 0;
        $scope.currentPage=ProductFactory.currentPage;
        toastr.options={
           positionClass:'toast-top-center'
        };
        //if($scope.users.length == 0){
    
        $scope.loadData = function(){
            if($scope.users.length == 0){
            var userPromise = ProductFactory.getUsers();
                    userPromise.then(function(data){
                        //ProductFactory.setUserCollection(data);
                        $scope.users = ProductFactory.usersCollection;
                        $scope.currentPage=ProductFactory.currentPage;
                        $scope.setLoading = false;

                        //watchValues();
                        //$scope.category={};
                    },function(error){
                        alert(error);
                    });
            }
        }
            
        //}
        
        
        $scope.addToCart = function(userId){ 
            CartFactory.addToCart(userId);
        }
        
        $scope.uploadFile = function(){
            
        }
        
        
        
        $scope.setCategory = function(type){
            CategoryFactory.setCategory(type);
            $scope.filterByKey = CategoryFactory.type;
            //alert($scope.filterByKey);
        }
        
        $scope.addNewItem = function(item,formname){
            //alert('in add item');
            var product={};
            //$scope.submitted = true;
            //return false;
            if(formname.$valid){
                if($scope.users.length > 0){
                    product = ProductFactory.addNewItem($scope.users,item);
                }
            
                $scope.users.push(product);
                $scope.dismiss='modal';
                //$timeout(function(){
                    $scope.newItem = {};
                
                $scope.newItemForm.$setPristine();
                //},10);
                
                
            }
            
            //$scope.hideNewItemwin = true;
        }
        
        $scope.setView = function(type){
            if(type=='grid'){
                $scope.gridview=true;
                //$scope.listview=false;
            }else{
                $scope.gridview=false;
                //$scope.listview=true;
            }
        }
        
        $scope.pageChanged = function(page){
            ProductFactory.currentPage = page;
            $scope.currentPage=ProductFactory.currentPage;
        }
        
        
        
        //console.log(CategoryFactory);
    });

app.controller("aboutUsController", function($scope,$location){

console.log('about us');
        console.log($location.absUrl());
});


app.controller("servicesController", function($scope){
console.log('services');

});
app.controller("myCtrl", function($scope){
console.log('services');

});

app.controller("contactUsController", function($scope){
 console.log('contact us');
});
    
    function productDescController($scope,$location,$routeParams,ProductFactory,$filter){
        var userId = $routeParams.userId;
        console.log(userId);
        var usersCollection = ProductFactory.usersCollection;
        var userRec = $filter('filter')(usersCollection,{productId:parseInt(userId)},true)[0];
        console.log(userRec);
        //ProductFactory.setUserDetails(userRec);
        $scope.userDetail = userRec;
    }
    app.controller('productDescController',productDescController);
    
    function cartController($scope,CartFactory,$location){
    $scope.cartCollection = CartFactory.cartCollection;
        toastr.options={
           positionClass:'toast-top-center'
        };
        if($scope.cartCollection.length == 0){
            //alert('No items');
            toastr.info('Please add items to cart.');
            $location.path("/");
        }
        
        $scope.emptyCartImg = window.emptyCartImg;
        
        $scope.cartItems = CartFactory.cartCollection;
        
        $scope.isNumber = function(evt){
            
          if ( evt.keyCode == 46 || evt.keyCode == 8 ) {
            // let it happen, don't do anything
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (evt.keyCode < 48 || evt.keyCode > 57 ) {
                    evt.preventDefault(); 
                }   
            }
       
        }
        
        $scope.addQty = function(item,type){
            CartFactory.addQty(item,type);
        }
        
        $scope.getTotal=function(){
            return CartFactory.getTotal();
        }
        
        $scope.calculateSubTotal = function(item){
            return CartFactory.calculateSubTotal(item);
        }
        
        $scope.deleteCartItem = function(item,event){
            CartFactory.deleteCartItem(item);
            $scope.cartItems = CartFactory.cartCollection;
            event.preventDefault();
        }
    }
    
    app.controller('cartController',cartController);
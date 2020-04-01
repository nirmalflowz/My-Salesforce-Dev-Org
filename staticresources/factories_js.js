function CategoryFactory(){
        var categoryFactory={};
        
        categoryFactory.type='';
        categoryFactory.setCategory = function(name){
            categoryFactory.type = name;
            //alert('Category Changed'+categoryFactory.type);
            console.log(categoryFactory);
        }
        
        
        return categoryFactory;
    }
    
    app.factory('CategoryFactory',CategoryFactory);
    
    
    
    function ProductFactory($q,$http){
        var productFactory = {};
        productFactory.usersCollection = [];
        productFactory.userObj = {};
        productFactory.currentPage = 1;
        productFactory.getUsers = function(){
            var data = [];
            var defered = $q.defer();
            $http.get(window.products).then(function(response){//https://api.github.com/users
                productFactory.usersCollection = response.data;
               defered.resolve(response.data);
                
            },function(response){
                if(response.data){
                    defered.reject(response.data.message);
                }
                
            });
            return defered.promise;
        }
        
        /*productFactory.setUserCollection = function(data){
            productFactory.usersCollection = data;
        }*/
        
        
        
        productFactory.setUserDetails = function(data){
            productFactory.userObj = data;
        }
        
        productFactory.addNewItem = function(list,item){
            var lastRec = list[list.length - 1];
                    if(lastRec){
                        //$scope.productId = lastRec.productId + 1;
                        item.productId = lastRec.productId + 1;
                        item.productImage = 'http://placehold.it/700x400';
                    }
            return item;
        }
        
        return productFactory;
    }
    
    app.factory('ProductFactory',ProductFactory);
    
    function CartFactory(ProductFactory,$filter){
        var cartObj = {};
        
        cartObj.cartCollection=[];
        cartObj.itemCount = 0;
        cartObj.addToCart = function(userId){
            var usersCollection = ProductFactory.usersCollection;
            var userRec = $filter('filter')(usersCollection,{productId:parseInt(userId)},true)[0];
            var cartRec = $filter('filter')(cartObj.cartCollection,{productId:parseInt(userId)},true)[0];
            //CartFactory.addToCart(userRec);
            if(!cartRec){
                cartObj.cartCollection.push(userRec);
                //cartObj.itemCount = cartObj.cartCollection.length;
                toastr.success('Added to cart.');
            }else{
                //cartRec.quantity += parseInt(userRec.quantity);
                toastr.error('Item already added to cart.Please update quantity from cart.');
            }
            
        }
        
        cartObj.addQty = function(item,type){
            if(type=='add'){
                item.quantity = (item.quantity)?item.quantity+1:1;
            }else{
                item.quantity = item.quantity>1?item.quantity-1:1;
            }
        }
        
        cartObj.getTotal = function(){
            var totalAmout = 0;
            
            angular.forEach(cartObj.cartCollection,function(value,key){
                totalAmout += parseFloat(value.subTotal);
            });
            
            return totalAmout.toFixed(2);
        }
        
        cartObj.calculateSubTotal = function(item){
            var subTotalAmt = 0;
            if(!isNaN(parseInt(item.quantity))){
                subTotalAmt += parseFloat(item.productPrice) * parseInt(item.quantity);
            }
            
            item.subTotal = subTotalAmt;
            return subTotalAmt.toFixed(2);
        }
        
        cartObj.deleteCartItem = function(item){
            var index = cartObj.cartCollection.indexOf(item);
            cartObj.cartCollection.splice(index,1);
        }
        
        return cartObj;
    }
    
    app.factory('CartFactory',CartFactory);
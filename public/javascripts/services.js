app.service('userLoggedInService', function() {
  // var productList = [];

  // var addProduct = function(newObj) {
  //     productList.push(newObj);
  // };

  // var getProducts = function(){
  //     return productList;
  // };

  // return {
  //   addProduct: addProduct,
  //   getProducts: getProducts
  // };
  var name = '';
  var getName = function(){
    return name;
  }
  var addName = function(newName){
    name = newName;
  }
  var removeName = function(){
    name = '';
  }
  console.log('in service',name);
  return {getName: getName, addName: addName, removeName: removeName};

});
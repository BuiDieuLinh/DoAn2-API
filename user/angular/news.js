appuser.controller("NewsCtrl", function($scope, $http){
    $scope.listNews = [];

    $scope.LoadNews = function(){
        $http.get(currentuser_url + '/api/BaiViet/GetAll')
            .then(function (response) {
                console.log(response.data);
                $scope.listNews = response.data;    
            });
    }
    $scope.LoadNews()
    $scope.linkImage = function(){
        $http.get(`${currentuser_url}'/api/BaiViet/get-img/'${$scope.listNews.image}`)
            .then(function(response){
                $scope.imageNews = response.data;
                console.log("hình ảnh news: ",$scope.imageNews)
            })
    }
    $scope.linkImage()
})
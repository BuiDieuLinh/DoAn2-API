app.controller("ReportCtrl", function($scope, $http){
    $scope.reportToday = {}

    $scope.LoadReportToday = function(){
        $http.get(current_url + '/api/ThongKe/ThongKeHomNay')
            .then(function(response){
                $scope.reportToday = response.data;
            }).catch(function(err){
                console.error("Lỗi khi đọc dl thống kê hôm nay: ", $scope.reportToday)
            })
    }
    $scope.LoadReportToday()
})
appuser.controller("AccessCtrl",function($scope, $http){
    $scope.listAccesses = {}

     // Lấy productId từ URL
     var params = new URLSearchParams(window.location.search);
     var productId = params.get('productId');
 
     if (!productId) {
         // alert("Không tìm thấy productId!");
         return;
     }
    $scope.LoadAccess = function () {
        // Gửi yêu cầu lấy danh sách đánh giá
        $http({
            method: 'GET',
            url: `${currentuser_url}/api/DanhGia/GetByProductId/${productId}`
        }).then(function (response) {
            $scope.listAccesses = response.data;
            $scope.countListAccesses = $scope.listAccesses.length;
            console.log($scope.listAccesses)
            // Tạo danh sách các promise để lấy thông tin người dùng
            const userPromises = $scope.listAccesses.map(access => {
                return $http({
                    method: 'GET',
                    url: `${currentuser_url}/api/User/GetData?id=${access.nguoidung_id}`
                }).then(function (userResponse) {
                    const user = userResponse.data;
                    access.tenTaiKhoan = user.tenTaiKhoan || "Không xác định";
                    access.image = user.image || [];
                    console.log(access.image)
                }).catch(function (err) {
                    console.error(`Lỗi khi lấy dữ liệu người dùng với ID: ${access.nguoidung_id}`, err);
                    access.tenTaiKhoan = "Không xác định";
                    access.image = [];
                });
            });
        }).catch(function (err) {
            console.error("Lỗi khi đọc danh sách đánh giá:", err);
        });
    };
    
    // Gọi hàm LoadAccess
    $scope.LoadAccess();

});
appuser.controller('UserCtrl', function($scope,$http) {
    $scope.infoUser = {}
    var nguoidung_id = localStorage.getItem("user_id")
    $scope.GetUser = function (){
        $http({
            method: 'GET',
            url: `${currentuser_url}/api/User/GetData?id=${nguoidung_id}`,
            headers:{
                "Content-type" : "application/json"
            }
        }).then(function(response){
            console.log(response.data);
            
            $scope.infoUser = response.data
            console.log("Thông tin người dùng:" , $scope.infoUser)
        }).catch(function(err){
            console.log("Lỗi khi lấy thông tin người dùng: ",err)
        })
    }
    $scope.GetUser()

 
    // Chọn file ảnh
    $scope.onFileSelected = function (event) {
        const file = event.target.files[0];
        if (file) {
            $scope.file = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(() => {
                    $scope.previewImage = e.target.result;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    $scope.saveUser = function() {
        const formData = new FormData();
    
        // Gửi dữ liệu người dùng
        formData.append("nguoidung_id", nguoidung_id)
        formData.append("tenTaiKhoan", $scope.infoUser.tenTaiKhoan);
        formData.append("tenNguoiDung", $scope.infoUser.tenNguoiDung);
        formData.append("email", $scope.infoUser.email);
        formData.append("matKhau", $scope.infoUser.matKhau);
        formData.append("soDienThoai", $scope.infoUser.soDienThoai);
        formData.append("diaChi", $scope.infoUser.diaChi);
        formData.append("role", $scope.infoUser.role);
        formData.append("token", $scope.infoUser.toke);
        formData.append("ngayDangKy", $scope.infoUser.ngayDangKy );
    
        // Gửi file ảnh nếu có
        if ($scope.file) {
            formData.append("imagePath", $scope.file);
            $scope.infoUser.image = `http://localhost:44364/imageUser/${$scope.file.name}`; // Cập nhật đường dẫn ảnh
            formData.append("image",$scope.infoUser.image);
        }
        else if(!$scope.file){
            formData.append("imagePath", $scope.infoUser.image)
            formData.append("image", $scope.infoUser.image)
        }
    
       // Gửi dữ liệu tới API
       $http({
            method: "POST",
            url: currentuser_url + '/api/User/update',
            data: formData, 
            headers: {
                "Content-Type": undefined // Trình duyệt sẽ tự động thiết lập Content-Type
            }
            }).then(function(response) {
                alert("Cập nhật thành công!");
                $scope.infoUser = response.data
            }).catch(function(error) {
                console.error("Lỗi khi cập nhật:", error);
                alert("Có lỗi xảy ra khi cập nhật!");
            });
    };

    
    
})
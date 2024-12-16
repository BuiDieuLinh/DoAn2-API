app.controller("UserCtrl", function ($scope, $http) {
    $scope.listUser = [];    

    // Hàm tải danh sách nhà cung cấp
    $scope.LoadUser = function () {
        $http.get(current_url + '/api/Users/Get-All')
            .then(function (response) {
                console.log(response.data);
                $scope.listUser = response.data;
            });
    };
    $scope.LoadUser();

    // Update user
    // Khởi tạo userEdit trước khi sử dụng
    $scope.userEdit = {
        nguoidung_id: "",
        tenTaiKhoan: '',
        tenNguoiDung: '',
        diaChi: '',
        email: '',
        soDienThoai: '',
        matKhau: '',
        role: '',
        ngayDangKy: '',
        image: '',
        previewImage: ''
    };
    $scope.isEditUserPopupVisible = false; // Ẩn popup khi khởi tạo

    $scope.openEditUserPopup = function(user) {
        $scope.isEditUserPopupVisible = true; // Hiển thị popup
        if(user){
            $scope.userEdit = angular.copy(user); // Sao chép dữ liệu người dùng vào model chỉnh sửa

        }
        else{
            $scope.userEdit = {}
        }
        console.log($scope.userEdit)
    };

    $scope.closeEditUserPopup = function() {
        $scope.isEditUserPopupVisible = false; // Ẩn popup
    };

    $scope.openAddUserPopup = function(){
        $scope.isEditUserPopupVisible = true
        $scope.userEdit = {};
    }
    
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

    function ItemUser() {
        const formData = new FormData();
        formData.append("tenTaiKhoan", $scope.userEdit.tenTaiKhoan);
        formData.append("matKhau", $scope.userEdit.matKhau.trim()); // Loại bỏ khoảng trắng thừa trong mật khẩu
        
        formData.append("ngayDangKy", $scope.userEdit.ngayDangKy);
        formData.append("diaChi", $scope.userEdit.diaChi);
        formData.append("email", $scope.userEdit.email);
        formData.append("soDienThoai", $scope.userEdit.soDienThoai);
        formData.append("Nguoidung_id", $scope.userEdit.nguoidung_id);
        formData.append("Role", $scope.userEdit.role);
        formData.append("TenNguoiDung", $scope.userEdit.tenNguoiDung);
        formData.append("token","agshdahd")
        formData.append("imagePath", $scope.file);
        $scope.userEdit.image = `http://localhost:52890/imageUser/${$scope.file.name}`; // Cập nhật đường dẫn ảnh
        formData.append("image",$scope.userEdit.image);
        return formData;
    }
    
    // Update 
    $scope.submitEditForm = function() {
        console.log($scope.userEdit); // Kiểm tra dữ liệu đã chỉnh sửa
        const formDataEdit = ItemUser();
        // Gửi dữ liệu tới API
        $http({
            method: "POST",
            url: current_url + '/api/Users/update-user',
            data: formDataEdit, 
            headers: {
                "Content-Type": undefined // Trình duyệt sẽ tự động thiết lập Content-Type
            }
        }).then(function(response) {
            alert("Cập nhật thành công!");
            $scope.LoadUser(); // Tải lại danh sách người dùng
            $scope.closeEditUserPopup(); // Đóng popup
        }).catch(function(error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Có lỗi xảy ra khi cập nhật!");
        });
    };
    
    $scope.XoaUser = function(nguoidung_id) {
        console.log(nguoidung_id)
        
        if (!nguoidung_id) {
            console.error("nguoidung_id không hợp lệ");
            return;
        }
        
        // Hỏi người dùng có chắc chắn muốn xóa không
        if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
            $http({
                method: 'POST',
                url: `${current_url}/api/Users/delete-user?id=${nguoidung_id}`, // Đảm bảo URL đúng
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function() {
                alert("Xóa dữ liệu thành công");
                $scope.listUser = $scope.listUser.filter(user => user.nguoidung_id !== nguoidung_id);
            }).catch(function(error) {
                console.error("Lỗi khi xóa dữ liệu:", error);
            });
        }
    }

    // tìm kiếm
    $scope.filterUser = function(user){
        if(!$scope.searchUser){
            return true
        }
        const keyword = $scope.searchUser.toLowerCase();
        return (user.nguoidung_id && user.nguoidung_id.toLowerCase().includes(keyword)) ||
                (user.tenNguoiDung && user.tenNguoiDung.toLowerCase().includes(keyword)) ||
                (user.tenTaiKhoan && user.tenTaiKhoan.toLowerCase().includes(keyword)) ||
                (user.role && user.role.toLowerCase().includes(keyword)) ||
                (user.ngayDangKy && user.ngayDangKy.toLowerCase().includes(keyword)) ||
                (user.soDienThoai && user.soDienThoai.toLowerCase().includes(keyword)) ||
                (user.diaChi && user.diaChi.toLowerCase().includes(keyword)) ||
                (user.email && user.email.toLowerCase().includes(keyword));
    }
})
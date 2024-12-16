app.controller("NewsCtrl", function($scope, $http){
    $scope.listNews = [];    

    // Hàm tải danh sách nhà cung cấp
    $scope.LoadNews = function () {
        $http.get(current_url + '/api/BaiViet/Get-All-BaiViet')
            .then(function (response) {
                console.log(response.data);

                 // Gọi API lấy danh sách người dùng
                $http({
                    method: 'GET',
                    url: current_url + '/api/Users/Get-All'
                }).then(function (userResponse) {
                    var userList = userResponse.data;
        
                    $scope.listNews.forEach(function (news) {
                        var user = userList.find(u => u.nguoidung_id === news.nguoidung_id);
                        news.tenNguoiDung = user ? user.tenNguoiDung : 'Không xác định';
                    });
                });
                // Thêm đường dẫn đầy đủ cho ảnh của mỗi user
                $scope.listNews = response.data.map(user => {
                    user.image = current_url + user.image; // Cập nhật đúng đường dẫn ảnh
                    return user;
                });
                $scope.listNews = response.data;
                    
            });
    };
    $scope.LoadNews();

    $scope.activeTab = 'new';  // Đảm bảo giá trị mặc định là 'new'

    // Hàm chuyển đổi tab
    $scope.switchTab = function(tab) {
      $scope.activeTab = tab;
    };

    $scope.isOpenPopUpNews = false; // Ẩn popup khi khởi tạo
    $scope.selectedNews = {}
    $scope.openPopUpNews = function(news) {
        $scope.isOpenPopUpNews = true; // Hiển thị popup
        if(news){
            $scope.selectedNews = angular.copy(news); // Sao chép dữ liệu người dùng vào model chỉnh sửa

        }
        else{
            $scope.selectedNews = {}
        }
    };

    $scope.closePopUpNews = function() {
        $scope.isOpenPopUpNews = false; // Ẩn popup
    };

    
    $scope.onNewsSelectedImage = function (event) {
        const file = event.target.files[0];
        if (file) {
            $scope.fileNews = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(() => {
                    $scope.selectedNews.image = e.target.result; // Gán đường dẫn base64 vào selectedNews.image
                });
            };
            reader.readAsDataURL(file);
        }
    };
    $scope.onFileSelected = function (event) {
        const file = event.target.files[0];
        if (file) {
            $scope.fileNew = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(() => {
                    $scope.newsEdit.image = e.target.result; // Gán đường dẫn base64 vào selectedNews.image
                });
            };
            reader.readAsDataURL(file);
        }
    };
    $scope.newsEdit = {
        baiviet_id: '',
        tenBaiViet: '',
        ngayDang: new Date(),
        noiDung: '',
        nguoidung_id: '',
        image: ''
    };
    
    // Lấy `nguoidung_id` từ localStorage
    const nguoidung_id = localStorage.getItem("user_id");
    
    // Hàm thêm bài viết
    $scope.AddNews = function() {
        const formData = new FormData(); // Gọi hàm để lấy Form
        formData.append("baiviet_id", `BV${Math.floor(Math.random() * 1000000)}`); // Mã bài viết ngẫu nhiên
        formData.append("tenBaiViet", $scope.newsEdit.tenBaiViet); // Tiêu đề bài viết
        formData.append("ngayDang", $scope.newsEdit.ngayDang.toISOString()); // Định dạng ngày giờ ISO
        formData.append("noiDung", $scope.newsEdit.noiDung); // Nội dung bài viết
        formData.append("nguoidung_id", nguoidung_id); // ID người dùng
        if ($scope.fileNew) {
            formData.append("imagePath", $scope.fileNew); // Tệp hình ảnh (nếu có)
            formData.append("image", `http://localhost:52890/imageNews/${$scope.fileNew.name}`)
        }
        $http({
            method: 'POST',
            url: current_url + '/api/BaiViet/create-BaiViet',
            data: formData,
            headers: { 'Content-Type': undefined }// Để trình duyệt tự thiết lập Content-Type
           
        }).then(function(response) {
            $scope.listNews = response.data;
            alert("Thêm bài viết thành công!");
            $scope.LoadNews();
        }).catch(function(error) {
            console.error("Xảy ra lỗi khi thêm bài viết: ", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        });
    };
    
    $scope.checkIdExists = function(news_id) {
        return $scope.listNews.find(news => news.baiviet_id === news_id) !== undefined;
    };

    // Update 
    $scope.submitEditForm = function(baiviet_id) {
        if ($scope.checkIdExists(baiviet_id)){
            console.log($scope.checkIdExists())
            const formDataEdit = new FormData();
            formDataEdit.append("baiviet_id", baiviet_id)
            formDataEdit.append("tenBaiViet", $scope.selectedNews.tenBaiViet); // Tiêu đề bài viết
            formDataEdit.append("ngayDang", $scope.selectedNews.ngayDang); // Định dạng ngày giờ ISO
            formDataEdit.append("noiDung", $scope.selectedNews.noiDung); // Nội dung bài viết
            formDataEdit.append("nguoidung_id", nguoidung_id); // ID người dùng
            if ($scope.fileNews) {
                formDataEdit.append("imagePath", $scope.fileNews); // Tệp hình ảnh (nếu có)
                formDataEdit.append("image", `http://localhost:52890/imageNews/${$scope.fileNews.name}`)
            }
            // Gửi dữ liệu tới API
            $http({
                method: "PUT",
                url: current_url + '/api/BaiViet/update-BaiViet',
                data: formDataEdit, 
                headers: {
                    "Content-Type": undefined // Trình duyệt sẽ tự động thiết lập Content-Type
                }
            }).then(function(response) {
                alert("Cập nhật thành công!");
                $scope.LoadNews(); // Tải lại danh sách người dùng
                // $scope.closeEditUserPopup(); // Đóng popup
            }).catch(function(error) {
                console.error("Lỗi khi cập nhật:", error);
                alert("Có lỗi xảy ra khi cập nhật!");
            });
        }else{
            alert("Không thấy tìm thấy id !")
        }
    };
    
    $scope.XoaNews = function(news_id) {
        console.log(news_id)
        
        if (!news_id) {
            console.error("id bài viết không hợp lệ");
            return;
        }
        
        // Hỏi người dùng có chắc chắn muốn xóa không
        if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
            $http({
                method: 'PUT',
                url: `${current_url}/api/BaiViet/delete-BaiViet?id=${news_id}`, // Đảm bảo URL đúng
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function() {
                alert("Xóa dữ liệu thành công");
                $scope.LoadNews();
            }).catch(function(error) {
                console.error("Lỗi khi xóa dữ liệu:", error);
            });
        }
    }

    // tìm kiếm
    $scope.filterBaiViet = function(baiviet){
        if(!$scope.searchNews){
            return true
        }
        const keyword = $scope.searchNews.toLowerCase();
        return (baiviet.tenBaiViet && baiviet.tenBaiViet.toLowerCase().includes(keyword)) ||
                (baiviet.ngayDang && baiviet.ngayDang.toLowerCase().includes(keyword)) ;
    }

})
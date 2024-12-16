app.controller("PriceCtrl", function($scope, $http){
     // Biến lưu thông tin sản phẩm được chọn
     $scope.selectedAttribute = {};

     // Hàm chọn sản phẩm
     $scope.selectedAttr = function (product, $event) {
         // Lấy trạng thái checkbox từ sự kiện
         const isChecked = $event.target.checked;
     
         if (isChecked) {
             // Nếu checkbox được chọn, lưu dữ liệu sản phẩm
             $scope.selectedAttribute = angular.copy(product);
             console.log("thuộc tính đượcc chọn", $scope.selectedAttribute)
         } else {
             // Nếu checkbox bị bỏ chọn, xóa dữ liệu
             $scope.selectedAttribute = {};
         }
    };

    $scope.listDetailProduct = []
    // lấy dữ liệu chi tiết
    $scope.LoadDetail = function(){
        $http.get(`${current_url}/api/KinhMat/GetAllThuocTinh`)
            .then(function(response){
                console.log("danh sách thuộc tính: ", response.data);
                $scope.listDetailProduct = response.data
            })
    };
    $scope.LoadDetail()

    // phân trang
    $scope.currentPage = 1;
    $scope.itemsPerPage = 8;

    $scope.paginatedProducts = function() {
        let startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        let endIndex = startIndex + $scope.itemsPerPage;
        return $scope.listDetailProduct.slice(startIndex, endIndex);
    };

    $scope.totalPages = function() {
        return Math.ceil($scope.listDetailProduct.length / $scope.itemsPerPage);
    };

    $scope.setPage = function(page) {
        if (page >= 1 && page <= $scope.totalPages()) {
            $scope.currentPage = page;
        }
    };

    $scope.price = {
        price_id:'',
        phanTramGiam: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        giaSua: '',
        ngaySua: '',
        thuoctinh_id: ''
    }
    // thêm giảm giá
    $scope.AddSale = function(){
        let addprice = {
            price_id: $scope.price_id,
            phanTramGiam: $scope.phanTramGiam,
            ngayBatDau: $scope.ngayBatDau,
            ngayKetThuc: $scope.ngayKetThuc,
            giaSua: $scope.giaSua,
            ngaySua: $scope.ngaySuaGia,
            thuoctinh_id: $scope.selectedAttribute.thuoctinh_id
        }
        $http({
            method:'POST',
            url: current_url + '/api/Price/create-GiamGia',
            data: JSON.stringify(addprice),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(response){
            $scope.listPrice = response.data
            console.log($scope.listPrice)
            alert("Tạo giảm giá thành công!")
        }).catch(function(error){
            console.error("Lỗi khi tạo giảm giá: ", error)
        })
    }
});
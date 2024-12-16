appuser.controller("CategoryCtrl", function($scope, $http){
    $scope.listCategory = [];

    $scope.listProductFromCate = [];  // Khởi tạo danh sách sản phẩm từ danh mục

    $scope.loadDanhMuc = function () {
        $http.get(currentuser_url + '/api/DanhMuc/GetData').then(function (response) {
            $scope.listCategory = response.data;
            console.log("DS danh mục:", $scope.listCategory);
        }).catch(function (error) {
            console.error("Không thể tải danh mục:", error);
        });
    };
    $scope.loadDanhMuc();

    // Khởi tạo biến
    $scope.currentPage = 1; // Trang hiện tại
    $scope.itemsPerPage = 5; // Số sản phẩm trên mỗi trang
    $scope.totalPages = 0; // Tổng số trang
    $scope.currentSortCriteria = "all"; // Tiêu chí sắp xếp hiện tại
    $scope.listProductFromCate = []; // Danh sách sản phẩm ban đầu
    $scope.sortedProducts = []; // Danh sách sau khi sắp xếp nhưng chưa phân trang
    $scope.sortedAndPaginatedProducts = []; // Danh sách hiển thị sau khi phân trang

    // Hàm sắp xếp và phân trang
    $scope.sortAndPaginateProducts = function (criteria) {
        if (!$scope.listProductFromCate || $scope.listProductFromCate.length === 0) {
            console.warn("Danh sách sản phẩm trống!");
            return;
        }

        $scope.sortedProducts = angular.copy($scope.listProductFromCate); // Sao chép dữ liệu gốc

        // Sắp xếp theo tiêu chí
        if (criteria === "newest") {
            $scope.sortedProducts.sort((a, b) => new Date(b.ngayNhap) - new Date(a.ngayNhap));
        } else if (criteria === "priceDesc") {
            $scope.sortedProducts.sort((a, b) => b.listThuocTinh[0].giaBan - a.listThuocTinh[0].giaBan);
        } else if (criteria === "priceAsc") {
            $scope.sortedProducts.sort((a, b) => a.listThuocTinh[0].giaBan - b.listThuocTinh[0].giaBan);
        }

        // Nếu "all", không sắp xếp
        $scope.currentSortCriteria = criteria;

        // Cập nhật tổng số trang
        $scope.totalPages = Math.ceil($scope.sortedProducts.length / $scope.itemsPerPage);

        // Cập nhật danh sách phân trang
        $scope.updatePaginatedProducts($scope.sortedProducts);
    };

    // Hàm cập nhật phân trang
    $scope.updatePaginatedProducts = function (sortedProducts) {
        let startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        let endIndex = startIndex + $scope.itemsPerPage;
        $scope.sortedAndPaginatedProducts = sortedProducts.slice(startIndex, endIndex);
        console.log("Dữ liệu trang hiện tại:", $scope.sortedAndPaginatedProducts);
    };

    // Hàm chuyển trang
    $scope.setPage = function (page) {
        if (page >= 1 && page <= $scope.totalPages) {
            $scope.currentPage = page;
            $scope.updatePaginatedProducts($scope.sortedProducts); // Cập nhật dữ liệu phân trang
        }
    };

    // Hàm tải tất cả sản phẩm
    $scope.loadAllProducts = function () {
        $http.get(currentuser_url + '/api/KinhMat/GetAll')
            .then(function (response) {
                $scope.listProductFromCate = response.data;
                console.log("Dữ liệu sản phẩm:", $scope.listProductFromCate);
                $scope.sortAndPaginateProducts("all"); // Hiển thị dữ liệu ban đầu
            })
            .catch(function (err) {
                console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
            });
    };

    // Tải dữ liệu ban đầu
    $scope.loadAllProducts();


    // Phân loại
    $scope.Material = function() {
        $scope.material = []; // Mảng để chứa chất liệu
        // Duyệt qua từng danh mục
        $scope.listCategory.forEach(category => {
            // Kiểm tra nếu danh mục có sản phẩm trong listKinhMat
            if (category.listKinhMat && category.listKinhMat.length > 0) {
                // Duyệt qua từng sản phẩm trong listKinhMat
                category.listKinhMat.forEach(product => {
                    if (product.chatLieu) {
                        // Đưa chất liệu về chữ thường và thêm vào mảng
                        $scope.material.push(product.chatLieu);
                    }
                });
            }
        });
        // Lọc các phần tử trùng lặp
        $scope.uniqueMaterial = $scope.material.filter((value, index, self) => {
            return self.indexOf(value) === index; // Giữ lại giá trị đầu tiên xuất hiện
        });
        return $scope.uniqueMaterial;
    };
    $scope.Shape = function() {
        $scope.shape = []; // Mảng để chứa chất liệu
        // Duyệt qua từng danh mục
        $scope.listCategory.forEach(category => {
            // Kiểm tra nếu danh mục có sản phẩm trong listKinhMat
            if (category.listKinhMat && category.listKinhMat.length > 0) {
                // Duyệt qua từng sản phẩm trong listKinhMat
                category.listKinhMat.forEach(product => {
                    if (product.moTa) {
                        // Đưa chất liệu về chữ thường và thêm vào mảng
                        $scope.shape.push(product.moTa);
                    }
                });
            }
        });
        // Lọc các phần tử trùng lặp
        $scope.uniqueShape = $scope.shape.filter((value, index, self) => {
            return self.indexOf(value) === index; // Giữ lại giá trị đầu tiên xuất hiện
        });
        return $scope.uniqueShape;
    };
})
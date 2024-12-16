app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller("NhaCungCapCtrl", function ($scope, $http) {
    $scope.listNCC = [];    
    $scope.nhaCC_id = '';
    $scope.tenNhaCC = '';
    $scope.soDienThoai = '';
    $scope.diaChi = '';

    // Hàm tải danh sách nhà cung cấp
    $scope.LoadNCC = function () {
        $http.get(current_url + '/api/NhaCC/Get-All')
            .then(function (response) {
                console.log(response.data);
                $scope.listNCC = response.data;
            });
    };
    $scope.LoadNCC();

    // Tạo đối tượng nhà cung cấp từ thông tin trên form
    function createNhaCungCap() {
        return {
            nhaCC_id: $scope.nhaCC_id,
            tenNhaCC: $scope.tenNhaCC,
            soDienThoai: $scope.soDienThoai,
            diaChi: $scope.diaChi
        };
    }

    // Xóa dữ liệu trong form
    function resetForm() {
        $scope.nhaCC_id = '';
        $scope.tenNhaCC = '';
        $scope.soDienThoai = '';
        $scope.diaChi = '';
    }

    // Hàm thêm nhà cung cấp mới vào danh sách tạm
    $scope.Them = function () {
        $scope.listNCC.push(createNhaCungCap());
    };

    // Hàm lưu nhà cung cấp vào API
    $scope.Luu = function () {
        let newNhaCungCap = createNhaCungCap();
        // Kiểm tra các ô textbox không được để trống
        if (!$scope.nhaCC_id || !$scope.tenNhaCC || !$scope.soDienThoai || !$scope.diaChi) {
            alert("Vui lòng điền đầy đủ thông tin trước khi thêm.");
            return;
        }
        $http({
            method: 'POST',
            url: current_url + '/api/NhaCC/create-NhaCungCap',
            data: JSON.stringify(newNhaCungCap),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function () {
            alert('Thêm dữ liệu thành công');
            $scope.listNCC.push(newNhaCungCap);
            resetForm();
        }).catch(function (error) {
            console.error("Lỗi khi thêm dữ liệu:", error);
        });
    };

    // Hàm để hiển thị dữ liệu khi chọn một dòng
    $scope.selectItem = function(ncc) {
        $scope.nhaCC_id = ncc.nhaCC_id;
        $scope.tenNhaCC = ncc.tenNhaCC;
        $scope.soDienThoai = ncc.soDienThoai;
        $scope.diaChi = ncc.diaChi;
    };

    // Hàm sửa nhà cung cấp
    $scope.Sua = function() {
        let updateNhaCungCap = createNhaCungCap();
        // Kiểm tra các ô textbox không được để trống
        if (!$scope.nhaCC_id || !$scope.tenNhaCC || !$scope.soDienThoai || !$scope.diaChi) {
            alert("Vui lòng điền đầy đủ thông tin trước khi sửa.");
            return;
        }
        $http({
            method: 'PUT',
            url: current_url + '/api/NhaCC/update-NhaCungCap',
            data: JSON.stringify(updateNhaCungCap),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function () {
            alert('Sửa dữ liệu thành công');
            $scope.LoadNCC();
            // Tìm và cập nhật nhà cung cấp trong listNCC
            let index = $scope.listNCC.findIndex(item => item.nhaCC_id === updateNhaCungCap.nhaCC_id);
            if (index !== -1) {
                $scope.listNCC[index] = updateNhaCungCap;
            }
            resetForm();
        }).catch(function (error) {
            console.error("Lỗi khi sửa dữ liệu:", error);
        });
    };

    $scope.Xoa = function(nhaCC_id) {
        console.log(nhaCC_id)
        if (!nhaCC_id) {
            console.error("nhaCC_id không hợp lệ");
            return;
        }
        
        $http({
            method: 'DELETE',
            url: `${current_url}/api/NhaCC/delete-NhaCungCap/${nhaCC_id}`, // Đảm bảo URL đúng
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function() {
            alert("Xóa dữ liệu thành công");
            $scope.listNCC = $scope.listNCC.filter(ncc => ncc.nhaCC_id !== nhaCC_id);
            resetForm();
        }).catch(function(error) {
            console.error("Lỗi khi xóa dữ liệu:", error);
        });
    };
    
    $scope.filterSupplier = function (item) {
        if (!$scope.searchSuppliers) {
            return true;
        }
        const keyword = $scope.searchSuppliers.toLowerCase();
        return (
            (item.nhaCC_id && item.nhaCC_id.toString().toLowerCase().includes(keyword)) ||
            (item.tenNhaCC && item.tenNhaCC.toString().toLowerCase().includes(keyword)) ||
            (item.soDienThoai && item.soDienThoai.toLowerCase().includes(keyword)) ||
            (item.diaChi && item.diaChi.toLowerCase().includes(keyword)) 
        );
    };
});

app.controller("HoaDonBanCtrl", function ($scope, $http) {
    $scope.listHD = [];    
    $scope.selectedOrder = {};
    $scope.infoProductByOption = {}
    // View Order Detail
    $scope.xemChiTiet = function(sp) {
        $scope.selectedOrder = sp;
        $scope.showDetailBill = true;
    };

    $scope.closeDetailBillPopup = function () {
        $scope.showDetailBill = false;
    };
    
    $scope.statusOptions = ["Chờ xác nhận","Chờ giao hàng" ,"Đang giao hàng","Hoàn thành"];

    $scope.LoadHD = function () {
        $http({
            method: 'GET',
            url: current_url + '/api/HoaDonBan/GetAll',
        }).then(function (response) {
            console.log("Danh sách hóa đơn:", response.data);
            $scope.listHD = response.data;
    
            // Gọi API lấy danh sách người dùng
            $http({
                method: 'GET',
                url: current_url + '/api/Users/Get-All'
            }).then(function (userResponse) {
                var userList = userResponse.data;
    
                $scope.listHD.forEach(function (hd) {
                    var user = userList.find(u => u.nguoidung_id === hd.nguoidung_id);
                    hd.tenNguoiDung = user ? user.tenNguoiDung : 'Không xác định';
                    
                    // Khởi tạo tổng đơn hàng cho hóa đơn
                    hd.totalBill = 0;  // Khởi tạo giá trị tổng đơn hàng cho mỗi hóa đơn
                
                    // Lặp qua từng chi tiết hóa đơn và gọi API cho mỗi sản phẩm với đúng option_id
                    hd.listChiTietDHB.forEach(function (item) {
                        if (item.thuoctinh_id) {  // Kiểm tra xem option_id có hợp lệ không
                            $http({
                                method: 'GET',
                                url: `${current_url}/api/KinhMat/GetThuocTinh/${item.thuoctinh_id}`
                            }).then(function(optionResponse){
                                console.log(optionResponse.data);
                                item.infoProductByOption = optionResponse.data; // Gán thông tin sản phẩm vào từng item
                                var discount = (item.infoProductByOption.giaBan || 0) * (item.infoProductByOption.phanTramGiam || 0) / 100;
                                hd.totalBill += (item.infoProductByOption.giaBan - discount) * item.soLuong;
                            }).catch(function(err){
                                console.log("Lỗi khi lấy thông tin qua optionID: ", err);
                            })
                        } 
                    });
                    console.log(`Tổng đơn hàng cho hóa đơn ${hd.nguoidung_id}: ${hd.totalBill}`);
                });
                
    
            }).catch(function (error) {
                console.error("Lỗi khi gọi API Users:", error);
            });
    
        }).catch(function (error) {
            console.error("Lỗi khi gọi API HoaDonBan:", error);
        });
    };
    
	$scope.LoadHD();

    $scope.calculateOrderTotal = function (order) {
        let total = 0;
    
        // Kiểm tra nếu listChiTietDH tồn tại và là một mảng
        if (Array.isArray(order.listChiTietDHB)) {
        order.listChiTietDHB.forEach(detail => {
            const discount = (detail.infoProductByOption.giaBan || 0) * (detail.infoProductByOption.phanTramGiam || 0) / 100;
            const price = (detail.infoProductByOption.giaBan || 0) - discount;
            const quantity = detail.soLuong || 0; // Số lượng
            total += price * quantity; // Cộng dồn giá trị
        });
        }
    
        return total;
    };

    // update status
    $scope.UpdateOrderStatus = function (order) {
        $scope.selectedOrder.trangThaiDonHang = "Đã xử lý"
        $scope.selectedOrder.trangThaiGiaoHang = "Chờ giao hàng"
        $scope.selectedOrder.listChiTietDHB.forEach(function(item) {
            item.status = 2; // Gán trạng thái là 2
        });
        $http({
            method: "PUT",
            url: current_url + '/api/HoaDonBan/update',
            data: JSON.stringify(order),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            alert("Cập nhật trạng thái đơn hàng thành công!");
            // $scope.selectedOrder = response.data
            $scope.LoadSalesOrders(); // Hàm để tải lại danh sách đơn hàng
            $scope.closeDetailBillPopup();
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng: ", error);
        });
    };

    // update trạng thái giao hàng
    $scope.updateShipStatus = function(order) {
        // Kiểm tra giá trị trạng thái và cập nhật
        switch (order.trangThaiGiaoHang) {
            case "Chờ xác nhận":
                // Cập nhật trạng thái Chờ xác nhận
                console.log("Đơn hàng đang ở trạng thái 'Chờ xác nhận'");
                $scope.selectedOrder.trangThaiGiaoHang = "Chờ xác nhận"
                break;
            case "Chờ giao hàng":
                // Cập nhật trạng thái Chờ giao hàng
                console.log("Đơn hàng đang ở trạng thái 'Chờ giao hàng'");
                $scope.selectedOrder.trangThaiGiaoHang = "Chờ giao hàng"
                break;
            case "Đang giao hàng":
                // Cập nhật trạng thái Đang giao hàng
                console.log("Đơn hàng đang ở trạng thái 'Đang giao hàng'");
                $scope.selectedOrder.trangThaiGiaoHang = "Đang giao hàng"
                break;
            case "Hoàn thành":
                // Cập nhật trạng thái Hoàn thành
                console.log("Đơn hàng đã hoàn thành");
                $scope.selectedOrder.trangThaiGiaoHang = "Hoàn Thành"
                break;
            default:
                console.log("Trạng thái không hợp lệ");
                break;
        }
    
        // Thực hiện API hoặc logic cập nhật trạng thái
        $scope.selectedOrder.listChiTietDHB.forEach(function(item) {
            item.status = 2; // Gán trạng thái là 2
        });
        $http({
            method: "PUT",
            url: current_url + '/api/HoaDonBan/update',
            data: JSON.stringify(order),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            alert("Cập nhật trạng thái giao hàng thành công!");
            // $scope.selectedOrder = response.data
            $scope.LoadSalesOrders(); // Hàm để tải lại danh sách đơn hàng
            $scope.closeDetailBillPopup();
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật trạng thái giao hàng: ", error);
        });
    };
    $scope.filterOrder = function(order){
        if(!$scope.searchOrder){
            return true
        }
        const keyword = $scope.searchOrder.toLowerCase();
        return (order.donhangban_id && order.donhangban_id.toLowerCase().includes(keyword)) ||
                (order.nguoidung_id && order.nguoidung_id.toLowerCase().includes(keyword)) ||
                (order.tenKinhMat && order.tenKinhMat.toLowerCase().includes(keyword)) ||
                (order.tenNguoiDung && order.tenNguoiDung.toLowerCase().includes(keyword)) ||
                (order.trangThaiDonHang && order.trangThaiDonHang.toLowerCase().includes(keyword)) ||
                (order.trangThaiThanhToan && order.trangThaiThanhToan.toLowerCase().includes(keyword)) ||
                (order.trangThaiGiaoHang && order.trangThaiGiaoHang.toLowerCase().includes(keyword));
    }
    
});

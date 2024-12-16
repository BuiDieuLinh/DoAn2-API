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
    
    $scope.orderStatuses = ["Đã xử lý", "Đã hủy", "Hoàn thành"];
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
                
                                // Cập nhật tổng đơn hàng sau khi nhận thông tin sản phẩm
                                hd.totalBill += item.infoProductByOption.giaBan * item.soLuong; // Cộng giá trị cho từng item vào tổng đơn hàng
                            }).catch(function(err){
                                console.log("Lỗi khi lấy thông tin qua optionID: ", err);
                            })
                        } else {
                            console.log("Không tìm thấy option_id cho sản phẩm:", item);
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



    // update status
    $scope.UpdateOrderStatus = function (order) {
        // Duyệt qua từng mục trong listChiTietDHN và cập nhật trạng thá
        if($scope.selectedOrder.trangThaiDonHang === "Đã xử lý"){
            $scope.selectedOrder.trangThaiThanhToan = "Đã thanh toán";
            $scope.selectedOrder.trangThaiGiaoHang = "Chờ giao hàng"
        }
        if($scope.selectedOrder.trangThaiDonHang === "Hoàn thành"){
            $scope.selectedOrder.trangThaiGiaoHang === "Hoàn thành"
        }
        
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

    // xuất hóa đơn
    // $scope.ExportBill = function (order) {
    //     $scope.selectedOrder = order;
    //     $scope.selectedOrder.trangThaiXuatHoaDon = "Đã xuất";
    //     $scope.selectedOrder.ngayXuatHD = new Date();
    //     // Duyệt qua từng mục trong listChiTietDHN và cập nhật trạng thái
    //     $scope.selectedOrder.listChiTietDHB.forEach(function(item) {
    //         item.status = 2; // Gán trạng thái là 2
    //     });
    //     $http({
    //         method: "PUT",
    //         url: current_url + '/api/HoaDonBan/update',
    //         data: JSON.stringify(order),
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     }).then(function (response) {
    //         alert("Xuất hóa đơn thành công!");
    //         $scope.LoadHD();
    //     }).catch(function (error) {
    //         console.error("Lỗi khi xuất hóa đơn: ", error);
    //     });
    // };
    
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

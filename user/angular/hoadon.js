appuser.controller("OrderCtrl", function($scope,$http) {
    $scope.orderUser = [];
    $scope.infoProductByOption = {}
    $scope.groupedOrders = {};
    $scope.orderTabs = ["Tất cả", "Chờ xác nhận", "Chờ giao hàng", "Đang vận chuyển", "Hoàn thành", "Đã hủy"];
    $scope.selectedTab = "Tất cả";
    var nguoidung_id = localStorage.getItem("user_id");

    // Chọn tab
    $scope.selectTab = function (tab) {
        $scope.selectedTab = tab;
    };

    $scope.loadHoaDon = function () {
        $http.get(`${currentuser_url}/api/DonHang/GetOrderByUserID/${nguoidung_id}`)
            .then(function (response) {
                // Gán danh sách hóa đơn vào scope
                $scope.orderUser = response.data;
                console.log("Danh sách hóa đơn: ", $scope.orderUser);
                groupedOrders = {};
    
                 // Phân loại hóa đơn theo trạng thái
                 $scope.groupedOrders = {
                    "Tất cả": [],
                    "Chờ xác nhận": [],
                    "Chờ giao hàng": [],
                    "Đang vận chuyển": [],
                    "Hoàn thành": [],
                    "Đã hủy": []
                };

                $scope.orderUser.forEach(function (hd) {
                    // Thêm vào tab "Tất cả"
                    $scope.groupedOrders["Tất cả"].push(hd);

                    // Phân loại theo trạng thái
                    if (hd.trangThaiDonHang === "Chưa xử lý") {
                        $scope.groupedOrders["Chờ xác nhận"].push(hd);
                    } else if (hd.trangThaiDonHang === "Đã xử lý") {
                        $scope.groupedOrders["Chờ giao hàng"].push(hd);
                    } else if (hd.trangThaiGiaoHang === "Đang vận chuyển") {
                        $scope.groupedOrders["Đang vận chuyển"].push(hd);
                    } else if (hd.trangThaiDonHang === "Hoàn thành") {
                        $scope.groupedOrders["Hoàn thành"].push(hd);
                    } else if (hd.trangThaiDonHang === "Đã hủy") {
                        $scope.groupedOrders["Đã hủy"].push(hd);
                    }

                    // Lặp qua từng chi tiết hóa đơn
                    hd.listChiTietDHB.forEach(function (item) {
                        if (item.thuoctinh_id) {
                            console.log(item.thuoctinh_id)
                            // Gọi API lấy thông tin sản phẩm theo option_id
                            $http.get(`${currentuser_url}/api/KinhMat/GetThuocTinh/${item.thuoctinh_id}`)
                                .then(function (optionResponse) {
                                    console.log("Dữ liệu trả về từ API:", optionResponse.data);
                                    item.infoProductByOption = optionResponse.data;
                                    
                                    // Thêm chi tiết hóa đơn vào nhóm tương ứng
                                    groupedOrders[hd.donhangban_id].listChiTietDHB.push(item);
    
                                    // Chuyển groupedOrders thành mảng
                                    $scope.groupedOrders = Object.values(groupedOrders);
                                    console.log("Grouped Orders: ", $scope.groupedOrders);
                                })
                                .catch(function (err) {
                                    console.error("Lỗi khi lấy thông tin qua ID thuộc tính: ", err);
                                });
                        } else {
                            console.log("Không tìm thấy thuộc tính cho sản phẩm:", item);
                        }
                    });
                });
            })
            .catch(function (error) {
                console.error("Không thể tải danh sách hóa đơn:", error);
            });
    };
    
    $scope.loadHoaDon();

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
    
    $scope.selectedOrder = {}
    $scope.isOrderDetailOpen = false
    $scope.openMyOrderDetail = function(order){
        $scope.isOrderDetailOpen = true;
        $scope.selectedOrder = order
        console.log($scope.selectedOrder)
    }    
    $scope.closeMyOrderDetail = function(){
        $scope.isOrderDetailOpen = false
    }

    $scope.comfirmOrder = function(order){
        console.log("Confirm Order:", order); // Kiểm tra xem hàm được gọi chưa
        if (confirm("Xác nhận đơn hàng?")) {
            $scope.selectedOrder.trangThaiGiaoHang = "Hoàn thành";
            var dateHT = new Date()
            $scope.selectedOrder.ngayHoanThanhDH = dateHT.toISOString()
            $scope.selectedOrder.nguoidung_id = nguoidung_id;
            $scope.selectedOrder.listChiTietDHB.forEach(function(item) {
                item.status = 2; // Gán trạng thái là 2
            });
            $http({
                method: "PUT",
                url: currentuser_url + '/api/DonHang/update',
                data: JSON.stringify(order),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                alert("Xác nhận đơn hàng thành công!");
            }).catch(function (error) {
                console.error("Lỗi khi cập nhật trạng thái đơn hàng: ", error);
            });
        }
    };
    
    $scope.cancelOrder = function(order){
        console.log("Cancel Order:", order); // Kiểm tra xem hàm được gọi chưa
        if (confirm("Bạn có chắc chắn muốn hủy đơn hàng không?")) {
            $scope.selectedOrder.trangThaiDonHang = "Đã hủy";
            $scope.selectedOrder.nguoidung_id = nguoidung_id;
            $scope.selectedOrder.listChiTietDHB.forEach(function(item) {
                item.status = 3; // Gán trạng thái là 3
            });
            $http({
                method: "PUT",
                url: currentuser_url + '/api/DonHang/update',
                data: JSON.stringify(order),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                alert("Hủy đơn hàng thành công!");
            }).catch(function (error) {
                console.error("Lỗi khi hủy đơn hàng: ", error);
            });
        }
    };
    
})    
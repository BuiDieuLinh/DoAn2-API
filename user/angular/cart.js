appuser.controller('CartCtrl', function($scope,$http) {
    $scope.cartItems = [];
    $scope.infoUser = {};
    $scope.listChiTietDH = {}
    $scope.cartCount = 0; // Biến lưu số lượng sản phẩm trong giỏ
    var nguoidung_id = localStorage.getItem("user_id");
    // Lấy dữ liệu từ localStorage
    var savedCart = localStorage.getItem(`${nguoidung_id}_orderDetails`);
    console.log("giỏ hàng: ", savedCart)
    $scope.cartItems = savedCart ? JSON.parse(savedCart) : [];

     // Xóa sản phẩm khỏi giỏ hàng
     $scope.removeFromCart = function (index) {
        if(confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            $scope.cartItems.splice(index, 1); // Xóa phần tử khỏi mảng
            localStorage.setItem(`${nguoidung_id}_orderDetails`, JSON.stringify($scope.cartItems)); // Cập nhật localStorage
        }
    };
    
    $scope.GetUser = function (){
        $http({
            method: 'GET',
            url: `${currentuser_url}/api/User/GetData?id=${nguoidung_id}`,
            headers:{
                "Content-type" : "application/json"
            }
        }).then(function(response){
            $scope.infoUser = response.data
            console.log("Thông tin người dùng:" , $scope.infoUser)
        }).catch(function(err){
            console.log(err)
        })
    }
    $scope.GetUser()

    // tạo đối tượng mới

      // Đối tượng newProduct (dùng để thêm sản phẩm)
      $scope.newProduct = {
        donhangnhap_id:'',
        chitietdhn_id: '',
        kinhmat_id: '',
        soLuong: '',
        giaNhap: ''
      };

    $scope.UpdateInfoUser = function (callback) {
        // Tạo thông tin cập nhật
        const updateInfoUser = {
            nguoidung_id: localStorage.getItem("user_id"),
            tenNguoiDung: $scope.infoUser.tenNguoiDung,
            diaChi: $scope.infoUser.diaChi,
            soDienThoai: $scope.infoUser.soDienThoai,
            //image: $scope.infoUser.image
        };
        let formData = new FormData();
        formData.append("nguoidung_id", updateInfoUser.nguoidung_id);
        formData.append("tenNguoiDung", updateInfoUser.tenNguoiDung);
        formData.append("tenTaiKhoan", $scope.infoUser.tenTaiKhoan);
        formData.append("matKhau", $scope.infoUser.matKhau);
        formData.append("email", $scope.infoUser.email);
        formData.append("diaChi", updateInfoUser.diaChi);
        formData.append("soDienThoai", updateInfoUser.soDienThoai);
        formData.append("ngayDangKy", $scope.infoUser.ngayDangKy);
        //formData.append("image", updateInfoUser.image);

    
        // Gửi thông tin cập nhật tới API
        $http({
            method: "POST",
            url: currentuser_url + '/api/User/update',
            data: formData,
            headers: {
                "Content-Type": undefined
            }
        }).then(function (response) {
            alert("Cập nhật thông tin người dùng thành công!");
    
            // Lưu thông tin giao hàng vào localStorage
            var infoship = JSON.parse(localStorage.getItem(`${updateInfoUser.nguoidung_id}_infoshipping`)) || [];
            infoship.push(updateInfoUser);
            localStorage.setItem(`${updateInfoUser.nguoidung_id}_infoshipping`, JSON.stringify(infoship));
            
    
            // Gọi callback nếu tồn tại
            if (callback) callback();
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            alert("Không thể cập nhật thông tin người dùng!");
        });
    };
    
    $scope.generateOrderId = function () {
        return `HD${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    };
    
    $scope.paymentMethod = "cod"; // Giá trị mặc định là "Thanh toán khi nhận hàng"

    // Hàm xử lý khi thay đổi phương thức thanh toán
    $scope.updatePaymentStatus = function () {
        $scope.orderData.trangThaiThanhToan = $scope.paymentMethod === "cod" 
            ? "Chưa thanh toán" 
            : "Đã thanh toán";
    };

    $scope.createBill = function () {
        // Kiểm tra danh sách chi tiết đơn hàng
        var getLocal = localStorage.getItem("tempStorage");
        var orderDetails = getLocal ? JSON.parse(getLocal) : [];
        console.log(orderDetails)
        if (orderDetails.length === 0) {
            alert("Danh sách sản phẩm trong giỏ hàng trống. Không thể tạo đơn hàng!");
            return;
        }
        var ngayban = new Date();
        var orderID = $scope.generateOrderId();
        const orderData = {
            donhangban_id: orderID,
            nguoidung_id: localStorage.getItem("user_id"),
            ngayBan: ngayban.toISOString(),
            trangThaiDonHang: "Chưa xử lý",
            trangThaiThanhToan: $scope.paymentMethod === "cod" ? "Chưa thanh toán" : "Đã thanh toán",
            trangThaiGiaoHang: "Chờ xử lý",
            ngayHoanThanhDH: null,
            listChiTietDHB: orderDetails.map(item => ({
                donhangban_id: orderID,
                chitietdhb_id: "ass",
                thuoctinh_id: item.thuoctinh_id,
                soLuong: item.quantity
            }))
        };
    
        // Gọi hàm cập nhật thông tin người dùng trước khi tạo đơn hàng
        $scope.UpdateInfoUser(function () {
            // Tạo đơn hàng sau khi cập nhật thành công
            $http({
                method: 'POST',
                url: currentuser_url + '/api/DonHang/create',
                data: JSON.stringify(orderData),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function () {
                alert('Thêm đơn hàng thành công!');
    
                // Xóa các sản phẩm trong giỏ hàng
                var updatedOrderDetails = orderDetails.map(item => item.thuoctinh_id);
                var tempStorage = JSON.parse(localStorage.getItem(`${localStorage.getItem("user_id")}_orderDetails`)) || [];
    
                tempStorage = tempStorage.filter(item => !updatedOrderDetails.includes(item.thuoctinh_id));
                localStorage.setItem(`${localStorage.getItem("user_id")}_orderDetails`, JSON.stringify(tempStorage));
                window.location.reload()
            }).catch(function (error) {
                console.error('Lỗi khi tạo đơn hàng:', error);
                alert("Không thể tạo đơn hàng!");
            });
        });
    };
    
    $scope.createBillFromCheckout = function () {
        // Kiểm tra danh sách chi tiết đơn hàng
        var getLocal = localStorage.getItem(`${nguoidung_id}_checkout`);
        var orderDetails = getLocal ? JSON.parse(getLocal) : [];
        console.log(orderDetails)
        if (orderDetails.length === 0) {
            alert("Danh sách sản phẩm trong giỏ hàng trống. Không thể tạo đơn hàng!");
            return;
        }
    
        var orderID = $scope.generateOrderId();
        const orderData = {
            donhangban_id: orderID,
            nguoidung_id: localStorage.getItem("user_id"),
            ngayBan: new Date(),
            trangThaiDonHang: "Chưa xử lý",
            trangThaiThanhToan: "Chưa thanh toán",
            trangThaiGiaoHang: "Chờ xử lý",
            ngayHoanThanhDH: null,
            listChiTietDHB: orderDetails.map(item => ({
                donhangban_id: orderID,
                chitietdhb_id: "ass",
                thuoctinh_id: item.thuoctinh_id,
                soLuong: item.quanlity
            }))
        };
    
        // Gọi hàm cập nhật thông tin người dùng trước khi tạo đơn hàng
        $scope.UpdateInfoUser(function () {
            // Tạo đơn hàng sau khi cập nhật thành công
            $http({
                method: 'POST',
                url: currentuser_url + '/api/DonHang/create',
                data: JSON.stringify(orderData),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function () {
                alert('Thêm đơn hàng thành công!');
                // window.location.href = 'account.html'
            }).catch(function (error) {
                console.error('Lỗi khi tạo đơn hàng:', error);
                alert("Không thể tạo đơn hàng!");
            });
        });
    };
   
});

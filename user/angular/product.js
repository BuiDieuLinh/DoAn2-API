appuser.controller("ProductCtrl",function ($scope, $http){
    $scope.listProduct = [];
    $scope.listCate = [];
    $scope.itemEdit = {};
    $scope.isDetailProductPopup = false; // Ẩn popup khi khởi tạo
    preview = '';

    
    // Lấy danh sách danh mục từ API
    $scope.loadDanhMuc = function () {
        $http.get(currentuser_url + '/api/DanhMuc/GetData').then(function (response) {
            $scope.listCate = response.data; // Gán danh sách danh mục vào scope
            console.log(response.data)
        }).catch(function (error) {
            console.error("Không thể tải danh mục:", error);
        });
    };

    // Gọi hàm khi khởi tạo
    $scope.loadDanhMuc();

    
    //lấy dữ liệu 
    $scope.LoadProduct = function(){
        $http.get(currentuser_url + '/api/KinhMat/GetAll')
            .then(function (response) {
                
                console.log($scope.listProduct)
                $scope.listProduct = response.data.slice(0,4);
            }).catch(function(err){
                console.log("Lỗi khi lấy dữ liệu sản phẩm:", err)
            })
    };
    $scope.LoadProduct();

    // Lưu trữ giá trị được chọn
    $scope.selectedColor = null;
    $scope.selectedPrescription = null;
    // biến để lưu thông tin thuộc tính sau khi chọn màu sắc , độ cận
    $scope.selectedDetails = {};
    //biến lưu thông tin sản phẩm khi click chọn sang trang cate
    $scope.product ={}

    // Chọn màu sắc
    $scope.selectColor = function(color) {
        $scope.selectedColor = color;
        console.log($scope.selectedColor)
        $scope.updateDetails();
        console.log("sau chọn ", $scope.selectedDetails)
    };

    // Chọn độ cận
    $scope.selectPrescription = function(prescription) {
        $scope.selectedPrescription = prescription;
        $scope.updateDetails();
    };

    // Cập nhật thông tin chi tiết ở trang index
    $scope.updateDetails = function() {
        $scope.selectedDetails = $scope.itemEdit.listThuocTinh.find(function(item) {
            return item.mauSac === $scope.selectedColor &&
                   (item.doCan === $scope.selectedPrescription || (!item.doCan && $scope.selectedPrescription === '')) &&
                   item.thuoctinh_id === item.thuoctinh_id;
                   
        }) || {}; // Trả về rỗng nếu không tìm thấy
    };  
    
    // Cập nhật thông tin chi tiết ở trang category

    $scope.selectColorCate = function(color) {
        $scope.selectedColor = color;
        console.log($scope.selectedColor)
        $scope.updateDetailsCate();
        console.log("sau chọn ", $scope.selectedDetails)
    };

    // Chọn độ cận
    $scope.selectPrescriptionCate = function(prescription) {
        $scope.selectedPrescription = prescription;
        $scope.updateDetailsCate();
        
    };
    $scope.updateDetailsCate = function() {
        $scope.selectedDetails = $scope.product.listThuocTinh.find(function(item) {
            const isColorMatch = item.mauSac === $scope.selectedColor;
            const isPrescriptionMatch = 
                item.doCan === $scope.selectedPrescription || 
                (!item.doCan && ($scope.selectedPrescription === '' || $scope.selectedPrescription === null));
            return isColorMatch && isPrescriptionMatch;
        }) || {}; // Trả về rỗng nếu không tìm thấy

    };

    // Lấy user_id từ localStorage
    var userId = localStorage.getItem("user_id");
    var key = "orderDetails";
    var keycheckout = "checkout"
    // Lấy dữ liệu giỏ hàng từ localStorage khi người dùng đăng nhập
    $scope.getUserData = function (userId, key) {
        const prefixedKey = `${userId}_${key}`;
        const data = localStorage.getItem(prefixedKey);
        return data ? JSON.parse(data) : [];
    };

    // Lưu dữ liệu giỏ hàng vào localStorage với user_id
    $scope.setUserData = function (userId, key, cartItems) {
        const prefixedKey = `${userId}_${key}`;
        $scope.cartCount = cartItems.length;
        localStorage.setItem(prefixedKey, JSON.stringify(cartItems));
    };

    $scope.cartCount = []
    // Khởi tạo dữ liệu giỏ hàng từ localStorage
    $scope.cartItems = $scope.getUserData(userId, key);
    $scope.checkout = $scope.getUserData(userId, keycheckout);
    $scope.cartCount = $scope.cartItems.length;

    $scope.addToCheckout = function () {
        if (!$scope.selectedColor) {
            alert("Vui lòng chọn màu sắc.");
            return;
        }
        if(!localStorage.getItem("user_id")){
            alert("Bạn cần phải đăng nhập để thêm sản phẩm vào giỏ hàng!")
            return
        }

        var order = {
            id: $scope.product.kinhmat_id,
            thuoctinh_id: $scope.selectedDetails.thuoctinh_id,
            name: $scope.product.tenKinhMat,
            sale: $scope.selectedDetails.giaBan,
            price: $scope.selectedDetails.giaBan-($scope.selectedDetails.giaBan*$scope.selectedDetails.phanTramGiam/100),
            quanlity: 1,
            photo: $scope.selectedDetails.imageCon,
            color: $scope.selectedDetails.mauSac,
            prescription: $scope.selectedDetails.doCan || null,
            ship: 30000,
            date: new Date()
        }
        // Kiểm tra điều kiện giá trị đơn hàng
        
         // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
         var existingOrder = $scope.checkout.find(item => 
            item.id === order.id && 
            item.thuoctinh_id === order.thuoctinh_id);

        if (existingOrder) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            existingOrder.quanlity += 1;
        } else {
            // Nếu chưa, thêm mới sản phẩm
            $scope.checkout.push(order);
        }

        // Lưu lại giỏ hàng vào Local Storage
        $scope.setUserData(userId, keycheckout, $scope.checkout);
        alert("check out")
        window.location.href = 'checkout.html'
    };


    
    $scope.addToCart = function () {
        if (!$scope.selectedColor) {
            alert("Vui lòng chọn màu sắc.");
            return;
        }
        if(!localStorage.getItem("user_id")){
            alert("Bạn cần phải đăng nhập để thêm sản phẩm vào giỏ hàng!")
            return
        }

        var order = {
            id: $scope.itemEdit.kinhmat_id,
            thuoctinh_id: $scope.selectedDetails.thuoctinh_id,
            name: $scope.itemEdit.tenKinhMat,
            price: $scope.selectedDetails.giaBan-($scope.selectedDetails.giaBan*$scope.selectedDetails.phanTramGiam/100),
            quanlity: 1,
            photo: $scope.selectedDetails.imageCon,
            color: $scope.selectedDetails.mauSac,
            prescription: $scope.selectedDetails.doCan || null
        }

         // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
         var existingOrder = $scope.cartItems.find(item => 
            item.id === order.id && 
            item.thuoctinh_id === order.thuoctinh_id);

        if (existingOrder) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            existingOrder.quanlity += 1;
        } else {
            // Nếu chưa, thêm mới sản phẩm
            $scope.cartItems.push(order);
        }

        // Lưu lại giỏ hàng vào Local Storage
        $scope.setUserData(userId, key, $scope.cartItems);

        // Cập nhật số lượng hiển thị giỏ hàng
        $scope.cartCount = $scope.cartItems.length;

        alert("Sản phẩm đã được thêm vào giỏ hàng!");

    };

    $scope.addToCartFromDetail = function () {
        if (!$scope.selectedColor) {
            alert("Vui lòng chọn màu sắc.");
            return;
        }
        if(!localStorage.getItem("user_id")){
            alert("Bạn cần phải đăng nhập để thêm sản phẩm vào giỏ hàng!")
            return
        }
        var order = {
            id: $scope.product.kinhmat_id,
            thuoctinh_id: $scope.selectedDetails.thuoctinh_id,
            name: $scope.product.tenKinhMat,
            price:$scope.selectedDetails.giaBan-($scope.selectedDetails.giaBan*$scope.selectedDetails.phanTramGiam/100),
            quanlity: 1,
            photo: $scope.selectedDetails.imageCon,
            color: $scope.selectedDetails.mauSac,
            prescription: $scope.selectedDetails.doCan || null
        }

         // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
         var existingOrder = $scope.cartItems.find(item => 
            item.id === order.id && 
            item.thuoctinh_id === order.thuoctinh_id);

        if (existingOrder) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            existingOrder.quanlity += 1;
        } else {
            // Nếu chưa, thêm mới sản phẩm
            $scope.cartItems.push(order);
        }

        // Lưu lại giỏ hàng vào Local Storage
        $scope.setUserData(userId, key, $scope.cartItems);

        // Cập nhật số lượng hiển thị giỏ hàng
        $scope.cartCount = $scope.cartItems.length;

        alert("Sản phẩm đã được thêm vào giỏ hàng!");
    };
    $scope.uniqueColors = [];
    $scope.uniquePrescriptions = [];
    $scope.openPopupDetailProduct = function(product) {
        $scope.uniqueColors = [];
        $scope.uniquePrescriptions = [];
        $scope.isDetailProductPopup = true;
        $scope.itemEdit = angular.copy(product); // Sao chép sản phẩm được chọn
        // Đặt giá trị mặc định cho màu sắc và độ cận
        $scope.selectedColor = ""; 
        $scope.selectedPrescription = "";
        
        // Duyệt qua các thuộc tính của sản phẩm
        product.listThuocTinh.forEach(element => {
            if (element.mauSac) {
                $scope.uniqueColors.push(element.mauSac);
            }
            if (element.doCan) {
                $scope.uniquePrescriptions.push(element.doCan);
            }
        });

        // Lọc các phần tử trùng lặp
        $scope.uniqueColors = $scope.uniqueColors.filter((value, index, self) => self.indexOf(value) === index);
        $scope.uniquePrescriptions = $scope.uniquePrescriptions.filter((value, index, self) => self.indexOf(value) === index);

        // Cập nhật chi tiết ban đầu
        $scope.updateDetails();
    };
    
    $scope.closePopupDetailProduct = function() {
        $scope.isDetailProductPopup = false;
    };
    
    $scope.viewDetail = function (productId) {
        if (!productId) {
            alert("Sản phẩm không hợp lệ!");
            return;
        }
        // Chuyển hướng kèm theo productId
        window.location.href = 'product.html?productId=' + productId;
    };
    

    // Lấy productId từ URL
    var params = new URLSearchParams(window.location.search);
    var productId = params.get('productId');

    if (!productId) {
        // alert("Không tìm thấy productId!");
        return;
    }
    

    // Gọi API lấy dữ liệu sp by id trang chi tiết
    $http.get(`${currentuser_url}/api/KinhMat/Get-by_id/${productId}`)
        .then(function (response) {
            $scope.product = response.data;
            console.log($scope.product)
            // Gọi API lấy danh sách người dùng
            $http({
                method: 'GET',
                url: currentuser_url + '/api/DanhMuc/GetData'
            }).then(function (danhmuaresponse) {
                var dm = danhmuaresponse.data;
                var pro = dm.find(u => u.danhmuc_id === $scope.product.danhmuc_id);
                $scope.product.tenDanhMuc = pro ? pro.tenDanhMuc : 'Không xác định';
                $scope.total = 0;
                // Duyệt qua các thuộc tính của sản phẩm
                $scope.product.listThuocTinh.forEach(element => {
                    if (element.mauSac) {
                        $scope.uniqueColors.push(element.mauSac);
                    }
                    if (element.doCan) {
                        $scope.uniquePrescriptions.push(element.doCan);
                    }
                    if(element.soLuong){
                        $scope.total += element.soLuong;
                    }
                });

                // Lọc các phần tử trùng lặp
                $scope.uniqueColors = $scope.uniqueColors.filter((value, index, self) => self.indexOf(value) === index);
                $scope.uniquePrescriptions = $scope.uniquePrescriptions.filter((value, index, self) => self.indexOf(value) === index);
            });
        })
        .catch(function () {
            alert("Không tìm thấy sản phẩm!");
        });
})
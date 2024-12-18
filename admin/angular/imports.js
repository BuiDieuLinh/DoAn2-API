app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller("ImportsCtrl", function ($scope, $http) {
    $scope.listImports = [];    
    $scope.activeTab = 'list';
    $scope.showDetailImport = false;
    $scope.selectedOrder = {};
  
    // Switch Tab
    $scope.switchTab = function(tab) {
      $scope.activeTab = tab;
    };
  
    // View Order Detail
    $scope.xemChiTiet = function(sp) {
      $scope.selectedOrder = sp;
      $scope.showDetailImport = true;
    };
  
    // Close Popup
    $scope.closeDetailImportPopup = function() {
      $scope.showDetailImport = false;
    };

    $scope.LoadImports = function(){
      $http({
        method: 'GET',
        url: current_url + '/api/HoaDonNhap/Get-All-HoaDonNhap'
      }).then(function(response) {
        console.log(response.data)
        $scope.listImports = response.data; 
        // Gọi API lấy danh sách người dùng
        $http({
          method: 'GET',
          url: current_url + '/api/NhaCC/Get-All'
        }).then(function (suppResponse) {
          var suppList = suppResponse.data.map(supp => {   
              // Loại bỏ khoảng trắng trong mã nhà cung cấp
              supp.nhaCC_id = supp.nhaCC_id.trim();
              return supp;
          });
          $scope.listSup = suppResponse.data
          // Nếu API trả về danh sách người dùng
          $scope.listImports.forEach(function (nhap) {
              var supp = suppList.find(u => u.nhaCC_id === nhap.nhaCC_id.trim());           
              nhap.tenNhaCC = supp ? supp.tenNhaCC : 'Không xác định';
          });
          
      }).catch(function (error) {
          console.error("Lỗi khi gọi API Users:", error);
      });
      })
    }
    $scope.LoadImports();

    // Tính tổng số lượng cho từng đơn hàng
    $scope.getTotalQuantity = function(listChiTietDHN) {
        let totalQuantity = 0;
        // Nếu danh sách chi tiết đơn hàng có dữ liệu, tính tổng số lượng
        if (listChiTietDHN && listChiTietDHN.length > 0) {
            angular.forEach(listChiTietDHN, function(product) {
                totalQuantity += product.soLuong; // Cộng số lượng của mỗi sản phẩm vào tổng
            });
        }
        return totalQuantity;
    };
    // tính tổng giá trị đơn hàng nhập
    $scope.getTotalPrice = function(listChiTietDHN){
      let totalPrice = 0;
      if(listChiTietDHN && listChiTietDHN.length > 0){
        angular.forEach(listChiTietDHN, function(product){
          totalPrice += product.giaNhap * product.soLuong;
        })
      }
      return totalPrice;
    }
    
    // tạo đối tượng mới
    $scope.newOrder = {
      donhangnhap_id: '',
      nhaCC_id: '',
      ngayNhap: '',
      listChiTietDHN: []
    };
    // Đối tượng newProduct (dùng để thêm sản phẩm)
    $scope.newProduct = {
      donhangnhap_id:'',
      chitietdhn_id: 'aaa',
      kinhmat_id: '',
      thuoctinh_id: '',
      tenKinhMat: '',
      mauSac: '',
      doCan: '',
      soLuong: '',
      giaNhap: ''
    };

    $scope.getProductDetails = function () {
      if ($scope.newProduct.kinhmat_id) {
          // Gọi API để lấy thông tin sản phẩm
          $http.get(current_url + '/api/KinhMat/Get-All-KinhMat')
              .then(function (response) {
                  const productList = response.data;
                  // Tìm sản phẩm có mã khớp với kinhmat_id
                  const product = productList.find(item => item.kinhmat_id === $scope.newProduct.kinhmat_id);
  
                  if (product) {
                      // Nếu tìm thấy sản phẩm, cập nhật thông tin
                      $scope.newProduct.tenKinhMat = product.tenKinhMat;
                  } else {
                      $scope.newProduct.tenKinhMat = '';
                  }
              })
              .catch(function (error) {
                  $scope.newProduct.tenKinhMat = '';
              });
      }
  };
  
    // Thêm sản phẩm mới vào danh sách
    $scope.addProduct = function () {
      if (!$scope.newProduct || !$scope.newProduct.kinhmat_id || !$scope.newProduct.soLuong || !$scope.newProduct.giaNhap) {
        alert('Vui lòng nhập đầy đủ thông tin sản phẩm trước khi thêm!');
        return;
      }
      // Tạo đối tượng sản phẩm mới từ newProduct
      const newProduct = {
          kinhmat_id: $scope.newProduct.kinhmat_id,
          thuoctinh_id: 'aaa',
          tenKinhMat: $scope.newProduct.tenKinhMat,
          mauSac: $scope.newProduct.mauSac,
          doCan: $scope.newProduct.doCan,
          soLuong: $scope.newProduct.soLuong,
          giaNhap: $scope.newProduct.giaNhap
      };
      // Đẩy sản phẩm vào danh sách sản phẩm trong đơn hàng
      $scope.newOrder.listChiTietDHN.push(newProduct);
    };

    // Xóa sản phẩm khỏi danh sách
    $scope.removeProduct = function (index) {
      $scope.newOrder.listChiTietDHN.splice(index, 1);
    };

    // add import
    $scope.AddImport = function(){
      const orderId = $scope.newOrder.donhangnhap_id;
      
      if (!orderId) {
          alert('Vui lòng nhập mã đơn hàng nhập!');
          return;
      }
      console.log("Thêm đơn hàng")
      console.log($scope.newOrder);
      const orderData = {
        donhangnhap_id: $scope.newOrder.donhangnhap_id,
        nhaCC_id: $scope.newOrder.nhaCC_id,
        ngayNhap: $scope.newOrder.ngayNhap.toISOString(), // Chuyển ngày thành chuỗi ISO
        listChiTietDHN: $scope.newOrder.listChiTietDHN.map(item => ({
            donhangnhap_id: $scope.newOrder.donhangnhap_id,
            chitietdhn_id: "1",
            kinhmat_id: item.kinhmat_id,
            thuoctinh_id: item.thuoctinh_id,
            tenKinhMat: item.tenKinhMat,
            mauSac: item.mauSac,
            doCan: item.doCan,
            soLuong: item.soLuong,
            giaNhap: item.giaNhap
        }))
      };
      
      // Đơn hàng chưa tồn tại -> Thêm mới
      $http({
        method: 'POST',
        url: current_url + '/api/HoaDonNhap/create',
        data: JSON.stringify(orderData),
        headers:{
          "Content-type": "application/json"
        }
      }).then(function () {
              alert('Thêm đơn hàng nhập thành công!');
              $scope.newOrder = { donhangnhap_id: '', nhaCC_id: '', ngayNhap: '', listChiTietDHN: [] };
          })
          .catch(function (error) {
              console.error('Lỗi khi thêm đơn hàng nhập:', error);
          });
  }

  // Update trạng thái -- xuất hóa đơn 
  $scope.UpdateStatus = function(sp){
    $scope.selectedOrder = sp;
    // Duyệt qua từng mục trong listChiTietDHN và cập nhật trạng thái
    $scope.selectedOrder.listChiTietDHN.forEach(function(item) {
      item.status = 2; // Gán trạng thái là 2
  });
    console.log($scope.selectedOrder)
    $http({
      method: "PUT",
      url: current_url + '/api/HoaDonNhap/update',
      data: JSON.stringify($scope.selectedOrder),
      headers:{
        "Content-type": "application/json"
      }
    }).then(function(response){
        alert('Update thành công đơn hàng!')
        $scope.LoadImports();
        $scope.closeDetailImportPopup()
    }).catch(function(error){
      console.error('Lỗi khi update đơn hàng: ', error)
    })
  }

  // $scope.ExportBill = function(sp){
  //   $scope.selectedOrder = sp;
  //   $scope.selectedOrder.trangThaiXuatHoaDon = "Đã Xuất";
  //   $scope.selectedOrder.ngayXuatHDNhap = new Date();
  //   // Duyệt qua từng mục trong listChiTietDHN và cập nhật trạng thái
  //   $scope.selectedOrder.listChiTietDHN.forEach(function(item) {
  //     item.status = 2; // Gán trạng thái là 2
  // });
  //   console.log($scope.selectedOrder)
  //   $http({
  //     method: "PUT",
  //     url: current_url + '/api/HoaDonNhap/update',
  //     data: JSON.stringify($scope.selectedOrder),
  //     headers:{
  //       "Content-type": "application/json"
  //     }
  //   }).then(function(response){
  //       alert('Xuất bill đơn hàng thành công!')
  //       $scope.LoadImports();
  //       $scope.closeDetailImportPopup()
  //   }).catch(function(error){
  //     console.error('Lỗi khi xuất bill đơn hàng: ', error)
  //   })
  // }
      
});

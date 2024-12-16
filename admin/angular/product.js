app.controller("ProductCtrl",function ($scope, $http){
    $scope.listProduct = [];
    $scope.listCate = [];
    $scope.itemEdit = {};
    $scope.isEditProductPopupVisible = false; // Ẩn popup khi khởi tạo
    $scope.listDetailProduct = []
    // Chọn file ảnh
    $scope.onFileSelected = function (event) {
    const file = event.target.files[0];
    if (file) {
        $scope.file = file;
        const reader = new FileReader();
        reader.onload = function (e) {
            $scope.$apply(() => {
                $scope.imageUrl = e.target.result;
            });
        };
        reader.readAsDataURL(file);
    }
    };
    $scope.onSubImageSelectedEdit = function (event, item) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(() => {
                    // Gán hình ảnh mới vào thuộc tính riêng của item
                    item.imageConNew = e.target.result;
                });
            };
            reader.readAsDataURL(file);
            console.log(item.imageConNew)
            // Nếu cần, lưu file để xử lý sau (upload lên server chẳng hạn)
            item.fileSubEdit = file;
        }
    };
    

    $scope.onSubImageSelected = function (event) {
        const file = event.target.files[0];
        if (file) {
            $scope.fileSub = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(() => {
                    $scope.newAttribute.imageCon= e.target.result;
                });
            };
            reader.readAsDataURL(file);
        }
        };
        // $scope.onSubImageSelected = function (event, indexOrNew) {
        //     const file = event.target.files[0];
        //     if (file) {
        //         $scope.fileSub = file;
        //         const reader = new FileReader();
        //         reader.onload = function(e){
        //             $scope.$apply(() =>{
        //                 if(indexOrNew === 'new'){
        //                     $scope.newAttribute.imageCon= e.target.result;
        //                 }
        //                  else {
        //                     // Nếu là thuộc tính cũ
        //                     $scope.itemEdit.listThuocTinh[indexOrNew].imageCon = e.target.result;
        //                 }
        //             })
        //         }
        //         reader.readAsDataURL(file)
        //     }
        // };
        
    // Lấy danh sách danh mục từ API
    $scope.loadDanhMuc = function () {
        $http.get(current_url + '/api/DanhMuc/Get-All-DanhMuc').then(function (response) {
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
        $http.get(current_url + '/api/KinhMat/Get-All-KinhMat')
            .then(function (response) {
                console.log(response.data);
                $scope.listProduct = response.data;
            });
    };
    $scope.LoadProduct();

    // lấy dữ liệu chi tiết
    $scope.LoadDetail = function(){
        $http.get(`${current_url}/api/KinhMat/GetAllThuocTinh`)
            .then(function(response){
                console.log("danh sách thuộc tính: ", response.data);
                $scope.listDetailProduct = response.data
            })
    };
    $scope.LoadDetail()

    $scope.calculateTotalQuantity = function () {
        $scope.listProduct.forEach(product => {
            // Tính tổng số lượng trong listThuocTinh
            product.totalQuantity = product.listThuocTinh.reduce((total, attribute) => {
                return total + attribute.soLuong;
            }, 0);
        });
    };   
    // Gọi hàm để tính toán
    $scope.calculateTotalQuantity(); 
    
    
        // tìm kiếm
    $scope.filterProduct = function (item) {
        if (!$scope.searchProduct) {
            return true;
        }
    
        const keyword = $scope.searchProduct.toLowerCase();
        const giaBanString = (item.giaBan !== undefined && item.giaBan !== null) ? item.giaBan.toString().toLowerCase() : "";
    
        return (
            (item.danhmuc_id && item.danhmuc_id.toString().toLowerCase().includes(keyword)) ||
            (item.kinhmat_id && item.kinhmat_id.toString().toLowerCase().includes(keyword)) ||
            (item.tenKinhMat && item.tenKinhMat.toLowerCase().includes(keyword)) ||
            giaBanString.includes(keyword) ||
            (item.chatLieu && item.chatLieu.toLowerCase().includes(keyword)) ||
            (item.thuongHieu && item.thuongHieu.toLowerCase().includes(keyword)) ||
            (item.colors && item.colors.toLowerCase().includes(keyword)) ||
            (item.prescriptions && item.prescriptions.toLowerCase().includes(keyword))
        );
    };        
   
    $scope.openEditProductPopup = function(item) {
        if (item) {
            $scope.itemEdit = angular.copy(item); // Sao chép sản phẩm được chọn
        } else {
            $scope.itemEdit = {}; // Tạo mới sản phẩm
        }
        $scope.isEditProductPopupVisible = true;
        console.log($scope.itemEdit)
    };

    $scope.closeEditProductPopup = function() {
        $scope.isEditProductPopupVisible = false; // Ẩn popup
    };


    // Hàm AttributePro sửa lại
    function AttributePro(attribute) {
        const data = new FormData();
        data.append("thuoctinh_id", attribute.thuoctinh_id);  // Kiểm tra thuoctinh_id, nếu trống thì tự động gán "a"
        data.append("kinhmat_id", $scope.itemEdit.kinhmat_id); // Lấy kinhmat_id từ itemEdit
        data.append("giaBan", attribute.giaBan);
        data.append("mauSac", attribute.mauSac);
        data.append("doCan", attribute.doCan);
        data.append("soLuong", attribute.soLuong);
        // Truyền tệp ảnh nếu tồn tại
        if ($scope.fileSub) {
            data.append("imagePath", $scope.fileSub);  // Truyền đối tượng File
        }

        // Truyền URL ảnh (imageCon) nếu có
        if (attribute.imageCon) {
            data.append("imageCon", attribute.imageCon);  // Đường dẫn URL ảnh
        }
        return data;
    }

    // kiểm tra mã sp đã tồn tại chưa
    $scope.checkIdExists = function(inputId) {
        return $scope.listProduct.find(product => product.kinhmat_id === inputId) !== undefined;
    };
    
    $scope.checkIdExistsAttri = function(kinhmatid, mausac, docan) {
        // Tìm sản phẩm theo kinhmat_id
        let product = $scope.listProduct.find(product => product.kinhmat_id === kinhmatid);
        if (product) {
            // Kiểm tra xem thuộc tính với giá trị mausac và docan đã tồn tại trong listThuocTinh của sản phẩm chưa
            let existingAttri = product.listThuocTinh.find(item => 
                item.mauSac.trim().toLowerCase() === mausac.trim().toLowerCase() && 
                item.doCan.trim().toLowerCase() === docan.trim().toLowerCase()
            );
            if (existingAttri) {
                // Nếu đã tồn tại thuộc tính, trả về thuoctinh_id của thuộc tính đó
                return existingAttri.thuoctinh_id;
            }
        }
        
        // Nếu không tìm thấy thuộc tính, trả về null
        return null;
    };
    
    // 1. Hàm submitEditForm để thêm sản phẩm và thuộc tính
    $scope.submitEditForm = function () {    
        if ($scope.checkIdExists($scope.itemEdit.kinhmat_id)) {
            // Nếu sản phẩm đã tồn tại, kiểm tra thuộc tính và sửa
            const formData = new FormData();
            formData.append("kinhmat_id", $scope.itemEdit.kinhmat_id);
            formData.append("tenKinhMat", $scope.itemEdit.tenKinhMat); // Loại bỏ khoảng trắng thừa trong mật khẩu
            formData.append("chatLieu", $scope.itemEdit.chatLieu);
            formData.append("thuongHieu", $scope.itemEdit.thuongHieu);
            formData.append("danhmuc_id", $scope.itemEdit.danhmuc_id);
            formData.append("moTa", $scope.itemEdit.moTa);
    
            if ($scope.file) {
                formData.append("imagePath", $scope.file);
                $scope.itemEdit.image = `http://localhost:52890/imageProduct/${$scope.file.name}`; // Cập nhật đường dẫn ảnh
                formData.append("image", $scope.itemEdit.image);
            }
            formData.append("listThuocTinh", null)
            $http({
                method: 'PUT',
                url: current_url + '/api/KinhMat/update-KinhMat',
                data: formData,
                headers: { 'Content-Type': undefined } // Để AngularJS tự động thiết lập Content-Type cho FormData
            }).then(function (response) {
                // Sửa thuộc tính cho sản phẩm
                $scope.updateAttr($scope.itemEdit.kinhmat_id);
                // $scope.listProduct = response.data;
                $scope.LoadProduct()
                $scope.listProduct = response.data;
                alert("Cập nhật sản phẩm thành công!")
            })
            .catch(function (error) {
                console.error('Lỗi khi cập nhật sản phẩm:', error);
            });
        } 
        else {
            // Nếu sản phẩm chưa có, thêm mới sản phẩm và thuộc tính
            const formData = new FormData();
            formData.append("kinhmat_id", $scope.itemEdit.kinhmat_id);
            formData.append("tenKinhMat", $scope.itemEdit.tenKinhMat); // Loại bỏ khoảng trắng thừa trong mật khẩu
            formData.append("chatLieu", $scope.itemEdit.chatLieu);
            formData.append("thuongHieu", $scope.itemEdit.thuongHieu);
            formData.append("danhmuc_id", $scope.itemEdit.danhmuc_id);
            formData.append("moTa", $scope.itemEdit.moTa);
    
            if ($scope.file) {
                formData.append("imagePath", $scope.file);
                $scope.itemEdit.image = `/imageProduct/${$scope.file.name}`; // Cập nhật đường dẫn ảnh
                formData.append("image", $scope.itemEdit.image);
            }
            formData.append("listThuocTinh", null)

            $http({
                method: 'POST',
                url: current_url + '/api/KinhMat/create-KinhMat',
                data: formData,
                headers: { 'Content-Type': undefined } // Để AngularJS tự động thiết lập Content-Type cho FormData
            }).then(function () {
                // Sau khi thêm sản phẩm mới, thêm thuộc tính nếu có
                if ($scope.itemEdit.listThuocTinh && $scope.itemEdit.listThuocTinh.length > 0) {
                    $scope.submitAttributes($scope.itemEdit.kinhmat_id);
                }
                alert("Thêm sản phẩm thành công!");
                $scope.listProduct = response.data;
                $scope.LoadProduct()
            })
            .catch(function (error) {
                console.error('Lỗi khi thêm sản phẩm mới:', error);
            });
        }
    };
    
// 2. Hàm submitAttributes để xử lý thuộc tính
$scope.submitAttributes = function (kinhmat_id) {
    for (let i = 0; i < $scope.itemEdit.listThuocTinh.length; i++) {
        let attribute = $scope.itemEdit.listThuocTinh[i];
        console.log("dl trc khi thêm, sủa: ",attribute)

            // Nếu thuộc tính chưa tồn tại, thêm mới
            const formDataAdd = AttributePro(attribute);
            $http({
                method: 'POST',
                url: current_url + '/api/KinhMat/create-ThuocTinh',
                data: formDataAdd,
                headers: { 'Content-Type': undefined }
            }).then(function () {
                alert('Thêm thuộc tính mới thành công!');
            }).catch(function (error) {
                console.error('Lỗi khi thêm thuộc tính mới:', error);
            });
        
    }
};

$scope.updateAttr= function(thuoctinh_id){
    for (let i = 0; i < $scope.itemEdit.listThuocTinh.length; i++) {
        let attribute = $scope.itemEdit.listThuocTinh[i];
        console.log("dl trc khi thêm, sủa: ",attribute)
        // Kiểm tra nếu thuộc tính đã tồn tại (kiểm tra màu sắc và độ cận)
        console.log(thuoctinh_id)
        if (thuoctinh_id === attribute.thuoctinh_id) {
            // Nếu thuộc tính đã tồn tại, chỉ cập nhật
            const formDataUpdate = AttributePro(attribute);
            // Truyền tệp ảnh nếu tồn tại
            if ($scope.fileSubEdit) {
                formDataUpdate.append("imagePath", $scope.fileSubEdit);  // Truyền đối tượng File
            }

            // Truyền URL ảnh (imageCon) nếu có
            if (attribute.imageCon) {
                formDataUpdate.append("imageCon", attribute.imageCon);  // Đường dẫn URL ảnh
            }
            console.log(formDataUpdate)
            $http({
                method: 'PUT',
                url: current_url + '/api/KinhMat/update-ThuocTinh',
                data: formDataUpdate,
                headers: { 'Content-Type': undefined }
            }).then(function () {
                alert('Cập nhật thuộc tính thành công!');
                $scope.LoadProduct()
            }).catch(function (error) {
                console.error('Lỗi khi cập nhật thuộc tính:', error);
            });
        }
    }
}
$scope.newAttribute = {}

// 3. Thêm thuộc tính vào mảng khi nhấn "Thêm dòng mới"
$scope.addRow = function () {
    if(!$scope.itemEdit.listThuocTinh){
        $scope.itemEdit.listThuocTinh = [];
    }

    if ($scope.itemEdit.kinhmat_id && 
        $scope.newAttribute.mauSac && 
        $scope.newAttribute.giaBan && 
        $scope.newAttribute.soLuong && 
        $scope.newAttribute.imageCon) 
    {
        // Nếu độ cận là null hoặc trống, cho phép thêm vào mà không kiểm tra
        if ($scope.newAttribute.doCan === undefined || $scope.newAttribute.doCan === null) {
            $scope.newAttribute.doCan = ''; // Gán null nếu không nhập độ cận
        }
        $scope.newAttribute.thuoctinh_id = "a"; // Nếu không có thuoctinh_id, tự động tạo UUID
        $scope.newAttribute.imagePath = $scope.fileSub;
        $scope.newAttribute.imageCon = `http://localhost:52890/imageProduct/${$scope.fileSub.name}`;
        $scope.newAttribute.kinhmat_id = $scope.itemEdit.kinhmat_id;
        console.log("Dữ liệu thuộc tính:", $scope.newAttribute); // In ra để kiểm tra
        $scope.itemEdit.listThuocTinh.push(angular.copy($scope.newAttribute)); // Thêm thuộc tính vào danh sách
        $scope.newAttribute = {}; // Reset dòng nhập liệu
    } else {
        console.log("Thông tin không đầy đủ hoặc thiếu hình ảnh!");
    }
};


// 4. Hàm kiểm tra xem thuộc tính đã tồn tại chưa
$scope.checkIdExistsAttri = function(mauSac, doCan) {
    return $scope.itemEdit.listThuocTinh.some(function(attribute) {
        return attribute.mauSac === mauSac && attribute.doCan === doCan;
    });
};


    // Xóa sản phẩm
    $scope.XoaProduct = function (kinhmat_id) {
        if (!kinhmat_id) {
            console.error("kinhmat_id không hợp lệ");
            return;
        }
        
        // Hỏi người dùng có chắc chắn muốn xóa không
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            console.log(kinhmat_id)
            $http({
                method: 'DELETE',
                url: `${current_url}/api/KinhMat/delete-KinhMat?id=${kinhmat_id}`, // Đảm bảo URL đúng
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function() {
                alert("Xóa dữ liệu thành công");
                $scope.listProduct = $scope.listProduct.filter(item => item.kinhmat_id !== kinhmat_id);
            }).catch(function(error) {
                console.error("Lỗi khi xóa dữ liệu:", error);
            });
        }
    };

    $scope.removeAttribute = function (thuoctinh_id) {
        if(!thuoctinh_id){
            alert("Không tìm thấy id thuộc tính!")
            return
        }
        // Xác nhận trước khi xóa (nếu cần)
        if (confirm("Bạn có chắc chắn muốn xóa thuộc tính này không?")) {
            $http({
                method: 'DELETE',
                url: `${current_url}/api/KinhMat/delete-ThuocTinh?id=${thuoctinh_id}`, // Đảm bảo URL đúng
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function() {
                alert("Xóa thuộc tính thành công");
                // Xóa phần tử khỏi mảng dựa trên chỉ số index
                $scope.itemEdit.listThuocTinh = $scope.itemEdit.listThuocTinh.filter(function (item) {
                    return item.thuoctinh_id !== thuoctinh_id;
                });
                $scope.LoadProduct()
            }).catch(function(error) {
                console.error("Lỗi khi xóa dữ liệu:", error);
            });
        }
    };    

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
    
});


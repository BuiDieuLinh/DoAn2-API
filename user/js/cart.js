document.addEventListener("DOMContentLoaded",function(){
    const hoten = localStorage.getItem("hoten")
    const userLoginElement = document.getElementById("userLogin");
    if(hoten){
        //hieent hị tên của user đg đăng nhập
        userLoginElement.innerHTML = `Chào, ${hoten}`;
         // Ẩn các mục "Đăng nhập" và "Đăng ký"
         document.getElementById("login").style.display = "none";
         document.getElementById("register").style.display = "none";
 
         // Hiển thị các mục "Tài khoản của tôi" và "Đơn hàng của tôi"
         document.getElementById("account").style.display = "block";
         document.getElementById("orders").style.display = "block";
         document.getElementById("logout").style.display = "block";
         localStorage.removeItem("tempStorage")
    }else{
      window.location.href = "../login/login.html"
    }
})
  
function Exit(){
    localStorage.removeItem("user_id");
    localStorage.removeItem("hoten");
    localStorage.removeItem("token");
    localStorage.removeItem("role")
    window.location.href = '../login/login.html'
}

window.addEventListener('beforeunload', function () {
    localStorage.removeItem(localStorage.getItem("tempStorage"));
});

let temporaryStorage = JSON.parse(localStorage.getItem("tempStorage")) || []; // Lấy dữ liệu từ localStorage nếu có

// Cập nhật tổng tiền và số lượng sản phẩm
function updateTotal() {
    let totalQuantity = 0;
    let totalPrice = 0;
    const shippingFee = 30000; // Phí giao hàng mặc định

    // Tính tổng số lượng và tổng giá
    temporaryStorage.forEach(product => {
        totalQuantity += product.quantity;
        totalPrice += product.totalPrice;
    });

    // Miễn phí giao hàng nếu tổng giá trị đơn hàng > 400,000đ
    const effectiveShippingFee = totalPrice > 400000 ? 0 : shippingFee;

    // Cập nhật tổng số lượng và tổng tiền
    document.getElementById('total-quantity').textContent = totalQuantity;
    document.getElementById('total-price').textContent = (totalPrice + effectiveShippingFee).toLocaleString('vi-VN') + 'đ';
    document.getElementById('shipping-fee').textContent = effectiveShippingFee.toLocaleString('vi-VN') + 'đ';
    document.getElementById('cart-total').textContent = totalPrice.toLocaleString('vi-VN') + 'đ';
    document.getElementById('total-summary').textContent = totalPrice.toLocaleString('vi-VN') + 'đ';
}

// Cập nhật thông tin đơn hàng trong bảng checkout
function updateOrderList() {
    const orderItemsTable = document.getElementById('order-items');
    orderItemsTable.innerHTML = ''; // Làm sạch bảng trước khi cập nhật lại

    temporaryStorage.forEach(product => {
        const row = orderItemsTable.insertRow();
        const nameCell = row.insertCell(0);
        const quantityCell = row.insertCell(1);
        const totalCell = row.insertCell(2);

        nameCell.textContent = product.name;
        quantityCell.textContent = product.quantity;
        totalCell.textContent = product.totalPrice.toLocaleString('vi-VN') + 'đ';
    });

    updateTotal();
}

// Cập nhật số lượng sản phẩm
function updateQuantity(input) {
    const row = input.closest('tr');
    const productName = row.querySelector('.product-name').textContent;
    const quantity = parseInt(input.value);
    const unitPrice = parseInt(row.querySelector('.unit-price').textContent);
    const totalPrice = unitPrice * quantity;
    
    // Cập nhật giá trị thành tiền cho dòng sản phẩm trong bảng
    row.querySelector('.total-price').textContent = totalPrice.toLocaleString('vi-VN') + 'đ';
    const thuoctinh_id = row.getAttribute('data-id');
    // Cập nhật dữ liệu trong temporaryStorage và localStorage
    const product = temporaryStorage.find(item => item.thuoctinh_id === thuoctinh_id);
    if (product) {
        product.quantity = quantity;
        product.totalPrice = totalPrice;
        localStorage.setItem("tempStorage", JSON.stringify(temporaryStorage)); // Lưu lại vào localStorage
    }

    updateTotal(); // Cập nhật lại tổng
}

// Cập nhật hoặc thêm sản phẩm vào temporaryStorage
function addToTemporaryStorage(product) {
        temporaryStorage.push(product);

    // Lưu lại vào localStorage
    localStorage.setItem("tempStorage", JSON.stringify(temporaryStorage));
    updateOrderList();
}

// Xóa sản phẩm khỏi temporaryStorage
function removeFromTemporaryStorage(thuoctinh_id) {
    temporaryStorage = temporaryStorage.filter(item => item.thuoctinh_id !== thuoctinh_id);
    localStorage.setItem("tempStorage", JSON.stringify(temporaryStorage));
    updateOrderList();
}

// Cập nhật trạng thái của checkbox và thêm/xóa sản phẩm vào bảng checkout
function updateOrder(checkbox) {
    const row = checkbox.closest('tr');
    const productName = row.querySelector('.product-name').textContent;
    const unitPrice = parseInt(row.querySelector('.unit-price').textContent);
    const quantity = parseInt(row.querySelector('input[type="number"]').value);
    const totalPrice = unitPrice * quantity;

    // Cập nhật tổng tiền
    document.getElementById('cart-total').textContent = totalPrice.toLocaleString('vi-VN') + 'đ';
    const thuoctinh_id = row.getAttribute('data-id');  // Giả sử bạn có ID sản phẩm trong thuộc tính data-id
    
    if (checkbox.checked) {
        addToTemporaryStorage({ name: productName, quantity, totalPrice, thuoctinh_id });
    } else {
        removeFromTemporaryStorage(thuoctinh_id);
    }
    updateOrderList(); // Cập nhật bảng checkout
}

// Chọn tất cả sản phẩm
function toggleAll(checkbox) {
    const checkboxes = document.querySelectorAll('.list-product tbody input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = checkbox.checked;
        const row = cb.closest('tr');
        const productName = row.querySelector('.product-name').textContent;
        const unitPrice = parseInt(row.querySelector('.unit-price').textContent);
        const quantity = parseInt(row.querySelector('input[type="number"]').value);
        const totalPrice = unitPrice * quantity;

        if (cb.checked) {
            addToTemporaryStorage({ name: productName, quantity, totalPrice });
        } else {
            removeFromTemporaryStorage(productName);
        }
    });

    updateOrderList(); // Cập nhật bảng checkout
}

// Chạy khi trang được load lần đầu
document.addEventListener("DOMContentLoaded", () => {
    updateOrderList(); // Cập nhật lại bảng checkout từ temporaryStorage
    temporaryStorage = [];
});

// địa chỉ giao hàng
document.addEventListener("DOMContentLoaded", () => {
    // Lấy dữ liệu từ localStorage
    const rawData = localStorage.getItem(`${localStorage.getItem("user_id")}_infoshipping`);
    const shippingData = rawData ? JSON.parse(rawData) : [];
  
    // Hiển thị dữ liệu vào div#changeinfoship
    const container = document.getElementById("changeinfoship");
    if (container) {
      shippingData.forEach((info) => {
        const infoDiv = document.createElement("div");
        infoDiv.innerHTML = `
          <p><strong>Tên giao hàng:</strong> ${info.tenNguoiDung}</p>
          <p><strong>Số điện thoại:</strong> ${info.soDienThoai}</p>
          <p><strong>Địa chỉ:</strong> ${info.diaChi}</p>
        `;
        container.appendChild(infoDiv);
      });
    } else {
      console.error("Phần tử HTML với id='changeinfoship' không tồn tại.");
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    // Lấy thẻ a và div
    const link = document.getElementById("clickChangeInfoShip");
    const addressContainer = document.getElementById("changeinfoship");
  
    // Thêm sự kiện click vào thẻ a
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
  
      // Hiển thị hoặc ẩn div
      if (addressContainer.style.display === "none" || addressContainer.style.display === "") {
        addressContainer.style.display = "block"; // Hiển thị div
      } else {
        addressContainer.style.display = "none"; // Ẩn div
      }
    });
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    // Lấy dữ liệu từ localStorage
    const rawData = localStorage.getItem(`${localStorage.getItem("user_id")}_infoshipping`);
    let shippingData = rawData ? JSON.parse(rawData) : [];

    // Loại bỏ các bản ghi trùng lặp
    shippingData = shippingData.filter((item, index, self) =>
        index === self.findIndex((t) =>
            t.tenNguoiDung === item.tenNguoiDung &&
            t.diaChi === item.diaChi &&
            t.soDienThoai === item.soDienThoai
        )
    );

    // Lấy form và gán giá trị
    const form = document.getElementById("formAddress");
    if (form && shippingData.length > 0) {
        const info = shippingData[0]; // Lấy mục đầu tiên

        // Gán dữ liệu vào input
        const nameInput = form.querySelector("#nameUser");
        const addressInput = form.querySelector("#addressShip");
        const phoneInput = form.querySelector("#phoneShip");

        if (nameInput && addressInput && phoneInput) {
            nameInput.value = info.tenNguoiDung || "";
            addressInput.value = info.diaChi || "";
            phoneInput.value = info.soDienThoai || "";
        }
    } else {
        console.error("Không có dữ liệu hoặc không tìm thấy form.");
    }

    // Lưu dữ liệu đã lọc lại vào localStorage (nếu cần)
    localStorage.setItem(`${localStorage.getItem("user_id")}_infoshipping`, JSON.stringify(shippingData));
});

  


document.addEventListener("DOMContentLoaded",function(){
    const hoten = localStorage.getItem("hoten")
    const userLoginElement = document.getElementById("userLogin");
    console.log(hoten)
      if(hoten){
         //hieent hị tên của user đg đăng nhập
        userLoginElement.innerHTML = `Chào, ${hoten}`;

         // Hiển thị các mục "Tài khoản của tôi" và "Đơn hàng của tôi"
         document.getElementById("account").style.display = "block";
         document.getElementById("orders").style.display = "block";
         document.getElementById("logout").style.display = "block";
         document.getElementById("login").style.display = "none";
         document.getElementById("register").style.display = "none";
      }
      else{
        localStorage.removeItem("hoten")
        localStorage.removeItem(localStorage.getItem("user_id"))
      }
})

  
function Exit(){
    localStorage.removeItem("user_id");
    localStorage.removeItem("hoten");
    localStorage.removeItem("token");
    localStorage.removeItem("role")
    window.location.href = '../login/login.html'
}

  

// Hàm khởi tạo sự kiện click
function addClickEvent(elementId, callback) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Phần tử với ID "${elementId}" không tồn tại.`);
        return;
    }
    element.addEventListener('click', callback);
}

// Hàm xử lý khi nhấn nút tăng
function handleIncreaseClick() {
    const quantityValue = document.getElementById('quantity-value');
    if (!quantityValue) {
        console.error("Không tìm thấy phần tử hiển thị số lượng.");
        return;
    }

    let currentValue = parseInt(quantityValue.textContent);
    if (isNaN(currentValue)) {
        console.error("Giá trị hiện tại không phải là số hợp lệ.");
        return;
    }

    quantityValue.textContent = currentValue + 1;
    
}

// Hàm xử lý khi nhấn nút giảm
function handleDecreaseClick() {
    const quantityValue = document.getElementById('quantity-value');
    if (!quantityValue) {
        console.error("Không tìm thấy phần tử hiển thị số lượng.");
        return;
    }

    let currentValue = parseInt(quantityValue.textContent);
    if (isNaN(currentValue)) {
        console.error("Giá trị hiện tại không phải là số hợp lệ.");
        return;
    }

    if (currentValue > 1) {
        quantityValue.textContent = currentValue - 1;
        
    } else {
        console.warn("Số lượng không thể nhỏ hơn 1.");
    }
}

// Hàm khởi tạo các sự kiện
function initializeEvents() {
    addClickEvent('increase', handleIncreaseClick);
    addClickEvent('decrease', handleDecreaseClick);
}

// Gọi hàm khởi tạo khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', initializeEvents);

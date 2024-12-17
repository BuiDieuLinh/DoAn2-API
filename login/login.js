document.addEventListener('DOMContentLoaded', function(){
    $(document).ready(function(){
    $('#eye').click(function(){
        $(this).toggleClass('open');
        $(this).children('i').toggleClass('fa-eye-slash fa-eye');
        if($(this).hasClass('open')){
            $(this).prev().attr('type', 'text');
        }else{
            $(this).prev().attr('type', 'password');
        }
    });
});
})



$(document).ready(function(){
    $('.signup-link').click(function(){
        $('#form-login').css('display','none')
        $('#form-signup').css('display','block')
    })
    $('.login-link').click(function(){
        $('#form-signup').css('display','none')
        $('#form-login').css('display','block')
    })
})

// // Hàm đăng nhập
function Login() {
    let username = document.getElementById("userLogin").value;
    let password = document.getElementById("passwordLogin").value;

    fetch('http://localhost:52890/api/Users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("hoten", data.hoten);
            localStorage.setItem("user_id", data.user_id);

            alert("Đăng nhập thành công!");

            // Redirect và dừng hàm
            if(data.role === 'Admin'){
                window.location.href = "../admin/admin.html"
                return
            }else{
                window.location.href = "../user/index.html";
                return;
            }
           
        } else {
            alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
        }
    })
    .catch(error => {
        console.error("Lỗi khi gọi API đăng nhập:", error);
        alert("Có lỗi xảy ra trong quá trình đăng nhập.");
    });
}

function SignUp() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let email = document.getElementById("email").value.trim();

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password || !email) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    const formDataAdd = new FormData();
    formDataAdd.append("tenTaiKhoan", username);
    formDataAdd.append("email", email);
    formDataAdd.append("matKhau", password);
    formDataAdd.append("nguoidung_id", "hadas");

    fetch('http://localhost:44364/api/User/create', {
        method: 'POST',
        body: formDataAdd, // Không cần đặt 'Content-Type'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Xử lý kết quả trả về
        alert("Đăng ký thành công!");
        console.log("Response:", data);
       setTimeout(3000)
    })
    .catch(error => {
        // Xử lý lỗi
        alert("Đăng ký thất bại! Vui lòng thử lại.");
        console.error("Error:", error);
    });
    
}

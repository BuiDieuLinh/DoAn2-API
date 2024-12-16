document.addEventListener("DOMContentLoaded", function () {
    const hoten = localStorage.getItem("hoten");
    const userElements = document.querySelectorAll("#userLogin, #userLogin-menunav");
    const showElements = document.querySelectorAll("#account, #account-menunav, #orders, #orders-menunav, #logout, #logout-menunav");
    const hideElements = document.querySelectorAll("#login, #login-menunav, #register, #register-menunav");

    if (hoten) {
        // Hiển thị tên người dùng
        userElements.forEach(el => el.innerHTML = `Chào, ${hoten}`);

        // Hiển thị các mục cần thiết
        showElements.forEach(el => el.style.display = "block");

        // Ẩn các mục không cần thiết
        hideElements.forEach(el => el.style.display = "none");
    } else {
        // Xóa dữ liệu nếu không có thông tin người dùng
        localStorage.removeItem("hoten");
        localStorage.removeItem(localStorage.getItem("user_id"));
    }
});

  
function Exit(){
    localStorage.removeItem("user_id");
    localStorage.removeItem("hoten");
    localStorage.removeItem("token");
    localStorage.removeItem("role")
    window.location.href = '../login/login.html'
}

  

document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll(".tab");
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            // Bỏ lớp 'selected' từ tất cả các tab
            listItems.forEach(i =>{
                i.classList.remove('selected');
            });
            // Thêm lớp 'selected' cho tab hiện tại
            this.classList.add('selected');
            
        });
    });
});


function openTab(evt, tabName) {
    // Lấy tất cả các phần tử có class 'content' và ẩn chúng đi
    var tabContents = document.getElementsByClassName("content");
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // Bỏ class 'active' khỏi tất cả các tab
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    var tabs = document.getElementsByClassName("content");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    // Hiển thị nội dung tab được chọn và thêm class 'active' vào tab đó
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

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

function openTabOrder(evt, tabName) {
    // Lấy tất cả các phần tử có class 'content' và ẩn chúng đi
    var tabContents = document.getElementsByClassName("content-order");
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // Bỏ class 'active' khỏi tất cả các tab
    var tabs = document.getElementsByClassName("tab-order");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }

    // Hiển thị nội dung tab được chọn và thêm class 'active' vào tab đó
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll(".tab-order");
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            // Bỏ lớp 'selected' từ tất cả các tab
            listItems.forEach(i =>{
                i.classList.remove('selected');
            });
            // Thêm lớp 'selected' cho tab hiện tại
            this.classList.add('selected');
            
        });
    });
});

// Cuộn thanh tab khi người dùng cuộn chuột
const tabContainer = document.getElementById('tabs-container');

tabContainer.addEventListener('wheel', function(event) {
    if (event.deltaY > 0) {
        tabContainer.scrollLeft += 100; // Cuộn sang phải
    } else {
        tabContainer.scrollLeft -= 100; // Cuộn sang trái
    }
});

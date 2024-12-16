document.addEventListener("DOMContentLoaded",function(){
    const user = localStorage.getItem("hoten") ;
    const role = localStorage.getItem("role") ;
    const userLoginElement = document.getElementById("adminLogin");

    if(user && role === 'Admin'){
        //hieent hị tên của user đg đăng nhập
        userLoginElement.innerHTML = `Chào, ${user}`;
    }else{
        window.location.href = "../login/login.html"
    }
})



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
    
        // Hiển thị nội dung tab được chọn và thêm class 'active' vào tab đó
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.classList.add("active");
}

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

function openAddProduct() {
    document.getElementById("formAddProduct").style.display = "flex";
    document.body.classList.add('active-popup'); // Add blur effect
}

function closeAddProduct() {
    document.getElementById("formAddProduct").style.display = "none";
    document.body.classList.remove('active-popup'); // Remove blur effect
}
document.addEventListener('DOMContentLoaded', () => {
    // Biểu đồ Doanh Thu
    const ctxRevenue = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctxRevenue, {
        type: 'line',
        data: {
            labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'],
            datasets: [{
                label: 'Doanh thu (triệu VND)',
                data: [10, 15, 20, 25, 30, 35, 40],
                borderColor: '#A9141E',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            
        }
    });

    // Biểu đồ Đơn Hàng
    const ctxOrders = document.getElementById('ordersChart').getContext('2d');
    new Chart(ctxOrders, {
        type: 'doughnut',
        data: {
            labels: ['Đã giao', 'Đang xử lý', 'Đã hủy'],
            datasets: [{
                label: 'Trạng thái đơn hàng',
                data: [50, 30, 20],
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
            }]
        },
        options: {
            responsive: false,

        }
    });
})

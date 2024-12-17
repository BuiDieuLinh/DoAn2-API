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


// biểu đồ
// Khởi tạo biểu đồ
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',  // Loại biểu đồ
    data: {
        labels: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5'],  // Nhãn
        datasets: [{
            label: 'Doanh thu',
            data: [12, 19, 3, 5, 2],  // Dữ liệu
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Khởi tạo Flatpickr cho chọn ngày
flatpickr("#datePicker", {
    dateFormat: "Y-m-d",
    onChange: function(selectedDates, dateStr, instance) {
        console.log("Ngày đã chọn: " + dateStr);
        // Cập nhật dữ liệu biểu đồ dựa trên ngày đã chọn
        // Thực hiện gọi API hoặc tính toán lại dữ liệu tại đây
    }
});

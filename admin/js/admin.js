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
// document.addEventListener("DOMContentLoaded", function(){
//     // Đảm bảo rằng phần tử canvas có đủ chiều rộng và chiều cao
//     const ctx = document.getElementById('myChart').getContext('2d');

//     // Dữ liệu cho biểu đồ
//     const myChart = new Chart(ctx, {
//         type: 'bar',  // Loại biểu đồ 'bar' để tạo biểu đồ cột
//         data: {
//             labels: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5'],  // Nhãn cho các điểm trên trục X
//             datasets: [{
//                 label: 'Doanh thu',
//                 data: [12, 19, 3, 5, 2],  // Dữ liệu doanh thu cho mỗi ngày
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Màu nền cho cột
//                 borderColor: 'rgba(75, 192, 192, 1)',  // Màu đường biên
//                 borderWidth: 1,
//                 hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)',  // Màu nền khi hover
//             }]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 y: {
//                     beginAtZero: true,  // Đảm bảo trục Y bắt đầu từ 0
//                     grid: {
//                         borderColor: 'rgba(255, 255, 255, 0.2)'  // Màu đường lưới
//                     },
//                     ticks: {
//                         color: 'rgba(255, 255, 255, 0.7)'  // Màu của các số trên trục Y
//                     }
//                 },
//                 x: {
//                     grid: {
//                         borderColor: 'rgba(255, 255, 255, 0.2)'  // Màu đường lưới
//                     },
//                     ticks: {
//                         color: 'rgba(255, 255, 255, 0.7)'  // Màu của các số trên trục X
//                     }
//                 }
//             },
//             plugins: {
//                 legend: {
//                     labels: {
//                         color: 'white'  // Màu chữ của chú thích biểu đồ
//                     }
//                 }
//             },
//             animation: {
//                 duration: 1000,  // Thời gian cho hiệu ứng chuyển động
//                 easing: 'easeInOutSine'  // Phương thức chuyển động mềm mại
//             }
//         }
//     });
    
//     // Khởi tạo Flatpickr cho phần tử chọn ngày
//     flatpickr("#datePicker", {
//         dateFormat: "Y-m-d",
//         onChange: function(selectedDates, dateStr, instance) {
//             console.log("Ngày đã chọn: " + dateStr);
//             // Cập nhật dữ liệu biểu đồ dựa trên ngày đã chọn
//             // Thực hiện gọi API hoặc tính toán lại dữ liệu tại đây
//         }
//     });
// })

// // Hàm LoadThongKe bằng JavaScript thuần
// function LoadThongKe() {
//     fetch(`http://localhost:52890/api/ThongKe/ThongKeDoanhThu?startDate=2024-01-01&endDate=2024-12-31
// `)
//         .then(response => response.json())  // Chuyển đổi dữ liệu trả về từ API thành JSON
//         .then(data => {
//             const labels = data.map(item => item.ngayBan);  // Lấy ngày từ dữ liệu
//             const chartData = data.map(item => item.doanhThu);  // Lấy doanh thu từ dữ liệu
//             updateChartData(labels, chartData);  // Cập nhật biểu đồ
//         })
//         .catch(error => {
//             console.error("Lỗi khi load dữ liệu thống kê: ", error);
//         });
// }

// document.addEventListener("DOMContentLoaded", function(){
//     // Hàm cập nhật dữ liệu vào biểu đồ
//     function updateChartData(labels, data) {
//         console.log('Updating chart with labels and data...');
//         console.log('New Labels:', labels);
//         console.log('New Data:', data);

//         // Giả sử bạn đã có một đối tượng myChart như trước
//         myChart.data.labels = labels;  // Cập nhật ngày tháng (labels)
//         myChart.data.datasets[0].data = data;  // Cập nhật doanh thu (data)

//         // Cập nhật biểu đồ sau khi thay đổi dữ liệu
//         myChart.update();
//     }
// })



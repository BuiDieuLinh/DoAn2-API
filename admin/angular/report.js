app.controller("ReportCtrl", function($scope, $http){
    $scope.reportToday = {}

    $scope.LoadReportToday = function(){
        $http.get(current_url + '/api/ThongKe/ThongKeHomNay')
            .then(function(response){
                $scope.reportToday = response.data;
            }).catch(function(err){
                console.error("Lỗi khi đọc dl thống kê hôm nay: ", $scope.reportToday)
            })
    }
    $scope.LoadReportToday()
    $scope.reportDoanhThu = []
        // Hàm load dữ liệu thống kê từ API
        $scope.LoadThongKe = function () {
            $http.get(`${current_url}/api/ThongKe/ThongKeDoanhThu?startDate=2024-01-01&endDate=2024-12-31`)
                .then(function (response) {
                    // Tính tổng số liệu
                    let totalSoDonHangDat = 0;
                    let totalSoDonHangHuy = 0;
                    let totalSoKhachHangMoi = 0;
                    let totalDoanhThu = 0;
                    let totalLaiXuat = 0;
    
                    response.data.forEach(function (item) {
                        totalSoDonHangDat += item.soDonHangDat || 0;
                        totalSoDonHangHuy += item.soDonHangHuy || 0;
                        totalSoKhachHangMoi += item.soKhachHangMoi || 0;
                        totalDoanhThu += item.doanhThu || 0;
                        totalLaiXuat += item.laiSuat || 0;
                    });
    
                    // Gán vào scope để hiển thị tổng
                    $scope.totalSoDonHangDat = totalSoDonHangDat;
                    $scope.totalSoDonHangHuy = totalSoDonHangHuy;
                    $scope.totalSoKhachHangMoi = totalSoKhachHangMoi;
                    $scope.totalDoanhThu = totalDoanhThu;
                    $scope.totalLaiXuat = totalLaiXuat;

                    $scope.reportDoanhThu = response.data;
                    $scope.soLuongTonKho = response.data[0]?.soLuongTonKho || 0;
                }).catch(function (error) {
                    console.error("Lỗi khi load dữ liệu thống kê: ", error);
                });
        };
        $scope.LoadThongKe();
})

app.controller("ChartCtrl", function($scope, $http){
    let myChart = null; // Biến chứa biểu đồ, khai báo ngoài để dùng chung.
    
    // Khởi tạo biểu đồ một lần
    $scope.initChart = function () {
        const ctx = document.getElementById('myChart').getContext('2d');
        // Kiểm tra và hủy bỏ biểu đồ cũ nếu có
        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [], // Trục X rỗng
                datasets: [{
                    label: 'Doanh thu',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                    x: { ticks: { autoSkip: false } }
                }
            }
        });
    };

    // Cập nhật dữ liệu cho biểu đồ
    $scope.updateChartData = function (labels, data) {
        if (myChart) {
            myChart.data.labels = labels; // Gán nhãn trục X
            myChart.data.datasets[0].data = data; // Gán dữ liệu cho biểu đồ
            myChart.update(); // Cập nhật biểu đồ
        }
    };

    // Hàm load dữ liệu thống kê từ API
    $scope.LoadThongKe = function () {
        $http.get(`${current_url}/api/ThongKe/ThongKeDoanhThu?startDate=2024-01-01&endDate=2024-12-31`)
            .then(function (response) {
              
                // Chuẩn bị dữ liệu biểu đồ
                const labels = response.data.map(item => new Date(item.ngayBan).toLocaleDateString('vi-VN'));
                const chartData = response.data.map(item => item.doanhThu);

                // Cập nhật biểu đồ
                $scope.updateChartData(labels, chartData);

                // Gán dữ liệu báo cáo
                $scope.reportDoanhThu = response.data;
                
            }).catch(function (error) {
                console.error("Lỗi khi load dữ liệu thống kê: ", error);
            });
    };

    // Khởi chạy biểu đồ và load dữ liệu khi controller khởi động
    $scope.initChart();
    $scope.LoadThongKe();
})
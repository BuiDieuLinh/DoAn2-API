// var current = 0;
// var totalImages = 3;

// function displayImage() {
//     var images = document.querySelectorAll("#slide-img img");
//     images.forEach((img, index) => {
//         img.classList.remove("active");
//         if (index === current) {
//             img.classList.add("active");
//         }
//     });
// }

// function slideshow() {
//     current = (current + 1) % totalImages;
//     displayImage();
// }

// function autoPlay() {
//     setInterval(slideshow, 4000);
// }

// function clickIncrease() {
//     current = (current + 1) % totalImages;
//     displayImage();
// }

// function clickDecrease() {
//     current = (current - 1 + totalImages) % totalImages;
//     displayImage();
// }

// Khởi động autoplay khi trang được tải
// window.onload = function() {
//     autoPlay();
//     displayImage();
// };
document.addEventListener("DOMContentLoaded",function(){
    const userLogin = JSON.parse(localStorage.getItem("userLogin")) ;
    const userLoginElement = document.getElementById("userLogin");

    if(userLogin){
        //hieent hị tên của user đg đăng nhập
        userLoginElement.innerHTML = `Chào, ${userLogin.userName}`;
    }else{

    }
})

document.addEventListener("DOMContentLoaded", function() {
    const textElement = document.getElementById('line');
    const text = textElement.textContent; // Lấy nội dung văn bản gốc
    textElement.textContent = ''; // Xóa văn bản ban đầu
  
    let index = 0;
    const typingSpeed = 50; // Giảm tốc độ xuống 50ms để gõ nhanh hơn
  
    function type() {
      if (index < text.length) {
        textElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, typingSpeed); // Gọi lại hàm để tạo hiệu ứng từng chữ
      } else {
        // Sau khi hoàn tất, lặp lại quá trình nếu muốn
        setTimeout(() => {
          textElement.textContent = ''; // Xóa văn bản để lặp lại
          index = 0; // Đặt lại chỉ số
          type(); // Gọi lại để tiếp tục hiệu ứng
        }, 2000); // Dừng lại một chút trước khi lặp lại
      }
    }
  
    textElement.style.opacity = 1; // Đảm bảo chữ hiển thị
    type(); // Bắt đầu hiệu ứng gõ chữ
  });
  
document.addEventListener("DOMContentLoaded", function () {
  let currentIndex = 0; // Vị trí hình ảnh hiện tại
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;

  // Hiển thị hình ảnh theo chỉ số
  function showSlide(index) {
      slides.forEach((slide, i) => {
          slide.style.opacity = i === index ? "1" : "0"; // Hiển thị hình ảnh hiện tại
          slide.style.zIndex = i === index ? "1" : "0"; // Đảm bảo hình ảnh hiện tại nằm trên cùng
      });
  }

  // Chuyển đến hình tiếp theo
  function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      showSlide(currentIndex);
  }

  // Chuyển đến hình trước đó
  function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      showSlide(currentIndex);
  }

  // Gắn sự kiện click cho nút "Prev" và "Next"
  document.querySelector(".prev").addEventListener("click", prevSlide);
  document.querySelector(".next").addEventListener("click", nextSlide);

  // Tự động chuyển hình mỗi 3 giây
  setInterval(nextSlide, 3000);

  // Hiển thị hình đầu tiên khi bắt đầu
  showSlide(currentIndex);
});



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
  
function Exit(){
    localStorage.removeItem("user_id");
    localStorage.removeItem("hoten");
    localStorage.removeItem("token");
    localStorage.removeItem("role")
    window.location.href = '../login/login.html'
}

// Hàm mở/đóng menu
function toggleMenu() {
  const menuContent = document.getElementById("menu-content");
  const overlay = document.getElementById("overlay");
  menuContent.classList.toggle("active");
  overlay.classList.toggle("active");
}

// Đóng menu khi nhấp vào overlay
document.addEventListener("click", function(event) {
  const menuContent = document.getElementById("menu-content");
  const overlay = document.getElementById("overlay");
  const menuNav = document.getElementById("menu-nav");
  const menuIcon = menuNav.querySelector("i");
  const isClickInside = menuContent.contains(event.target) || menuIcon.contains(event.target);

  if (!isClickInside && menuContent.classList.contains("active")) {
      menuContent.classList.remove("active");
      overlay.classList.remove("active");
  }
});

    
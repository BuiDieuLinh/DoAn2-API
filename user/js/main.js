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

    
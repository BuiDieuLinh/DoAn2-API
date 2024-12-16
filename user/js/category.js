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

  

document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll("#group-list li");

    listItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
            } else {
                this.classList.add('selected');
            }
        });
    });
});



$(document).ready(function(){
    $("#title-1").click(function(){
        // Chuyển đổi giữa icon + và -
        const icon = $(this).find("i");
        icon.toggleClass("fa-plus"); // Chuyển lớp icon
        $("#group-1").slideToggle();
        });
});
$(document).ready(function(){
    $("#title-2").click(function(){
        // Chuyển đổi giữa icon + và -
        const icon = $(this).find("i");
        icon.toggleClass("fa-plus"); // Chuyển lớp icon
        $("#group-2").slideToggle();
        });
});
$(document).ready(function(){
    $("#title-3").click(function(){
        // Chuyển đổi giữa icon + và -
        const icon = $(this).find("i");
        icon.toggleClass("fa-plus"); // Chuyển lớp icon
        $("#group-3").slideToggle();
        });
});
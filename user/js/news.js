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
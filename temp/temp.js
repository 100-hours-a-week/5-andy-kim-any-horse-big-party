document.addEventListener("DOMContentLoaded", function () {
  // 페이지 로드 시에 메뉴 상자를 숨깁니다.
  document.getElementById("menu-box").style.display = "none";
  // 이미지에 마우스를 올리면 메뉴 상자를 보여줍니다.
  document
    .querySelector(".image-container")
    .addEventListener("mouseover", function () {
      document.getElementById("menu-box").style.display = "block";
      console.log(1234);
    });

  // 이미지에서 마우스가 벗어나면 메뉴 상자를 숨깁니다.

  document
    .querySelector(".image-container")
    .addEventListener("mouseout", function () {
      document.getElementById("menu-box").style.display = "none";
    });
});

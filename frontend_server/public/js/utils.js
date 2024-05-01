async function fetchData(url) {
  const responseData = await fetch(url, {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw new Error("해당 페이지 열람 권한이 없습니다."); // 401 에러 발생 시 에러 throw
      return response.json();
    })
    .catch((error) => {
      alert(error);
      window.location.href = `../html/login.html`;
    });
  return responseData;
}

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function checkAuth() {
  const responseData = await fetch(`http://localhost:3000/protected`, {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw new Error("해당 페이지 열람 권한이 없습니다!"); // 401 에러 발생 시 에러 throw
    })
    .catch((error) => {
      alert(error);
      window.location.href = `../html/login.html`;
    });
  return responseData;
}

export default {
  fetchData,
  getCurrentDateTime,
  checkAuth,
};

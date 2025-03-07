const form = document.querySelector("#login-form");

// 폼 제출 처리 함수
const handleSubmit = async (e) => {
    // 기본 제출 이벤트 방지
    e.preventDefault();

    // FormData 객체 생성
    const formData = new FormData(form);
    // 비밀번호를 SHA-256 해시로 변환
    const sha256pw = sha256(formData.get("pw"));
    // 해시된 비밀번호로 폼 데이터 업데이트
    formData.set("pw", sha256pw);

    const res = await fetch("/login", {
        method: "post",
        body: formData,
    });

    const data = await res.json();
    const accessToken = data.access_token;

    console.log(accessToken);

    if (res.status === 200) {
        window.localStorage.setItem("token", accessToken);
        alert("로그인에 성공했습니다.");

        // // 상품 가져오기
        // const res = await fetch("/items", {
        //     method: "GET",
        //     headers: {
        //         Authorization: `Bearer ${accessToken.trim()}`,
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //     },
        // });

        // const data = await res.json();
        // console.log(data);
        window.location.pathname = "/";
    } else if (res.status === 401) {
        alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
};

// 폼 제출 이벤트 리스너 등록
form.addEventListener("submit", handleSubmit);

const form = document.querySelector("#signup-form");

// 비밀번호 확인 함수
const checkPw = () => {
    // FormData 객체를 생성하여 폼 데이터 가져오기
    const formData = new FormData(form);
    const pw = formData.get("pw"); // 첫 번째 비밀번호
    const pw2 = formData.get("pw2"); // 두 번째 비밀번호

    // 두 비밀번호가 같은지 비교하여 결과 반환
    return pw === pw2;
};

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

    // 비밀번호가 일치하는 경우
    if (checkPw()) {
        // 서버에 폼 데이터 전송
        const res = await fetch("/signup", {
            method: "post", // POST 메서드 사용
            body: formData, // 폼 데이터 포함
        });

        // 로그인페이지로 이동
        window.location.pathname = "/login.html";
    } else {
        // 비밀번호가 일치하지 않을 경우 경고 메시지 표시
        alert("비밀번호가 일치하지 않습니다.");
    }
};

// 폼 제출 이벤트 리스너 등록
form.addEventListener("submit", handleSubmit);

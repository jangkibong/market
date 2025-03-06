const form = document.getElementById("write-form");

const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData(form);
    body.append("insertAt", new Date().getTime());

    try {
        const res = await fetch("/items", {
            method: "POST",
            body,
        });
        if (res.status == 200) {
            window.location.pathname = "/";
        }
    } catch (e) {
        console.error("글쓰기 실패");
    }

    // console.log(res);
};

form.addEventListener("submit", handleSubmit);

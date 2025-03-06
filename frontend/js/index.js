const calcTime = (timestamp) => {
    const curTime = new Date().getTime() - 9 * 60 * 60 * 1000; // - 9 * 60 * 60 * 1000 --> 한국시간을 세계시간 기준으로 변경
    const time = new Date(curTime - timestamp);
    const hour = time.getHours();
    const min = time.getMinutes();
    const sec = time.getSeconds();

    if (hour > 0) {
        return `${hour}시간 전`;
    } else if (min > 0) {
        return `${min}분 전`;
    } else if (sec > 0) {
        return `${sec}초 전`;
    } else if ((sec = 0)) {
        return `방금 전`;
    }
};

const renderData = (data) => {
    const main = document.querySelector("main");

    data.sort((a, b) => b.insertAt - a.insertAt).forEach(async (data) => {
        console.log(data.title);

        const item_list = document.createElement("div");
        item_list.classList.add("items-list");

        const item_image = document.createElement("div");
        item_image.classList.add("item-list__img");

        const image = document.createElement("img");
        const res = await fetch(`/images/${data.id}`);
        const blob = await res.blob();
        // console.log(await blob.size);
        const url = URL.createObjectURL(blob);

        if (blob.size > 50) {
            image.src = url;
            image.setAttribute("alt", "상품 이미지");
        } else {
            image.src = "./assets/images.svg";
            image.classList.add("non-image");
            image.setAttribute("alt", "상품 이미지가 없습니다.");
        }

        const item_list_info = document.createElement("div");
        item_list_info.classList.add("item-list__info");

        const info_title = document.createElement("div");
        info_title.classList.add("item-list__info-title");
        info_title.innerText = data.title;

        const info_meta = document.createElement("div");
        info_meta.classList.add("item-list__info-meta");

        const info_place = document.createElement("span");
        const info_insertAt = document.createElement("span");
        info_place.classList.add("item-list__info-place");
        info_insertAt.classList.add("item-list__info-insertAt");
        info_place.innerText = data.place;
        info_insertAt.innerText = calcTime(data.insertAt);

        const info_price = document.createElement("div");
        info_price.classList.add("item-list__info-price");
        info_price.innerText = data.price;

        main.appendChild(item_list);
        item_list.appendChild(item_image);
        item_image.appendChild(image);
        item_list.appendChild(item_list_info).append(info_title, info_meta, info_price);
        info_meta.append(info_place, info_insertAt);
    });
};

const fetchList = async () => {
    const res = await fetch("/items");
    const data = await res.json();

    console.log(data);
    renderData(data);
};

fetchList();

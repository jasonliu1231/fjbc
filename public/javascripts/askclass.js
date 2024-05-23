window.addEventListener("load", async () => {
    // 當前時間
    const date = new Date();
    const today = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;
    const thisMonth = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, 0)}-01`;
    document.querySelector("#dateStatr").value = thisMonth;
    document.querySelector("#dateEnd").value = today;

    searchAskacademy();
});

async function searchAskacademy() {
    const dateStatr = document.querySelector("#dateStatr").value;
    const dateEnd = document.querySelector("#dateEnd").value;
    const keyword = document.querySelector("#keyword").value;

    if (!!!dateStatr || !!!dateEnd) {
        alert("時間不可以為空白");
        return;
    }

    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };

    let url = `api/askacademy?start_date=${dateStatr}&end_date=${dateEnd}`;
    if (keyword != "") {
        url += `&param=${keyword}`;
    }
    const { isOk, data } = await submitObjApi(url, config);

    if (isOk) {
        if (isWeb) {
            creatTable(data);
        } else {
            creatCard(data);
        }
    }
}

function creatTable(data) {
    const element = document.querySelector("#list");
    element.innerHTML = "";
    let htmlStr = "";
    data.AskAcademy_list.forEach((item) => {
        // 希望科目處理
        const course_list = [];
        item.course_list.forEach((i) => {
            course_list.push(i.course_name);
        });
        htmlStr += `
        <tr onclick="toNote(${item.id})">
          <td>
            <div>${new Date(item.created_at).toLocaleDateString() || ""}</div>
            <div>${
                new Date(item.created_at).toLocaleTimeString("zh-TW", {
                    hour12: false
                }) || ""
            }</div>
        </td>
          <td>${item.student_name || ""}</td>
          <td>${item.school || ""}</td>
          <td><div>家裡：${item.tel || ""}</div>爸爸：${
            item.father_mobile || ""
        }<div></div><div>媽媽：${item.mother_mobile || ""}</div></td>
          <td><div>平日：${item.Weekday_time || ""}</div><div>假日：${
            item.holiday_time || ""
        }</div></td>
          <td>${course_list.join(", ")}</td>
        </tr>
        `;
    });
    element.innerHTML = htmlStr;
}

function creatCard(data) {
    const element = document.querySelector("#list");
    element.innerHTML = "";
    let htmlStr = "";
    data.AskAcademy_list.forEach((item) => {
        // 希望科目處理
        const course_list = [];
        item.course_list.forEach((i) => {
            course_list.push(i.course_name);
        });
        htmlStr += `
        <div class="card my-1" onclick="toNote(${item.id})">
          <div class="card-body">
            <h5 class="card-title">${item.student_name || ""}</h5>
            <h6 class="card-subtitle text-body-secondary">填表日期：${
                new Date(item.created_at).toLocaleString() || ""
            }</h6>
            <p class="card-text mb-0">聯繫電話：${item.tel || ""}</p>
            <p class="card-text mb-0">媽媽：${item.mother_mobile || ""}</p>
            <p class="card-text mb-0">爸爸：${item.father_mobile || ""}</p>
            <p class="card-text mb-0">詢問科目：${course_list.join(", ")}</p>
          </div>
        </div>
        `;
    });
    element.innerHTML = htmlStr;
}

function toNote(id) {
    window.location.href = "note?id=" + id;
}

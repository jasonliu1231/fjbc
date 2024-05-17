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

    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    const { isOk, data } = await submitObjApi("api/askacademy", config);

    if (isOk) {
        creatTable(data);
    }
});

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
          <td>${item.id || ""}</td>
          <td>${new Date(item.created_at).toLocaleString() || ""}</td>
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
async function searchAskacademy() {
    const dateStatr = document.querySelector("#dateStatr").value;
    const dateEnd = document.querySelector("#dateEnd").value;
    const keyword = document.querySelector("#keyword").value;

    const body = { dateStatr, dateEnd, keyword };

    if (!!!dateStatr || !!!dateEnd) {
        alert("時間不可以為空白");
        return;
    }

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };
    // const {isOk, data} = await submitObjApi('api/askacademy', config)
    const response = await fetch("/api/keywordAskacademy", config);
    if (response.ok) {
        const data = await response.json();
        const element = document.querySelector("#list");
        element.innerHTML = "";
        let htmlStr = "";
        data.forEach((item) => {
            htmlStr += `
        <tr onclick="toNote(${item.id})">
          <td>${item.id || ""}</td>
          <td>${new Date(item.created_at).toLocaleString() || ""}</td>
          <td>${item.student_name || ""}</td>
          <td>${item.school || ""}</td>
          <td><div>家裡：${item.tel || ""}</div>爸爸：${
                item.father_mobile || ""
            }<div></div><div>媽媽：${item.mother_mobile || ""}</div></td>
          <td><div>平日：${item.Weekday_time || ""}</div><div>假日：${
                item.holiday_time || ""
            }</div></td>
          <td>${item.groupcourseselection || ""}</td>
        </tr>
        `;
        });
        element.innerHTML = htmlStr;
    }
}

function toNote(id) {
    window.location.href = "admin/note?id=" + id;
}

window.addEventListener("load", async () => {
    searchAskacademy();
    getTeacher();
});

async function getTeacher() {
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };
    const { isOk, data } = await submitObjApi(
        apiurl + `/api/askacademy/teachers`,
        config
    );
    if (isOk) {
        let html = `<option value=""></option>`;
        data.forEach((name) => {
            html += `<option value="${name}">${name}</option>`;
        });
        const primary_caregiver = document.querySelector("#keyword");
        primary_caregiver.innerHTML = html;
    }
}

async function searchAskacademy() {
    const dateStatr = document.querySelector("#dateStatr").value;
    const dateEnd = document.querySelector("#dateEnd").value;
    const keyword = document.querySelector("#keyword").value || currentName;

    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };

    let url = apiurl + `/api/askacademy?`;
    if (dateStatr != "" && dateEnd != "") {
        url += `start_date=${dateStatr}&end_date=${dateEnd}&`;
    }

    const param1 = url + `teacher1_param=${keyword}`;
    let { isOk, data } = await submitObjApi(param1, config);

    if (isOk) {
        if (isWeb) {
            creatTable(data, true);
        } else {
            creatCard(data, true);
        }
    }

    const param2 = url + `teacher2_param=${keyword}`;
    ({ isOk, data } = await submitObjApi(param2, config));

    if (isOk) {
        if (isWeb) {
            creatTable(data, false);
        } else {
            creatCard(data, false);
        }
    }
}

function creatTable(data, isPrimary) {
    let element;
    if (isPrimary) {
        element = document.querySelector("#primary_list");
    } else {
        element = document.querySelector("#secondary_list");
    }
    element.innerHTML = "";
    let htmlStr = "";
    data.AskAcademy_list.forEach((item) => {
        // 修改排序
        const academy_track_list = item.academy_track_list;
        academy_track_list.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
        // 希望科目處理
        const course_list = [];
        item.course_list.forEach((i) => {
            course_list.push(i.course_name);
        });
        htmlStr += `
        <tr onclick="toNote(${item.id})">
          <td class="${isPrimary ? "text-bg-primary" : "text-bg-info"}">
            <div>${new Date(item.created_at).toLocaleDateString() || ""}</div>
            <div>${
                new Date(item.created_at).toLocaleTimeString("zh-TW", {
                    hour12: false
                }) || ""
            }</div>
        </td>
          <td class="${isPrimary ? "text-bg-primary" : "text-bg-info"}">${
            item.student_name || ""
        }</td>
          <td class="${
              isPrimary ? "text-bg-primary" : "text-bg-info"
          }"><div>家裡：${item.tel || ""}</div>爸爸：${
            item.father_mobile || ""
        }<div></div><div>媽媽：${item.mother_mobile || ""}</div></td>
          <td class="${
              isPrimary ? "text-bg-primary" : "text-bg-info"
          }">${course_list.join(", ")}</td>
          <td class="${isPrimary ? "text-bg-primary" : "text-bg-info"}">
            <div>${
                academy_track_list.length > 0
                    ? new Date(
                          academy_track_list[0].updated_at
                      ).toLocaleDateString()
                    : ""
            }</div>
            <div>${
                academy_track_list.length
                    ? new Date(
                          academy_track_list[0].updated_at
                      ).toLocaleTimeString("zh-TW", {
                          hour12: false
                      })
                    : ""
            }</div>
        </td>
        <td class="${
            isPrimary ? "text-bg-primary" : "text-bg-info"
        } text-truncate max-w-200">${
            academy_track_list.length
                ? academy_track_list[0].track_content_create
                : ""
        }</td>
        </tr>
        `;
    });
    element.innerHTML = htmlStr;
}

function creatCard(data, isPrimary) {
    let element;
    if (isPrimary) {
        element = document.querySelector("#primary_list");
    } else {
        element = document.querySelector("#secondary_list");
    }
    element.innerHTML = "";
    let htmlStr = "";
    data.AskAcademy_list.forEach((item) => {
        // 修改排序
        const academy_track_list = item.academy_track_list;
        academy_track_list.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
        // 希望科目處理
        const course_list = [];
        item.course_list.forEach((i) => {
            course_list.push(i.course_name);
        });
        htmlStr += `
        <div class="card my-1 ${
            isPrimary ? "text-bg-primary" : "text-bg-info"
        }" onclick="toNote(${item.id})">
          <div class="card-body">
            <h5 class="card-title">${item.student_name || ""}</h5>
            <p class="card-text mb-0">填表日期：${
                new Date(item.created_at).toLocaleString() || ""
            }</p>
            <p class="card-text mb-0">聯繫電話：${item.tel || ""}</p>
            <p class="card-text mb-0">媽媽：${item.mother_mobile || ""}</p>
            <p class="card-text mb-0">爸爸：${item.father_mobile || ""}</p>
            <p class="card-text mb-0">詢問科目：${course_list.join(", ")}</p>
            <p class="card-text mb-0">追蹤日期：${
                academy_track_list.length > 0
                    ? new Date(
                          academy_track_list[0].updated_at
                      ).toLocaleString()
                    : ""
            }</p>
            <p class="card-text mb-0">追蹤內容：${
                academy_track_list.length
                    ? academy_track_list[0].track_content_create
                    : ""
            }</p>
          </div>
        </div>
        `;
    });
    element.innerHTML = htmlStr;
}

function toNote(id) {
    window.location.href = "note?id=" + id;
}

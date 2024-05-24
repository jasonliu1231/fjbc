window.addEventListener("load", async () => {
    // 當前時間
    const date = new Date();
    const today = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;
    document.querySelector("#dateStatr").value = today;
    document.querySelector("#dateEnd").value = today;

    searchAskacademytrack();
});

async function searchAskacademytrack() {
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

    let url = `api/askacademytrack?start_date=${dateStatr}&end_date=${dateEnd}`;
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
    const now = new Date();
    const element = document.querySelector("#list");
    element.innerHTML = "";
    let htmlStr = "";
    data.track_list.forEach((track) => {
        const time = new Date(track.track_time);
        const statusColor = track.status
            ? "text-success-emphasis bg-success-subtle"
            : time > now
            ? "text-warning-emphasis bg-warning-subtle"
            : "text-danger-emphasis bg-danger-subtle";
        htmlStr += `
      <tr onclick="getAskacademytrack(${
          track.id
      })" data-bs-toggle="modal" data-bs-target="#modal">
        <td class="${statusColor}">${
            track.status ? "已完成" : time > now ? "未完成" : "過期"
        }</td>
        <td class="${statusColor}">
        <div>${time.toLocaleDateString() || ""}</div>
        <div>${
            time.toLocaleTimeString("zh-TW", {
                hour12: false
            }) || ""
        }</div>
        </td>
        <td class="${statusColor}">${track.academy.student_name}</td>
        <td class="${statusColor}">${track.academy.Tel || ""}</td>
        <td class="${statusColor} text-truncate max-w-200">${
            track.track_content_create
        }</td>
      </tr>
      `;
    });
    element.innerHTML = htmlStr;
}

function creatCard(data) {
    const now = new Date();
    const element = document.querySelector("#list");
    element.innerHTML = "";
    let htmlStr = "";
    data.track_list.forEach((track) => {
        const time = new Date(track.track_time);
        const statusColor = track.status
            ? "text-success-emphasis bg-success-subtle"
            : time > now
            ? "text-warning-emphasis bg-warning-subtle"
            : "text-danger-emphasis bg-danger-subtle";
        const icon = track.status
            ? `<i class="bi bi-check-circle">已完成</i>`
            : time > now
            ? `<i class="bi bi-exclamation-circle">未完成</i>`
            : `<i class="bi bi-x-circle">過期</i>`;
        htmlStr += `
        <div class="card my-1 ${statusColor}" data-bs-toggle="modal" data-bs-target="#modal" onclick="getAskacademytrack(${
            track.id
        })">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <h5 class="card-title">${track.academy.student_name}</h5>
            <div>${icon}</div>
          </div>
          <h6 class="card-subtitle text-body-secondary">${time.toLocaleString()}</h6>
          <p class="card-text mb-0">聯繫電話：${track.academy.Tel || ""}</p>
          <p class="card-text mb-0">聯繫電話：${
              track.academy.mother_mobile || ""
          }</p>
          <p class="card-text mb-0">聯繫電話：${
              track.academy.father_mobile || ""
          }</p>
          <p class="card-text mb-0 text-truncate max-w-200"">追蹤內容：${
              track.track_content_create
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

async function getAskacademytrack(id) {
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    const { isOk, data } = await submitObjApi(
        `api/askacademytrack/${id}`,
        config
    );
    if (isOk) {
        document.querySelector("#modalLabel").innerHTML =
            data.academy.student_name;
        const body = `
      <div class="input-group">
          <span class="input-group-text">電話</span>
          <input type="text" class="form-control" readonly value="${
              data.academy.Tel || ""
          }">
      </div>
      <div class="input-group">
          <span class="input-group-text">家長1</span>
          <input type="text" class="form-control" readonly value="${
              data.academy.mother_mobile || ""
          }">
      </div>
      <div class="input-group">
          <span class="input-group-text">家長2</span>
          <input type="text" class="form-control" readonly value="${
              data.academy.father_mobile || ""
          }">
      </div>
      <div>追蹤時間：${new Date(data.track_time).toLocaleString()}</div>
      <div>追蹤內容：</div>
      <p>${data.track_content_create}</P>`;
        document.querySelector("#modalbody").innerHTML = body;
        let footer = `
      <div class="form-floating w-100">
          <textarea style="height: 100px" class="form-control" id="trackTextareaAns" ${
              data.status ? "readonly" : ""
          }>${data.track_content_update || ""}</textarea>
          <label for="askTextarea">追蹤紀錄</label>
      </div>
      <div class="d-flex justify-content-between w-100">
        <button type="button" class="btn btn-outline-success" onclick="toNote(${
            data.academy_id
        })">查詢資訊</button>`;
        if (!data.status) {
            footer += ` 
            <div class="d-flex align-items-center">
              <div class="form-check form-switch mx-1">
                  <input class="form-check-input" type="checkbox" role="switch" id="isFinish" checked>
                  <label class="form-check-label" for="isFinish">是否完成</label>
              </div>`;
            footer += `<button type="button" class="btn btn-outline-success" onclick="updateTrack(${data.id}, ${data.academy_id})">儲存</button>
              </div>`;
        }
        footer += `</div>`;
        document.querySelector("#modalfooter").innerHTML = footer;
    }
}

async function updateTrack(id, academy_id) {
    const trackTextareaAns = document.querySelector("#trackTextareaAns");
    trackTextareaAns.classList.remove("border");
    trackTextareaAns.classList.remove("border-danger");

    if (!trackTextareaAns.value) {
        trackTextareaAns.classList.add("border");
        trackTextareaAns.classList.add("border-danger");
        alert("追蹤事項不可以是空白");
        return;
    }
    const isChecked = document.querySelector("#isFinish").checked;
    const config = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            academy_id: academy_id,
            track_content_update: trackTextareaAns.value,
            status: isChecked
        })
    };

    const { isOk, data } = await submitObjApi(
        `api/askacademytrack/${id}`,
        config
    );
    if (isOk) {
        document.querySelector("#modalBtn").click();
        searchAskacademytrack();
    }
}

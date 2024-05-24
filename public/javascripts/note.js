let id = "";
let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;
let page = 0;
let isChanged = false;
let currentPageId = "";

// 繪圖相關 function
function createNewCanvas() {
    page++;
    let canvasContainer = document.getElementById("canvasContainer");
    let newCanvas = document.createElement("canvas");
    newCanvas.width = 700;
    newCanvas.height = 850;
    newCanvas.id = "canvas" + page;

    // 電腦
    newCanvas.onmousedown = startDrawing;
    newCanvas.onmousemove = draw;
    newCanvas.onmouseup = stopDrawing;
    newCanvas.onmouseleave = stopDrawing;

    // 平板
    newCanvas.ontouchstart = startDrawingTouch;
    newCanvas.ontouchmove = drawTouch;
    newCanvas.ontouchend = stopDrawing;

    if (isWeb) {
        canvasContainer.appendChild(newCanvas);
        createNewPage(page);
    }
}

function createNewPage(page) {
    let canvasPage = document.getElementById("canvasPage");
    let newPage = document.createElement("option");
    newPage.value = "canvas" + page;
    newPage.text = page;
    newPage.checked = true;
    canvasPage.appendChild(newPage);
    canvasPage.value = "canvas" + page;
    selectPage();
}

function selectPage() {
    const canvasList = document.querySelectorAll("canvas");
    const val = document.getElementById("canvasPage").value;
    canvasList.forEach((canvas) => {
        if (canvas.id == val) {
            canvas.style.display = "";
        } else {
            canvas.style.display = "none";
        }
    });
    if (isChanged) {
        saveAsImage(currentPageId);
        isChanged = false;
    }
}

function startDrawing(event) {
    isDrawing = true;
    [lastX, lastY] = [event.offsetX, event.offsetY];
}

function draw(event) {
    if (!isDrawing) return;
    const ctx = event.target.getContext("2d");
    ctx.strokeStyle = isErasing
        ? "white"
        : document.querySelector("#color").value;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = document.querySelector("#size").value;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    [lastX, lastY] = [event.offsetX, event.offsetY];
    isChanged = true;
    currentPageId = event.target.id;
}

function startDrawingTouch(event) {
    isDrawing = true;
    const touch = event.touches[0];
    const rect = event.target.getBoundingClientRect();
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
}

function drawTouch(event) {
    event.preventDefault();
    if (!isDrawing) return;
    const ctx = event.target.getContext("2d");
    ctx.strokeStyle = isErasing
        ? "white"
        : document.querySelector("#color").value;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = document.querySelector("#size").value;
    const touch = event.touches[0];
    const rect = event.target.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    isChanged = true;
    currentPageId = event.target.id;
}

function stopDrawing() {
    isDrawing = false;
}

// window.addEventListener("resize", () => {
//     canvas.width = 700;
//     canvas.height = 850;
// });

// 繪圖筆
function drawButton() {
    isErasing = false;
}

// 橡皮擦
function clearButton() {
    isErasing = true;
}

// 一般 function
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get("id");
    getAskacademyInfo(id);
    getAskacademyImage(id);
});

async function getAskacademyInfo(id) {
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    const { isOk, data } = await submitObjApi(`api/askacademy/${id}`, config);
    if (isOk) {
        setAskclassTable(data, false);
    }
}

function setAskclassTable(data, disabled) {
    const itemNames = Object.keys(data);
    itemNames.forEach((itemName) => {
        if (
            itemName != "created_at" ||
            itemName != "course_list" ||
            itemName != "source_list" ||
            itemName != "english_listening" ||
            itemName != "inquiry_method"
        ) {
            const element = document.querySelector(`#${itemName}`);
            if (element != null) {
                if (disabled) {
                    element.setAttribute("disabled", "disabled");
                } else {
                    element.removeAttribute("disabled");
                }
                element.value = data[itemName];
            }
        }
        // 填表時間
        document.querySelector("#studentInfo").innerHTML =
            "填表日期：" +
            new Date(data.created_at || data.updated_at).toLocaleString();
        // 問班來源
        if (itemName == "source_list") {
            if (data[itemName].length > 0) {
                const source_list = document.querySelectorAll(".source_list");
                data[itemName].forEach((i) => {
                    source_list.forEach((e) => {
                        if (disabled) {
                            e.setAttribute("disabled", "disabled");
                        } else {
                            e.removeAttribute("disabled");
                        }
                        if (e.value == i.source_name) {
                            e.checked = true;
                        }
                    });
                });
            }
        }
        // 期望科目
        if (itemName == "course_list") {
            if (data[itemName].length > 0) {
                const course_list = document.querySelectorAll(".course_list");
                data[itemName].forEach((i) => {
                    course_list.forEach((e) => {
                        if (disabled) {
                            e.setAttribute("disabled", "disabled");
                        } else {
                            e.removeAttribute("disabled");
                        }
                        if (e.value == i.course_name) {
                            e.checked = true;
                        }
                    });
                });
            }
        }
        // 英聽成績
        if (itemName == "english_listening") {
            const english_listening = document.querySelectorAll(
                "input[name='english_listening']"
            );
            if (disabled) {
                english_listening.forEach((e) => {
                    e.setAttribute("disabled", "disabled");
                });
            } else {
                english_listening.forEach((e) => {
                    e.removeAttribute("disabled");
                });
            }
            if (data[itemName] != null) {
                document.querySelector(
                    `input[name="english_listening"][value="${data[itemName]}"]`
                ).checked = true;
            }
        }
        // 詢班方式
        if (itemName == "inquiry_method") {
            const inquiry_method = document.querySelectorAll(
                "input[name='inquiry_method']"
            );
            if (disabled) {
                inquiry_method.forEach((e) => {
                    e.setAttribute("disabled", "disabled");
                });
            } else {
                inquiry_method.forEach((e) => {
                    e.removeAttribute("disabled");
                });
            }
            if (data[itemName] != null) {
                document.querySelector(
                    `input[name="inquiry_method"][value="${data[itemName]}"]`
                ).checked = true;
            }
        }
    });
}

async function getAskacademyImage(id) {
    createNewCanvas();
    let config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    let { isOk, data } = await submitObjApi(
        `api/askacademy/image?ask_asademy_id=${id}&image_id=0`,
        config
    );
    if (isOk) {
        const len = data.counts;
        config = {
            method: "GET",
            responseType: "arraybuffer",
            headers: {
                // "Content-Type": "application/json",
            }
        };
        for (let i = 1; i <= len; i++) {
            // 如果多於一張圖表再新增一個畫布
            if (i > 1) {
                createNewCanvas();
            }
            let { isOk, data } = await submitImageApi(
                `api/askacademy/image?ask_asademy_id=${id}&image_id=${i}`,
                config
            );

            if (isOk && data.byteLength != 0) {
                const blob = new Blob([data], { type: "image/png" });
                const url = URL.createObjectURL(blob);

                const img = new Image();
                img.onload = function () {
                    // TODO: 需要修改，用迴圈插入結果
                    const canvas = document.getElementById(`canvas${i}`);
                    const ctx = canvas.getContext("2d");
                    canvas.width = 700;
                    canvas.height = 850;
                    ctx.drawImage(img, 0, 0);
                };
                setTimeout(function () {
                    img.src = url;
                }, 1000);
            }
        }
    }
}

function sizeChange() {
    size = document.querySelector("#size").value;
}

function colorChange() {
    textColor = document.querySelector("#color").value;
}

// 保存 Canvas 内容
function saveAsImage(currentPageId) {
    const index = currentPageId.substring(6); // 切割取得數字
    const canvas = document.getElementById(currentPageId);
    canvas.toBlob(async function (blob) {
        const file = new File([blob], "canvas_image.png", {
            type: "image/png"
        });
        let formData = new FormData();
        formData.append("uploaded_file", file);
        const config = {
            method: "POST",
            headers: {
                // 設定後要自行設定邊界。所以註解掉
                // "Content-Type": "multipart/form-data",
            },
            body: formData
        };
        const { isOk, data } = await submitObjApi(
            `api/askacademy/image?ask_asademy_id=${id}&image_id=${index}`,
            config
        );
    });
}

async function submit() {
    // 基本資料
    const student_name = document.querySelector("#student_name").value || null;
    if (!student_name) {
        alert("請填寫學生姓名");
        return;
    }
    const student_name_en =
        document.querySelector("#student_name_en").value || null;
    const student_mobile =
        document.querySelector("#student_mobile").value || null;
    const school = document.querySelector("#school").value || null;
    const grade = document.querySelector("#grade").value || null;
    const tel = document.querySelector("#tel").value || null;
    const address = document.querySelector("#address").value || null;
    const father_name = document.querySelector("#father_name").value || null;
    const father_mobile =
        document.querySelector("#father_mobile").value || null;
    const father_profession =
        document.querySelector("#father_profession").value || null;
    const father_office_tel =
        document.querySelector("#father_office_tel").value || null;
    const mother_name = document.querySelector("#mother_name").value || null;
    const mother_mobile =
        document.querySelector("#mother_mobile").value || null;
    const mother_profession =
        document.querySelector("#mother_profession").value || null;
    const mother_office_tel =
        document.querySelector("#mother_office_tel").value || null;
    const holiday_time = document.querySelector("#holiday_time").value || null;
    const Weekday_time = document.querySelector("#Weekday_time").value || null;
    const brother1 = document.querySelector("#brother1").value || null;
    const brother1_grade =
        document.querySelector("#brother1_grade").value || null;
    const brother2 = document.querySelector("#brother2").value || null;
    const brother2_grade =
        document.querySelector("#brother2_grade").value || null;

    // 興趣班級
    const course_list_selected = document.querySelectorAll(".course_list");
    const course_list = [];
    course_list_selected.forEach((item) => {
        if (item.checked) {
            course_list.push({
                course_name: item.value || null
            });
        }
    });
    const course_extend =
        document.querySelector("#course_extend").value || null;

    // 問班來源
    const source_list_selected = document.querySelectorAll(".source_list");
    const source_list = [];
    source_list_selected.forEach((item) => {
        if (item.checked) {
            source_list.push({
                source_name: item.value || null
            });
        }
    });

    // 學生狀況
    const exam_ranking = document.querySelector("#exam_ranking").value || null;
    const exam_ranking1 =
        document.querySelector("#exam_ranking1").value || null;
    const exam_ranking2 =
        document.querySelector("#exam_ranking2").value || null;
    const chinese_score =
        document.querySelector("#chinese_score").value || null;
    const math_score = document.querySelector("#math_score").value || null;
    const english_score =
        document.querySelector("#english_score").value || null;
    const english_listening = document.querySelector(
        "input[name='english_listening']:checked"
    )
        ? document.querySelector("input[name='english_listening']:checked")
              .value
        : null;
    const enature_score =
        document.querySelector("#enature_score").value || null;
    const biology_score =
        document.querySelector("#biology_score").value || null;
    const physics_score =
        document.querySelector("#physics_score").value || null;
    const chemical_score =
        document.querySelector("#chemical_score").value || null;
    const earth_science_score =
        document.querySelector("#earth_science_score").value || null;
    const physics_chemical_score =
        document.querySelector("#physics_chemical_score").value || null;
    const social_score = document.querySelector("#social_score").value || null;
    const geography_score =
        document.querySelector("#geography_score").value || null;
    const history_score =
        document.querySelector("#history_score").value || null;
    const civics_score = document.querySelector("#civics_score").value || null;

    // 課程表
    const activity_status1 =
        document.querySelector("#activity_status1").value || null;
    const activity_status2 =
        document.querySelector("#activity_status2").value || null;
    const activity_status3 =
        document.querySelector("#activity_status3").value || null;
    const activity_status4 =
        document.querySelector("#activity_status4").value || null;
    const activity_status5 =
        document.querySelector("#activity_status5").value || null;
    const activity_status6_1 =
        document.querySelector("#activity_status6_1").value || null;
    const activity_status6_2 =
        document.querySelector("#activity_status6_2").value || null;
    const activity_status6_3 =
        document.querySelector("#activity_status6_3").value || null;
    const activity_status7_1 =
        document.querySelector("#activity_status7_1").value || null;
    const activity_status7_2 =
        document.querySelector("#activity_status7_2").value || null;
    const activity_status7_3 =
        document.querySelector("#activity_status7_3").value || null;
    const inquiry_method = document.querySelector(
        "input[name='inquiry_method']:checked"
    )
        ? document.querySelector("input[name='inquiry_method']:checked").value
        : null;
    const reception = document.querySelector("#reception").value || null;

    const info = {
        student_name,
        student_name_en,
        student_mobile,
        tel,
        school,
        grade,
        address,
        brother1,
        brother1_grade,
        brother2,
        brother2_grade,
        father_name,
        father_mobile,
        father_office_tel,
        father_profession,
        mother_name,
        mother_mobile,
        mother_office_tel,
        mother_profession,
        holiday_time,
        Weekday_time,
        // Remark,
        course_extend,
        exam_ranking,
        exam_ranking1,
        exam_ranking2,
        chinese_score,
        math_score,
        english_score,
        english_listening,
        enature_score,
        biology_score,
        physics_score,
        chemical_score,
        earth_science_score,
        physics_chemical_score,
        social_score,
        geography_score,
        history_score,
        civics_score,
        activity_status1,
        activity_status2,
        activity_status3,
        activity_status4,
        activity_status5,
        activity_status6_1,
        activity_status6_2,
        activity_status6_3,
        activity_status7_1,
        activity_status7_2,
        activity_status7_3,
        inquiry_method,
        reception,
        course_list,
        source_list
    };
    if (isChanged) {
        saveAsImage(currentPageId); // 固定存取當前畫布
    }
    const config = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    };
    const { isOk, data } = await submitObjApi(`api/askacademy/${id}`, config);
    if (isOk) {
        window.location.reload();
    }
}

async function setTrackModal() {
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    const { isOk, data } = await submitObjApi(
        `api/askacademytrack?academy_id=${id}`,
        config
    );

    // 生成表格
    const table = document.createElement("table");
    table.className = "table table-hover";
    const thead = document.createElement("thead");
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let th = document.createElement("th");
    tr.appendChild(th);
    th.textContent = "狀態";
    th.className = "w-20";
    th = document.createElement("th");
    tr.appendChild(th);
    th.textContent = "時間";
    th.className = "w-20";
    th = document.createElement("th");
    tr.appendChild(th);
    th.textContent = "追蹤內容";

    const now = new Date();
    if (isOk && data.count > 0) {
        const track_list = data.track_list;
        track_list.forEach((track) => {
            const time = new Date(track.track_time);
            const statusColor = track.status
                ? "text-success-emphasis bg-success-subtle"
                : time > now
                ? "text-warning-emphasis bg-warning-subtle"
                : "text-danger-emphasis bg-danger-subtle";
            tr = document.createElement("tr");
            tbody.appendChild(tr);
            tr.setAttribute("data-bs-target", "#modal2");
            tr.setAttribute("data-bs-toggle", "modal");
            tr.onclick = () => getAskacademytrack(track.id);
            let td = document.createElement("td");
            tr.appendChild(td);
            td.className = statusColor;
            td.textContent = track.status
                ? "已完成"
                : time > now
                ? "未完成"
                : "過期";

            td = document.createElement("td");
            tr.appendChild(td);
            td.className = statusColor;
            let div = document.createElement("div");
            td.appendChild(div);
            div.textContent = time.toLocaleDateString();
            div = document.createElement("div");
            td.appendChild(div);
            div.textContent = time.toLocaleTimeString("zh-TW", {
                hour12: false
            });

            td = document.createElement("td");
            tr.appendChild(td);
            td.className = statusColor + " text-truncate max-w-200";
            td.textContent = track.track_content_create;
        });
    }
    document.querySelector("#modalLabel").innerHTML = "追蹤紀錄";
    document.querySelector("#modalbody").innerHTML = "";
    document.querySelector("#modalbody").appendChild(table);
    document.querySelector("#modalfooter").innerHTML = `
    <div class="form-floating w-100">
        <textarea class="form-control" id="trackTextarea"></textarea>
        <label for="trackTextarea">追蹤事項</label>
    </div>
    <div class="input-group w-100">
        <span class="input-group-text">追蹤時間</span>
        <input type="datetime-local" class="form-control" aria-label="Username" aria-describedby="trackTime" id="trackTime">
    </div>
    <button type="button" class="btn btn-outline-success" onclick="addAskacademytrack()">新增追蹤</button>
    `;
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
        document.querySelector("#modalLabel2").innerHTML =
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
        document.querySelector("#modalbody2").innerHTML = body;
        let footer = `
        <div class="form-floating w-100">
            <textarea style="height: 100px" class="form-control" id="trackTextareaAns" ${
                data.status ? "readonly" : ""
            }>${data.track_content_update || ""}</textarea>
            <label for="askTextarea">追蹤紀錄</label>
        </div>`;
        if (!data.status) {
            footer += ` 
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="isFinish" checked>
                <label class="form-check-label" for="isFinish">是否完成</label>
            </div>`;
            footer += `<button type="button" class="btn btn-outline-success" onclick="updateTrack(${data.id}, ${data.academy_id})">儲存</button>`;
        }
        document.querySelector("#modalfooter2").innerHTML = footer;
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
        document.querySelector("#modalBtn2").click();
        setTrackModal();
    }
}

async function addAskacademytrack() {
    const trackTextarea = document.querySelector("#trackTextarea");
    trackTextarea.classList.remove("border");
    trackTextarea.classList.remove("border-danger");
    const trackTime = document.querySelector("#trackTime");
    trackTime.classList.remove("border");
    trackTime.classList.remove("border-danger");

    if (!trackTextarea.value) {
        trackTextarea.classList.add("border");
        trackTextarea.classList.add("border-danger");
        alert("追蹤事項不可以是空白");
        return;
    }

    if (!trackTime.value) {
        trackTime.classList.add("border");
        trackTime.classList.add("border-danger");
        alert("請確定追蹤時間");
        return;
    }

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            academy_id: id,
            track_content_create: trackTextarea.value,
            track_time: trackTime.value
        })
    };

    const { isOk, data } = await submitObjApi("api/askacademytrack", config);
    if (isOk) {
        document.querySelector("#modalBtn").click();
    }
}

async function setAskclassModal() {
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    const { isOk, data } = await submitObjApi(
        `api/askacademyrecord?academy_id=${id}`,
        config
    );

    // 生成表格
    const table = document.createElement("table");
    table.className = "table table-hover";
    const thead = document.createElement("thead");
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let th = document.createElement("th");
    tr.appendChild(th);
    th.textContent = "接待人";
    th.className = "w-20";
    th = document.createElement("th");
    tr.appendChild(th);
    th.textContent = "時間";
    th.className = "w-20";
    th = document.createElement("th");
    tr.appendChild(th);
    th.textContent = "追蹤內容";

    if (isOk && data.count > 0) {
        const AskAcademy_list = data.AskAcademy_list;
        AskAcademy_list.forEach((academy) => {
            const time = new Date(academy.created_at);
            tr = document.createElement("tr");
            tbody.appendChild(tr);
            tr.setAttribute("data-bs-target", "#modal2");
            tr.setAttribute("data-bs-toggle", "modal");
            tr.onclick = () => getAskacademyrecord(academy.id);
            let td = document.createElement("td");
            tr.appendChild(td);
            td.textContent = academy.builder;

            td = document.createElement("td");
            tr.appendChild(td);
            let div = document.createElement("div");
            td.appendChild(div);
            div.textContent = time.toLocaleDateString();
            div = document.createElement("div");
            td.appendChild(div);
            div.textContent = time.toLocaleTimeString("zh-TW", {
                hour12: false
            });

            td = document.createElement("td");
            tr.appendChild(td);
            td.className = "text-truncate max-w-200";
            td.textContent = academy.content;
        });
    }
    document.querySelector("#modalLabel").innerHTML = "問班紀錄";
    document.querySelector("#modalbody").innerHTML = "";
    document.querySelector("#modalbody").appendChild(table);
    document.querySelector("#modalfooter").innerHTML = `
    <div class="form-floating w-100">
        <textarea class="form-control" id="askTextarea"></textarea>
        <label for="askTextarea">問班紀錄</label>
    </div>
    <button type="button" class="btn btn-outline-success" onclick="addAskAcademy()">新增紀錄</button>
    `;
}

async function getAskacademyrecord(id) {
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    const { isOk, data } = await submitObjApi(
        `api/askacademyrecord/${id}`,
        config
    );
    if (isOk) {
        console.log(data);
        document.querySelector("#modalLabel2").innerHTML = data.builder;
        document.querySelector("#modalbody2").innerHTML = data.content;
        document.querySelector("#modalfooter2").innerHTML = new Date(
            data.created_at
        ).toLocaleString();
    }
}

async function addAskAcademy() {
    const askTextarea = document.querySelector("#askTextarea");
    askTextarea.classList.remove("border");
    askTextarea.classList.remove("border-danger");

    if (!askTextarea.value) {
        askTextarea.classList.add("border");
        askTextarea.classList.add("border-danger");
        alert("追蹤事項不可以是空白");
        return;
    }

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            academy_id: id,
            content: askTextarea.value
        })
    };

    const { isOk, data } = await submitObjApi("api/askacademyrecord", config);
    if (isOk) {
        document.querySelector("#modalBtn").click();
    }
}

async function setChangeModal() {
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    const { isOk, data } = await submitObjApi(
        `api/askacademyupdate?academy_id=${id}`,
        config
    );

    // 生成表格
    const table = document.createElement("table");
    table.className = "table table-hover";
    const thead = document.createElement("thead");
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let th = document.createElement("th");
    tr.appendChild(th);
    th.textContent = "修改人";
    th.className = "w-25";
    th = document.createElement("th");
    tr.appendChild(th);
    th.textContent = "時間";
    th.className = "w-75";

    if (isOk && data.count > 0) {
        const AskAcademy_list = data.AskAcademy_list;
        AskAcademy_list.forEach((academy) => {
            const time = new Date(academy.updated_at);
            tr = document.createElement("tr");
            tbody.appendChild(tr);
            let td = document.createElement("td");
            tr.appendChild(td);
            tr.onclick = () => getAskacademyupdate(academy.id);
            td.textContent = academy.builder;

            td = document.createElement("td");
            tr.appendChild(td);
            td.textContent = time.toLocaleString("zh-TW", {
                hour12: false
            });
        });
    }

    document.querySelector("#modalLabel").innerHTML = "修改紀錄";
    document.querySelector("#modalbody").innerHTML = "";
    document.querySelector("#modalbody").appendChild(table);
    document.querySelector(
        "#modalfooter"
    ).innerHTML = `<button type="button" class="btn btn-outline-info" onclick="resetPage()"><i class="bi bi-arrow-repeat"></i></button>`;
}

async function getAskacademyupdate(id) {
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    const { isOk, data } = await submitObjApi(
        `api/askacademyupdate/${id}`,
        config
    );
    if (isOk) {
        setAskclassTable(data, true);
        document.querySelector("#modalBtn").click();
    }
}

async function resetPage() {
    getAskacademyInfo(id);
    document.querySelector("#modalBtn").click();
}

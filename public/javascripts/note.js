let id = "";
let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;
let page = 0;

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

    canvasContainer.appendChild(newCanvas);
    createNewPage(page);
}

function createNewPage(page) {
    let canvasPage = document.getElementById("canvasPage");
    let newPage = document.createElement("option");
    newPage.value = "canvas" + page;
    newPage.text = page;
    newPage.checked = true;
    canvasPage.appendChild(newPage);
    canvasPage.value = "canvas" + page;
    selectPage()
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
}

function stopDrawing() {
    isDrawing = false;
}

window.addEventListener("resize", () => {
    canvas.width = 700;
    canvas.height = 850;
});

// 繪圖筆
function drawButton() {
    isErasing = false;
}

// 橡皮擦
function clearButton() {
    isErasing = true;
}

window.addEventListener("load", () => {
    const w = window.innerWidth;
    if (w < 500) {
        const e = document.querySelectorAll(".input-group");
        e.forEach((i) => {
            i.classList.remove("input-group");
        });
        document.querySelector("#canvasbtn").remove();
    }
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
                    element.value = data[itemName];
                }
            }
            // 填表時間
            document.querySelector("#studentInfo").innerHTML =
                "填表日期：" + new Date(data.created_at).toLocaleString();
            // 問班來源
            if (itemName == "source_list") {
                if (data[itemName].length > 0) {
                    const source_list =
                        document.querySelectorAll(".source_list");
                    data[itemName].forEach((i) => {
                        source_list.forEach((e) => {
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
                    const course_list =
                        document.querySelectorAll(".course_list");
                    data[itemName].forEach((i) => {
                        course_list.forEach((e) => {
                            if (e.value == i.course_name) {
                                e.checked = true;
                            }
                        });
                    });
                }
            }
            // 英聽成績
            if (itemName == "english_listening") {
                if (data[itemName] != null) {
                    document.querySelector(
                        `input[name="english_listening"][value="${data[itemName]}"]`
                    ).checked = true;
                }
            }
            // 詢班方式
            if (itemName == "inquiry_method") {
                if (data[itemName] != null) {
                    document.querySelector(
                        `input[name="inquiry_method"][value="${data[itemName]}"]`
                    ).checked = true;
                }
            }
        });
    }
}

async function getAskacademyImage(id) {
    createNewCanvas(); // 新增一個預設表
    const config = {
        method: "GET",
        responseType: "arraybuffer",
        headers: {
            // "Content-Type": "application/json",
        }
    };
    const { isOk, data } = await submitImageApi(
        `api/askacademy/image/${id}`,
        config
    );

    if (isOk && data.byteLength != 0) {
        const blob = new Blob([data], { type: "image/png" });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = function () {
            // TODO: 需要修改，用迴圈插入結果
            const canvas = document.getElementById("canvas1");
            const ctx = canvas.getContext("2d");
            canvas.width = 700;
            canvas.height = 850;
            ctx.drawImage(img, 0, 0);
        };
        setTimeout(function () {
            img.src = url;
        }, 2000);
    }
}

function sizeChange() {
    size = document.querySelector("#size").value;
}

function colorChange() {
    textColor = document.querySelector("#color").value;
}

// 保存 Canvas 内容
function saveAsImage() {
    const canvas = document.getElementById("myCanvas");
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
            `api/askacademy/image/${id}`,
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
    saveAsImage();
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
let sampleBody = `<table class="table">
<thead>
  <tr>
    <th>時間</th>
    <th>內容</th>
    <th>修改者</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th>2024/5/17 下午4:09:52</th>
    <th>...</th>
    <th>員工Ａ</th>
  </tr>
  <tr>
    <th>2024/5/17 下午4:09:52</th>
    <th>...</th>
    <th>員工Ａ</th>
  </tr>
  <tr>
    <th>2024/5/17 下午4:09:52</th>
    <th>...</th>
    <th>員工Ａ</th>
  </tr>
</tbody>
</table>`;
async function setTrackModal() {
    document.querySelector("#modalLabel").innerHTML = "追蹤紀錄";
    document.querySelector("#modalbody").innerHTML = sampleBody;
    document.querySelector("#modalfooter").innerHTML = `
    <div class="form-floating w-100">
        <textarea class="form-control" id="trackTextarea"></textarea>
        <label for="trackTextarea">追蹤事項</label>
    </div>
    <div class="input-group w-100">
        <span class="input-group-text" id="trackTime">追蹤時間</span>
        <input type="datetime-local" class="form-control" aria-label="Username" aria-describedby="trackTime">
    </div>
    <button type="button" class="btn btn-outline-success">新增追蹤</button>
    `;
}

async function setAskclassModal() {
    document.querySelector("#modalLabel").innerHTML = "問班紀錄";
    document.querySelector("#modalbody").innerHTML = sampleBody;
    document.querySelector("#modalfooter").innerHTML = `
    <div class="form-floating w-100">
        <textarea class="form-control" id="askTextarea"></textarea>
        <label for="askTextarea">問班紀錄</label>
    </div>
    <button type="button" class="btn btn-outline-success">新增紀錄</button>
    `;
}

async function setChangeModal() {
    document.querySelector("#modalLabel").innerHTML = "修改紀錄";
    document.querySelector("#modalbody").innerHTML = sampleBody;
    document.querySelector("#modalfooter").innerHTML = "";
}

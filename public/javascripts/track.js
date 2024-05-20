window.addEventListener("load", async () => {
    const w = window.innerWidth;
    if (w < 500) {
        const e = document.querySelectorAll(".input-group");
        e.forEach((i) => {
            i.classList.remove("input-group");
        });
    }
    // 當前時間
    const date = new Date();
    const today = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;
    document.querySelector("#dateStatr").value = today;
    document.querySelector("#dateEnd").value = today;

    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    // const { isOk, data } = await submitObjApi("api/askacademy", config);

    // if (isOk) {
    //     creatTable(data);
    // }
});
let sampleBody = `<div class="input-group">
<span class="input-group-text" id="school">學校</span>
<input type="text" class="form-control" aria-describedby="school" readonly>
<span class="input-group-text" id="Tel">電話</span>
<input type="text" class="form-control" aria-describedby="Tel" readonly>
</div>
<div class="input-group">
<span class="input-group-text" id="mother_name">媽媽</span>
<input type="text" class="form-control" aria-describedby="mother_name" readonly>
<span class="input-group-text" id="mother_mobile">手機</span>
<input type="text" class="form-control" aria-describedby="mother_mobile" readonly>
</div>
<div class="input-group">
<span class="input-group-text" id="father_name">爸爸</span>
<input type="text" class="form-control" aria-describedby="father_name" readonly>
<span class="input-group-text" id="father_mobile">手機</span>
<input type="text" class="form-control" aria-describedby="father_mobile" readonly>
</div>
<div class="input-group">
<span class="input-group-text" id="Weekday_time">平日</span>
<input type="text" class="form-control" aria-describedby="Weekday_time" readonly>
<span class="input-group-text" id="holiday_time">假日</span>
<input type="text" class="form-control" aria-describedby="holiday_time" readonly>
</div>
<table class="table">
<thead>
  <tr>
    <th>日期</th>
    <th>追蹤</th>
    <th>結果</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>2024/5/17 下午4:09:52</td>
    <td>煎餅訂單20個</td>
    <td>已交付</td>
  </tr>
  <tr>
    <td>2024/5/11 下午4:09:52</td>
    <td>煎餅訂單160個</td>
    <td>已交付100個，尚欠60個</td>
  </tr>
  <tr>
    <td>2024/5/7 下午4:09:52</td>
    <td>煎餅訂單30個</td>
    <td>已交付，尚未付款</td>
  </tr>
</tbody>
</table>`
function trackModal() {
    document.querySelector("#modalLabel").innerHTML = "學生姓名";
    document.querySelector("#modalbody").innerHTML = sampleBody;
    // 如果完成將只能讀不能存
    document.querySelector("#modalfooter").innerHTML = `
    <div class="form-floating w-100">
        <textarea class="form-control" id="askTextarea"></textarea>
        <label for="askTextarea">追蹤紀錄</label>
    </div>
    <button type="button" class="btn btn-outline-success">追蹤完成</button>
    `;
}
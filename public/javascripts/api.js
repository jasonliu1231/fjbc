// 路徑
const url = "http://172.16.150.25:8081";

async function submitObjApi(routes, config) {
    const response = await fetch(`${url}/${routes}`, config);
    const isOk = response.ok;
    let data = {};
    if (isOk) {
        data = await response.json();
    }

    return { isOk, data };
}

async function submitImageApi(routes, config) {
    const response = await fetch(`${url}/${routes}`, config);
    const isOk = response.ok;
    let data = {};
    if (isOk) {
        data = await response.arrayBuffer();
    }

    return { isOk, data };
}

// 裝置
let isWeb = window.innerWidth > 450;

async function submitObjApi(routes, config) {
    const response = await fetch(`${routes}`, config);
    const isOk = response.ok;
    let data = {};
    if (isOk) {
        data = await response.json();
    }

    return { isOk, data };
}

async function submitImageApi(routes, config) {
    const response = await fetch(`${routes}`, config);
    const isOk = response.ok;
    let data = {};
    if (isOk) {
        data = await response.arrayBuffer();
    }

    return { isOk, data };
}

function logout() {
    const config = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    fetch(logurl + "/api/auth/logout", config);
}

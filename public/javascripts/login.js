async function login() {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    const url = logurl + `/api/auth/login`;
    let formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    };

    const { isOk, data } = await submitObjApi(url, config);
    if (isOk) {
        saveToken(data);
    } else {
        document.querySelector("#passwordHelpBlock").classList.remove("hidden");
    }
}

async function saveToken(data) {
    const isWeb = window.innerWidth > 450;
    const response = await fetch(
        `/api/steDevice?isWeb=${isWeb}&token=${data.access_token}&name=${
            data.user.profile.first_name + data.user.profile.last_name
        }`,
        {
            method: "GET"
        }
    );
    if (response.ok) {
        window.location.href = `/admin/track`;
    }
}

async function login() {
    const isWeb = window.innerWidth > 450;
    const response = await fetch(`/api/steDevice?isWeb=${isWeb}`, {
        method: "GET"
    });
    if (response.ok) {
        window.location.href = `/admin/track`;
    }
}

async function getToken() {
    const clientId = "35d72b43f9c74d43a3ecd2c1044d9697";
    const clientSecret = "c5f71a30a6d74d1f870c19326122ac53";

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
        },
        body: "grant_type=client_credentials"
    });

    const data = await response.json();
    return data.access_token;
}

async function searchTrack(query) {
    const token = await getToken();

    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await response.json();
    console.log(data.tracks.items);
}

searchTrack("Kendrick Lamar");

function main() {
    getToken()
    searchTrack()
}

document.addEventListener("DOMContentLoaded", main())
async function sentimator(text) {
    let data = { text: text };
    let res = await fetch("https://sentim-api.herokuapp.com/api/v1/", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return res.json();
}
async function getHttp() {
    const text = document.getElementById("inputBar").value;
    let result = await sentimator(text);
    console.log("polarity:" + result["result"].polarity);
    console.log("type:" + result["result"].type);
    displayResultInDom(result["result"].polarity, result["result"].type);
}
document.getElementById("btn").addEventListener("click",getHttp)
getHttp()
"use strict";

const toast = async function (text_lines) {
    // Get the snackbar DIV
    const element = document.getElementById("toast");
    element.textContent = '';

    text_lines.forEach(line => {
        const div = document.createElement('div');
        div.textContent = line;
        element.appendChild(div);
    });

    // Add the "show" class to DIV
    element.classList.add("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        element.classList.remove("show"); 
    }, 3000);
};

const listener_set_cookies = async function (event) {
    const state = await window.electron_api.provider_set_cookies(this.dataset.providerId);
    console.log(state);
    toast(Object.entries(state).map((kv) => `${kv[0]}: ${kv[1]}`));
};

const main = async function () {
    document.querySelectorAll("[data-provider-action=set-cookies]")
    .forEach(element => element.addEventListener('click', listener_set_cookies));
    
    /*
    const state = await window.electron_api.get_gui_state();
    console.log(state);
    */
};

main();
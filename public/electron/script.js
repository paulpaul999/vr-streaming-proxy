"use strict";

const listener_set_cookies = async function (event) {
    window.electron_api.provider_set_cookies(event.target.dataset.providerId);
    const state = await window.electron_api.get_gui_state();
    console.log(state);
};

const main = async function () {
    document.querySelectorAll("[data-provider-action=set-cookies]")
    .forEach(element => element.addEventListener('click', listener_set_cookies));
};

main();
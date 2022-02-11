"use strict";

const listener_set_cookies = function (event) {
    window.electron_api.provider_set_cookies(this.dataset.providerId);
};

const main = async function () {
    document.querySelectorAll("[data-provider-action=set-cookies]")
    .forEach(element => element.addEventListener('click', listener_set_cookies));
};

main();
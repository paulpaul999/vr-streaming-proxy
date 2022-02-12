"use strict";

const add_children_by_list = function (parent, text_lines, tagname) {
    tagname = tagname || 'div'; 
    parent.textContent = '';
    return text_lines.map(line => {
        const div = document.createElement(tagname);
        div.textContent = line;
        parent.appendChild(div);
        return div;
    });
};

const toast = async function (text_lines) {
    // Get the snackbar DIV
    const element = document.getElementById("toast");
    add_children_by_list(element, text_lines);

    // Add the "show" class to DIV
    element.classList.add("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        element.classList.remove("show"); 
    }, 3000);
};

const update_view = async function () {
    const provider_id = 'slr';
    const state = await window.electron_api.get_gui_state();
    const status = state.providers[provider_id].status;
    const status_element = document.querySelector(`[data-provider-id=${provider_id}] div.status`);
    add_children_by_list(status_element, Object.entries(status).map(kv => `${kv[0]}: ${kv[1]}`));
    console.log(state);
};

const listener_set_cookies = async function (event) {
    const provider_id = this.dataset.providerId;
    const result = await window.electron_api.provider_set_cookies(provider_id);
    console.log(result);
    toast(result.msg);
    update_view();
};

const main = async function () {
    document.querySelectorAll("[data-provider-action=set-cookies]")
    .forEach(element => element.addEventListener('click', listener_set_cookies));
    
    /*
    const state = await window.electron_api.get_gui_state();
    console.log(state);
    */
    update_view();
};

main();
"use strict";

import { decode } from "./base64";

let container = null;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action !== "decode-select-text") {
        return;
    }
    if (!document.activeElement) return;
    doDecode();
});

function doDecode() {
    popup();
}

function getSelection() {
    const activeEl = document.activeElement;
    let selectedString;
    let range;
    if (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement) {
        range = new Range();
        selectedString = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
        // TODO
        return null;
    } else {
        const selection = window.getSelection();
        selectedString = selection.toString();
        range = selection.getRangeAt(0);
    }
    if (!selectedString) return null;
    const rect = range.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        content: selectedString,
    };
}

function convertPointFromViewportToNode(point, node) {
    if (typeof node.convertPointFromNode === "function") {
        return node.convertPointFromNode(point, document, {
            fromBox: "border",
            toBox: "border",
        });
    } else {
        const rect = node.getBoundingClientRect();
        return {
            x: point.x - rect.left,
            y: point.y - rect.top,
        };
    }
}

function detectPosition(rect, target) {
    const { top, bottom, left, width, height } = rect;
    const ancestor = getClosestPositionedAncestor();
    let { x, y } = convertPointFromViewportToNode({
        x: left,
        y: top,
    }, ancestor);
    const offsetBottom = document.documentElement.clientHeight - bottom;

    let placement = "bottom";
    if (offsetBottom < target.height && top > target.height) {
        placement = "top";
    }

    const ox = x + width / 2;
    x += (width - target.width) / 2;
    y = placement === "bottom" ? (y + height) : (y - target.height),
    x = Math.min(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - target.width, Math.max(0, x));

    return {
        placement,
        x,
        y,
        indicatorX: Math.max(0, ox - x - 18),
        width: target.width,
        height: target.height,
    };
}

function getClosestPositionedAncestor() {
    const body = document.body;
    if (window.getComputedStyle(body).position !== "static") {
        return body;
    } else {
        return document.documentElement;
    }
}

function decodeAndAppendTo(elem, content, encoding) {
    const FAILURE = `<p style="color: red; font-style: italic">解码失败，请检查所选的文本是否是 base64 编码的文本</p>`;
    let decoded;
    try {
        decoded = decode(content, encoding);
    } catch (ex) {
        console.error(ex);
    }
    if (decoded !== undefined) {
        elem.textContent = decoded;
    } else {
        elem.innerHTML = FAILURE;
    }
}
function createContentLayer(content) {
    const elem = document.createElement("div");
    const className = `__s2s-content-${Date.now()}__`;
    const html = `
        <div class="__s2d_handler__">
            <div class="__s2d_indicator__"></div>
        </div>
        <div class="__s2d-header-container__">
            <div class="__s2d-select-container__">
                <select>
                    <option value="UTF-8" selected>UTF-8</option>
                    <option value="hex">Hex</option>
                    <option value="gbk">GBK/GB2312</option>
                </select>
            </div>
            <div class="__s2d-copy-container__">
                <a class="__s2d-copy-btn__" title="复制到剪贴板">Copy</a>
            </div>
        </div>
        <div class="__s2d-content-conatiner__">
            <div class="${className}"></div>
        </div>
    `;
    elem.innerHTML = html;
    const select = elem.querySelector("select");
    const ct = elem.querySelector(`.${className}`);
    decodeAndAppendTo(ct, content);
    select.addEventListener("change", function (evt) {
        const encoding = evt.target.value;
        decodeAndAppendTo(ct, content, encoding);
    });
    const copyBtn = elem.querySelector(".__s2d-copy-btn__");
    copyBtn.addEventListener("click", function (evt) {
        const cls = "__s2d-copy-btn--copying__";
        copyBtn.classList.add(cls);
        evt.preventDefault();
        document.addEventListener("copy", function _(evt) {
            document.removeEventListener("copy", _);
            evt.preventDefault();
            evt.clipboardData.setData("text/plain", ct.textContent);
            copyBtn.classList.remove(cls);
        });
        document.execCommand("copy");
    });
    return elem;
}

function createPopupUI() {
    const selection = getSelection();
    if (!selection) return;
    const layer = {
        width: 320,
        height: (7 * 1.8 + 0.5) * 14 + 38,
    };
    const pos = detectPosition(selection, layer);
    if (!container) {
        container = document.createElement("div");
        container.classList.add("__s2d-container__");
    } else {
        container.className = "__s2d-container__";
    }
    if (pos.placement === "top") {
        container.classList.add("__s2d-placement-top__");
    } else {
        container.classList.add("__s2d-placement-bottom__");
    }
    container.style.cssText = `
        left: ${pos.x}px;
        top: ${pos.y}px;
        width: ${pos.width}px;
        height: ${pos.height}px;
    `;
    const contentLayer = createContentLayer(selection.content);
    const indicator = contentLayer.querySelector(".__s2d_indicator__");
    indicator.style.left = `${pos.indicatorX}px`;
    container.innerHTML = "";
    container.appendChild(contentLayer);
    return container;
}

function resizeUI(container) {
    container.classList.add("__s2d-resizing__");
    const height = (4 * 1.8 + 0.5) * 14;
    const ct = container.querySelector(".__s2d-content-conatiner__");
    if (ct.clientHeight > height) return;
    const containerHeight = container.clientHeight;
    const nHeight = height + 38;
    if (container.classList.contains("__s2d-placement-top__")) {
        container.style.top = `${parseInt(container.style.top, 10) + (containerHeight - nHeight)}px`;
    }
    container.style.height = `${nHeight}px`;
    container.classList.remove("__s2d-resizing__");
}

function popup() {
    const container = createPopupUI();
    if (!container) return;
    document.body.appendChild(container);
    resizeUI(container);
    container.classList.add("__s2d-show__");
}

document.addEventListener("click", function (evt) {
    if (!container) return;
    const target = evt.target;
    if (!container.contains(target)) {
        container.classList.remove("__s2d-show__");
    }
});

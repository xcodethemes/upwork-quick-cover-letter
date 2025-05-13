/* eslint-disable no-undef */
console.log("Content script loaded!");

const getUrl = window.location.href;
console.log("check getUrl=>", getUrl);

const isApply = getUrl.includes("apply");
console.log("seee isApply==>", isApply);


!function(){"use strict";const e=e=>{const t=document.querySelector(".oc-bubble-chat"),n=document.querySelector(".oc-bubble-close");t&&n&&(t.style.display=e?"none":"flex",n.style.display=e?"flex":"none")},t=(e,t,n)=>{if("system"===t)return;const i=document.getElementById("oc-messages");if(!i)return;const s=document.createElement("div");s.classList.add("oc-message",t);const r=new Date(n||Date.now()).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});s.innerHTML=`\n    ${e}\n    <div class="oc-message-time">${r}</div>\n  `,i.appendChild(s),i.scrollTop=i.scrollHeight},n=(e,t)=>{const n=document.getElementById("oc-messages");if(!n)return;if(document.getElementById("oc-lead-form"))return;const{fieldsHTML:i,needsContact:s,hasServices:r}=(e=>{const t=[{code:"+91",flag:"🇮🇳",name:"India"},{code:"+1",flag:"🇺🇸",name:"USA/Canada"},{code:"+44",flag:"🇬🇧",name:"UK"},{code:"+61",flag:"🇦🇺",name:"Australia"},{code:"+971",flag:"🇦🇪",name:"UAE"},{code:"+65",flag:"🇸🇬",name:"Singapore"},{code:"+60",flag:"🇲🇾",name:"Malaysia"},{code:"+49",flag:"🇩🇪",name:"Germany"},{code:"+33",flag:"🇫🇷",name:"France"},{code:"+81",flag:"🇯🇵",name:"Japan"},{code:"+86",flag:"🇨🇳",name:"China"},{code:"+55",flag:"🇧🇷",name:"Brazil"},{code:"+27",flag:"🇿🇦",name:"South Africa"},{code:"+234",flag:"🇳🇬",name:"Nigeria"},{code:"+92",flag:"🇵🇰",name:"Pakistan"},{code:"+880",flag:"🇧🇩",name:"Bangladesh"}].map(e=>`<option value="${e.code}">${e.flag} ${e.code} ${e.name}</option>`).join(""),n=e?.email||e?.phone,i=e?.services?.length>0;let s="";if(!1!==e?.name&&(s+='<input class="oc-collect-input" type="text" id="oc-field-name" placeholder="Your full name *" />'),n&&(s+='\n      <div id="oc-contact-error" style="display:none;color:#DC2626;font-size:12px;padding:6px 10px;background:#FEE2E2;border-radius:6px;">\n        Please provide at least your email or phone number.\n      </div>\n    '),e?.email&&(s+='<input class="oc-collect-input" type="email" id="oc-field-email" placeholder="Email address" />'),e?.phone&&(s+=`\n      <div style="display:flex;gap:6px;align-items:center;">\n        <select id="oc-field-country" style="padding:10px 6px;border-radius:8px;border:1px solid #D1D5DB;font-size:13px;outline:none;background:#fff;color:#111827;cursor:pointer;flex-shrink:0;max-width:110px;">\n          ${t}\n        </select>\n        <input class="oc-collect-input" type="tel" id="oc-field-phone" placeholder="Phone number" style="flex:1;margin:0;" />\n      </div>\n    `),e?.company&&(s+='<input class="oc-collect-input" type="text" id="oc-field-company" placeholder="Company name" />'),e?.customEnabled&&e?.customQuestion&&!i&&(s+=`<input class="oc-collect-input" type="text" id="oc-field-custom" placeholder="${e.customQuestion}" />`),i){const t=`<p style="font-size:13px;font-weight:600;color:#374151;margin:4px 0 8px 0;">${e?.customEnabled&&e?.customQuestion?e.customQuestion:"Interested in:"}</p>`;"dropdown"===e.serviceSelectionType?s+=`\n        ${t}\n        <select id="oc-field-services" class="oc-collect-input" style="cursor:pointer;">\n          <option value="">Select a service...</option>\n          ${e.services.map(e=>`<option value="${e}">${e}</option>`).join("")}\n        </select>\n      `:s+=`\n        ${t}\n        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:10px 14px;display:flex;flex-direction:column;">\n          ${e.services.map((e,t)=>`\n        <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;cursor:pointer;padding:4px 0;">\n          <input type="checkbox" id="oc-service-${t}" value="${e}" style="width:16px;height:16px;accent-color:#4F46E5;cursor:pointer;flex-shrink:0;" />\n          ${e}\n        </label>\n      `).join("")}\n        </div>\n      `}return{fieldsHTML:s,needsContact:n,hasServices:i}})(e),o=document.createElement("div");o.classList.add("oc-collect-form"),o.id="oc-lead-form",o.innerHTML=`\n    ${i}\n    <div id="oc-lead-error" style="display:none;color:#DC2626;font-size:12px;padding:6px 10px;background:#FEE2E2;border-radius:6px;">\n      Please fill in your name to continue.\n    </div>\n    <button class="oc-collect-btn" id="oc-lead-submit">\n      Submit →\n    </button>\n  `,n.appendChild(o),n.scrollTop=n.scrollHeight,document.getElementById("oc-lead-submit").addEventListener("click",async()=>{const n=document.getElementById("oc-lead-submit");n&&(n.disabled=!0,n.textContent="Submitting..."),await(async(e,t,n,i)=>{const s=document.getElementById("oc-field-name")?.value?.trim(),r=document.getElementById("oc-field-email")?.value?.trim(),o=document.getElementById("oc-field-country")?.value||"",a=document.getElementById("oc-field-phone")?.value?.trim(),l=a?`${o} ${a}`:"",c=document.getElementById("oc-field-company")?.value?.trim(),h=document.getElementById("oc-field-custom")?.value?.trim();let d;if(t)if("dropdown"===e.serviceSelectionType)d=document.getElementById("oc-field-services")?.value||"";else{const t=e.services.filter((e,t)=>document.getElementById(`oc-service-${t}`)?.checked);d=t.length>0?t.join(", "):""}!1===e?.name||s?!n||r||l?await i({name:s,email:r,phone:l,company:c,custom:h,services:d}):document.getElementById("oc-contact-error").style.display="block":document.getElementById("oc-lead-error").style.display="block"})(e,r,s,t)})},i=()=>{const e=document.getElementById("oc-input"),t=document.getElementById("oc-send");e&&(e.disabled=!1,e.placeholder="Type a message...",e.style.backgroundColor="",e.style.color="",e.style.cursor="",e.focus()),t&&(t.disabled=!1,t.style.opacity="1")},s="${JSCORE_VERSION}",r=function(e,t){if(!e)throw o(t)},o=function(e){return new Error("Firebase Database ("+s+") INTERNAL ASSERT FAILED: "+e)},a=function(e){const t=[];let n=0;for(let i=0;i<e.length;i++){let s=e.charCodeAt(i);s<128?t[n++]=s:s<2048?(t[n++]=s>>6|192,t[n++]=63&s|128):55296==(64512&s)&&i+1<e.length&&56320==(64512&e.charCodeAt(i+1))?(s=65536+((1023&s)<<10)+(1023&e.charCodeAt(++i)),t[n++]=s>>18|240,t[n++]=s>>12&63|128,t[n++]=s>>6&63|128,t[n++]=63&s|128):(t[n++]=s>>12|224,t[n++]=s>>6&63|128,t[n++]=63&s|128)}return t},l={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let t=0;t<e.length;t+=3){const s=e[t],r=t+1<e.length,o=r?e[t+1]:0,a=t+2<e.length,l=a?e[t+2]:0,c=s>>2,h=(3&s)<<4|o>>4;let d=(15&o)<<2|l>>6,u=63&l;a||(u=64,r||(d=64)),i.push(n[c],n[h],n[d],n[u])}return i.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(a(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,i=0;for(;n<e.length;){const s=e[n++];if(s<128)t[i++]=String.fromCharCode(s);else if(s>191&&s<224){const r=e[n++];t[i++]=String.fromCharCode((31&s)<<6|63&r)}else if(s>239&&s<365){const r=((7&s)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[i++]=String.fromCharCode(55296+(r>>10)),t[i++]=String.fromCharCode(56320+(1023&r))}else{const r=e[n++],o=e[n++];t[i++]=String.fromCharCode((15&s)<<12|(63&r)<<6|63&o)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let t=0;t<e.length;){const s=n[e.charAt(t++)],r=t<e.length?n[e.charAt(t)]:0;++t;const o=t<e.length?n[e.charAt(t)]:64;++t;const a=t<e.length?n[e.charAt(t)]:64;if(++t,null==s||null==r||null==o||null==a)throw new c;const l=s<<2|r>>4;if(i.push(l),64!==o){const e=r<<4&240|o>>2;if(i.push(e),64!==a){const e=o<<6&192|a;i.push(e)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class c extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const h=function(e){const t=a(e);return l.encodeByteArray(t,!0)},d=function(e){return h(e).replace(/\./g,"")},u=function(e){try{return l.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
function p(e){return f(void 0,e)}function f(e,t){if(!(t instanceof Object))return t;switch(t.constructor){case Date:return new Date(t.getTime());case Object:void 0===e&&(e={});break;case Array:e=[];break;default:return t}for(const n in t)t.hasOwnProperty(n)&&_(n)&&(e[n]=f(e[n],t[n]));return e}function _(e){return"__proto__"!==e}
/**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
/**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
const m=()=>function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}().__FIREBASE_DEFAULTS__,g=()=>{try{return m()||(()=>{if("undefined"==typeof process||void 0===process.env)return;const e=process.env.__FIREBASE_DEFAULTS__;return e?JSON.parse(e):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}const t=e&&u(e[1]);return t&&JSON.parse(t)})()}catch(e){return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`)}},y=e=>{const t=(e=>g()?.emulatorHosts?.[e])(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const i=parseInt(t.substring(n+1),10);return"["===t[0]?[t.substring(1,n-1),i]:[t.substring(0,n),i]},v=()=>g()?.config;
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class b{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,n))}}}
/**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */function w(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}const C={};let I=!1;function E(e,t){if("undefined"==typeof window||"undefined"==typeof document||!w(window.location.host)||C[e]===t||C[e]||I)return;function n(e){return`__firebase__banner__${e}`}C[e]=t;const i="__firebase__banner",s=function(){const e={prod:[],emulator:[]};for(const t of Object.keys(C))C[t]?e.emulator.push(t):e.prod.push(t);return e}().prod.length>0;function r(){const e=document.createElement("span");return e.style.cursor="pointer",e.style.marginLeft="16px",e.style.fontSize="24px",e.innerHTML=" &times;",e.onclick=()=>{I=!0,function(){const e=document.getElementById(i);e&&e.remove()}()},e}function o(){const e=function(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),n=!0),{created:n,element:t}}(i),t=n("text"),o=document.getElementById(t)||document.createElement("span"),a=n("learnmore"),l=document.getElementById(a)||document.createElement("a"),c=n("preprendIcon"),h=document.getElementById(c)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(e.created){const t=e.element;!function(e){e.style.display="flex",e.style.background="#7faaf0",e.style.position="fixed",e.style.bottom="5px",e.style.left="5px",e.style.padding=".5em",e.style.borderRadius="5px",e.style.alignItems="center"}(t),function(e,t){e.setAttribute("id",t),e.innerText="Learn more",e.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",e.setAttribute("target","__blank"),e.style.paddingLeft="5px",e.style.textDecoration="underline"}(l,a);const n=r();!function(e,t){e.setAttribute("width","24"),e.setAttribute("id",t),e.setAttribute("height","24"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","none"),e.style.marginLeft="-6px"}(h,c),t.append(h,o,l,n),document.body.appendChild(t)}s?(o.innerText="Preview backend disconnected.",h.innerHTML='<g clip-path="url(#clip0_6013_33858)">\n<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6013_33858">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>'):(h.innerHTML='<g clip-path="url(#clip0_6083_34804)">\n<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6083_34804">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>',o.innerText="Preview backend running in this workspace."),o.setAttribute("id",t)}"loading"===document.readyState?window.addEventListener("DOMContentLoaded",o):o()}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */function x(){return"undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test("undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:"")}class T extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,T.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,k.prototype.create)}}class k{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],r=s?function(e,t){return e.replace(S,(e,n)=>{const i=t[n];return null!=i?String(i):`<${n}?>`})}(s,n):"Error",o=`${this.serviceName}: ${r} (${i}).`;return new T(i,o,n)}}const S=/\{\$([^}]+)}/g;
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */function N(e){return JSON.parse(e)}function P(e){return JSON.stringify(e)}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const R=function(e){let t={},n={},i={},s="";try{const r=e.split(".");t=N(u(r[0])||""),n=N(u(r[1])||""),s=r[2],i=n.d||{},delete n.d}catch(e){}return{header:t,claims:n,data:i,signature:s}};
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
function D(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function A(e,t){return Object.prototype.hasOwnProperty.call(e,t)?e[t]:void 0}function M(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function L(e,t,n){const i={};for(const s in e)Object.prototype.hasOwnProperty.call(e,s)&&(i[s]=t.call(n,e[s],s,e));return i}function F(e,t){if(e===t)return!0;const n=Object.keys(e),i=Object.keys(t);for(const s of n){if(!i.includes(s))return!1;const n=e[s],r=t[s];if(O(n)&&O(r)){if(!F(n,r))return!1}else if(n!==r)return!1}for(const e of i)if(!n.includes(e))return!1;return!0}function O(e){return null!==e&&"object"==typeof e}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class q{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=64,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const n=this.W_;if("string"==typeof e)for(let i=0;i<16;i++)n[i]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let i=0;i<16;i++)n[i]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let e=16;e<80;e++){const t=n[e-3]^n[e-8]^n[e-14]^n[e-16];n[e]=4294967295&(t<<1|t>>>31)}let i,s,r=this.chain_[0],o=this.chain_[1],a=this.chain_[2],l=this.chain_[3],c=this.chain_[4];for(let e=0;e<80;e++){e<40?e<20?(i=l^o&(a^l),s=1518500249):(i=o^a^l,s=1859775393):e<60?(i=o&a|l&(o|a),s=2400959708):(i=o^a^l,s=3395469782);const t=(r<<5|r>>>27)+i+c+s+n[e]&4294967295;c=l,l=a,a=4294967295&(o<<30|o>>>2),o=r,r=t}this.chain_[0]=this.chain_[0]+r&4294967295,this.chain_[1]=this.chain_[1]+o&4294967295,this.chain_[2]=this.chain_[2]+a&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(null==e)return;void 0===t&&(t=e.length);const n=t-this.blockSize;let i=0;const s=this.buf_;let r=this.inbuf_;for(;i<t;){if(0===r)for(;i<=n;)this.compress_(e,i),i+=this.blockSize;if("string"==typeof e){for(;i<t;)if(s[r]=e.charCodeAt(i),++r,++i,r===this.blockSize){this.compress_(s),r=0;break}}else for(;i<t;)if(s[r]=e[i],++r,++i,r===this.blockSize){this.compress_(s),r=0;break}}this.inbuf_=r,this.total_+=t}digest(){const e=[];let t=8*this.total_;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let e=this.blockSize-1;e>=56;e--)this.buf_[e]=255&t,t/=256;this.compress_(this.buf_);let n=0;for(let t=0;t<5;t++)for(let i=24;i>=0;i-=8)e[n]=this.chain_[t]>>i&255,++n;return e}}function B(e,t){return`${e} failed: ${t} argument `}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const W=function(e){let t=0;for(let n=0;n<e.length;n++){const i=e.charCodeAt(n);i<128?t++:i<2048?t+=2:i>=55296&&i<=56319?(t+=4,n++):t+=3}return t};
/**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
function U(e){return e&&e._delegate?e._delegate:e}class ${constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const H="[DEFAULT]";
/**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class z{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new b;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e?.identifier),n=e?.optional??!1;if(!this.isInitialized(t)&&!this.shouldAutoInitialize()){if(n)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:t})}catch(e){if(n)return null;throw e}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */(e))try{this.getOrInitializeService({instanceIdentifier:H})}catch(e){}for(const[e,t]of this.instancesDeferred.entries()){const n=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:n});t.resolve(e)}catch(e){}}}}clearInstance(e=H){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=H){return this.instances.has(e)}getOptions(e=H){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[e,t]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(e)&&t.resolve(i)}return i}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),i=this.onInitCallbacks.get(n)??new Set;i.add(e),this.onInitCallbacks.set(n,i);const s=this.instances.get(n);return s&&e(s,n),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(i=e,i===H?void 0:i),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}var i;return n||null}normalizeInstanceIdentifier(e=H){return this.component?this.component.multipleInstances?e:H:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class j{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new z(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */var V;!function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"}(V||(V={}));const Y={debug:V.DEBUG,verbose:V.VERBOSE,info:V.INFO,warn:V.WARN,error:V.ERROR,silent:V.SILENT},K=V.INFO,G={[V.DEBUG]:"log",[V.VERBOSE]:"log",[V.INFO]:"info",[V.WARN]:"warn",[V.ERROR]:"error"},Q=(e,t,...n)=>{if(t<e.logLevel)return;const i=(new Date).toISOString(),s=G[t];if(!s)throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);console[s](`[${i}]  ${e.name}:`,...n)};class J{constructor(e){this.name=e,this._logLevel=K,this._logHandler=Q,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in V))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?Y[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,V.DEBUG,...e),this._logHandler(this,V.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,V.VERBOSE,...e),this._logHandler(this,V.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,V.INFO,...e),this._logHandler(this,V.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,V.WARN,...e),this._logHandler(this,V.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,V.ERROR,...e),this._logHandler(this,V.ERROR,...e)}}let Z,X;const ee=new WeakMap,te=new WeakMap,ne=new WeakMap,ie=new WeakMap,se=new WeakMap;let re={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return te.get(e);if("objectStoreNames"===t)return e.objectStoreNames||ne.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return le(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function oe(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(X||(X=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(ce(this),t),le(ee.get(this))}:function(...t){return le(e.apply(ce(this),t))}:function(t,...n){const i=e.call(ce(this),t,...n);return ne.set(i,t.sort?t.sort():[t]),le(i)}}function ae(e){return"function"==typeof e?oe(e):(e instanceof IDBTransaction&&function(e){if(te.has(e))return;const t=new Promise((t,n)=>{const i=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",r),e.removeEventListener("abort",r)},s=()=>{t(),i()},r=()=>{n(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",s),e.addEventListener("error",r),e.addEventListener("abort",r)});te.set(e,t)}(e),t=e,(Z||(Z=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(e=>t instanceof e)?new Proxy(e,re):e);var t}function le(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const i=()=>{e.removeEventListener("success",s),e.removeEventListener("error",r)},s=()=>{t(le(e.result)),i()},r=()=>{n(e.error),i()};e.addEventListener("success",s),e.addEventListener("error",r)});return t.then(t=>{t instanceof IDBCursor&&ee.set(t,e)}).catch(()=>{}),se.set(t,e),t}(e);if(ie.has(e))return ie.get(e);const t=ae(e);return t!==e&&(ie.set(e,t),se.set(t,e)),t}const ce=e=>se.get(e);const he=["get","getKey","getAll","getAllKeys","count"],de=["put","add","delete","clear"],ue=new Map;function pe(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(ue.get(t))return ue.get(t);const n=t.replace(/FromIndex$/,""),i=t!==n,s=de.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!s&&!he.includes(n))return;const r=async function(e,...t){const r=this.transaction(e,s?"readwrite":"readonly");let o=r.store;return i&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),s&&r.done]))[0]};return ue.set(t,r),r}re=(e=>({...e,get:(t,n,i)=>pe(t,n)||e.get(t,n,i),has:(t,n)=>!!pe(t,n)||e.has(t,n)}))(re);
/**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class fe{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(function(e){const t=e.getComponent();return"VERSION"===t?.type}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}const _e="@firebase/app",me="0.14.9",ge=new J("@firebase/app"),ye="@firebase/app-compat",ve="@firebase/analytics-compat",be="@firebase/analytics",we="@firebase/app-check-compat",Ce="@firebase/app-check",Ie="@firebase/auth",Ee="@firebase/auth-compat",xe="@firebase/database",Te="@firebase/data-connect",ke="@firebase/database-compat",Se="@firebase/functions",Ne="@firebase/functions-compat",Pe="@firebase/installations",Re="@firebase/installations-compat",De="@firebase/messaging",Ae="@firebase/messaging-compat",Me="@firebase/performance",Le="@firebase/performance-compat",Fe="@firebase/remote-config",Oe="@firebase/remote-config-compat",qe="@firebase/storage",Be="@firebase/storage-compat",We="@firebase/firestore",Ue="@firebase/ai",$e="@firebase/firestore-compat",He="firebase",ze="[DEFAULT]",je={[_e]:"fire-core",[ye]:"fire-core-compat",[be]:"fire-analytics",[ve]:"fire-analytics-compat",[Ce]:"fire-app-check",[we]:"fire-app-check-compat",[Ie]:"fire-auth",[Ee]:"fire-auth-compat",[xe]:"fire-rtdb",[Te]:"fire-data-connect",[ke]:"fire-rtdb-compat",[Se]:"fire-fn",[Ne]:"fire-fn-compat",[Pe]:"fire-iid",[Re]:"fire-iid-compat",[De]:"fire-fcm",[Ae]:"fire-fcm-compat",[Me]:"fire-perf",[Le]:"fire-perf-compat",[Fe]:"fire-rc",[Oe]:"fire-rc-compat",[qe]:"fire-gcs",[Be]:"fire-gcs-compat",[We]:"fire-fst",[$e]:"fire-fst-compat",[Ue]:"fire-vertex","fire-js":"fire-js",[He]:"fire-js-all"},Ve=new Map,Ye=new Map,Ke=new Map;function Ge(e,t){try{e.container.addComponent(t)}catch(n){ge.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function Qe(e){const t=e.name;if(Ke.has(t))return ge.debug(`There were multiple attempts to register component ${t}.`),!1;Ke.set(t,e);for(const t of Ve.values())Ge(t,e);for(const t of Ye.values())Ge(t,e);return!0}
/**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
const Je=new k("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class Ze{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new $("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Je.create("app-deleted",{appName:this._name})}}
/**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */function Xe(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const i={name:ze,automaticDataCollectionEnabled:!0,...t},s=i.name;if("string"!=typeof s||!s)throw Je.create("bad-app-name",{appName:String(s)});if(n||(n=v()),!n)throw Je.create("no-options");const r=Ve.get(s);if(r){if(F(n,r.options)&&F(i,r.config))return r;throw Je.create("duplicate-app",{appName:s})}const o=new j(s);for(const e of Ke.values())o.addComponent(e);const a=new Ze(n,i,o);return Ve.set(s,a),a}function et(e,t,n){let i=je[e]??e;n&&(i+=`-${n}`);const s=i.match(/\s|\//),r=t.match(/\s|\//);if(s||r){const e=[`Unable to register library "${i}" with version "${t}":`];return s&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&r&&e.push("and"),r&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void ge.warn(e.join(" "))}Qe(new $(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}
/**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const tt="firebase-heartbeat-store";let nt=null;function it(){return nt||(nt=function(e,t,{blocked:n,upgrade:i,blocking:s,terminated:r}={}){const o=indexedDB.open(e,t),a=le(o);return i&&o.addEventListener("upgradeneeded",e=>{i(le(o.result),e.oldVersion,e.newVersion,le(o.transaction),e)}),n&&o.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),a.then(e=>{r&&e.addEventListener("close",()=>r()),s&&e.addEventListener("versionchange",e=>s(e.oldVersion,e.newVersion,e))}).catch(()=>{}),a}("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(tt)}catch(e){console.warn(e)}}}).catch(e=>{throw Je.create("idb-open",{originalErrorMessage:e.message})})),nt}async function st(e,t){try{const n=(await it()).transaction(tt,"readwrite"),i=n.objectStore(tt);await i.put(t,rt(e)),await n.done}catch(e){if(e instanceof T)ge.warn(e.message);else{const t=Je.create("idb-set",{originalErrorMessage:e?.message});ge.warn(t.message)}}}function rt(e){return`${e.name}!${e.options.appId}`}
/**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class ot{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new lt(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){try{const e=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),t=at();if(null==this._heartbeatsCache?.heartbeats&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==this._heartbeatsCache?.heartbeats))return;if(this._heartbeatsCache.lastSentHeartbeatDate===t||this._heartbeatsCache.heartbeats.some(e=>e.date===t))return;if(this._heartbeatsCache.heartbeats.push({date:t,agent:e}),this._heartbeatsCache.heartbeats.length>30){const e=function(e){if(0===e.length)return-1;let t=0,n=e[0].date;for(let i=1;i<e.length;i++)e[i].date<n&&(n=e[i].date,t=i);return t}
/**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){ge.warn(e)}}async getHeartbeatsHeader(){try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==this._heartbeatsCache?.heartbeats||0===this._heartbeatsCache.heartbeats.length)return"";const e=at(),{heartbeatsToSend:t,unsentEntries:n}=function(e,t=1024){const n=[];let i=e.slice();for(const s of e){const e=n.find(e=>e.agent===s.agent);if(e){if(e.dates.push(s.date),ct(n)>t){e.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),ct(n)>t){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}(this._heartbeatsCache.heartbeats),i=d(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return ge.warn(e),""}}}function at(){return(new Date).toISOString().substring(0,10)}class lt{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!function(){try{return"object"==typeof indexedDB}catch(e){return!1}}()&&new Promise((e,t)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(i),e(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{t(s.error?.message||"")}}catch(e){t(e)}}).then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await it()).transaction(tt),n=await t.objectStore(tt).get(rt(e));return await t.done,n}catch(e){if(e instanceof T)ge.warn(e.message);else{const t=Je.create("idb-get",{originalErrorMessage:e?.message});ge.warn(t.message)}}}(this.app);return e?.heartbeats?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return st(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return st(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:[...t.heartbeats,...e.heartbeats]})}}}function ct(e){return d(JSON.stringify({version:2,heartbeats:e})).length}var ht;ht="",Qe(new $("platform-logger",e=>new fe(e),"PRIVATE")),Qe(new $("heartbeat",e=>new ot(e),"PRIVATE")),et(_e,me,ht),et(_e,me,"esm2020"),et("fire-js","");
/**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
et("firebase","12.10.0","app");const dt="@firebase/database",ut="1.1.1";
/**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
let pt="";
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class ft{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){null==t?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),P(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return null==t?null:N(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class _t{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){null==t?delete this.cache_[e]:this.cache_[e]=t}get(e){return D(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const mt=function(e){try{if("undefined"!=typeof window&&void 0!==window[e]){const t=window[e];return t.setItem("firebase:sentinel","cache"),t.removeItem("firebase:sentinel"),new ft(t)}}catch(e){}return new _t},gt=mt("localStorage"),yt=mt("sessionStorage"),vt=new J("@firebase/database"),bt=function(){let e=1;return function(){return e++}}(),wt=function(e){const t=function(e){const t=[];let n=0;for(let i=0;i<e.length;i++){let s=e.charCodeAt(i);if(s>=55296&&s<=56319){const t=s-55296;i++,r(i<e.length,"Surrogate pair missing trail surrogate."),s=65536+(t<<10)+(e.charCodeAt(i)-56320)}s<128?t[n++]=s:s<2048?(t[n++]=s>>6|192,t[n++]=63&s|128):s<65536?(t[n++]=s>>12|224,t[n++]=s>>6&63|128,t[n++]=63&s|128):(t[n++]=s>>18|240,t[n++]=s>>12&63|128,t[n++]=s>>6&63|128,t[n++]=63&s|128)}return t}(e),n=new q;n.update(t);const i=n.digest();return l.encodeByteArray(i)},Ct=function(...e){let t="";for(let n=0;n<e.length;n++){const i=e[n];Array.isArray(i)||i&&"object"==typeof i&&"number"==typeof i.length?t+=Ct.apply(null,i):t+="object"==typeof i?P(i):i,t+=" "}return t};let It=null,Et=!0;const xt=function(...e){if(!0===Et&&(Et=!1,null===It&&!0===yt.get("logging_enabled")&&(r(!0,"Can't turn on custom loggers persistently."),vt.logLevel=V.VERBOSE,It=vt.log.bind(vt))),It){const t=Ct.apply(null,e);It(t)}},Tt=function(e){return function(...t){xt(e,...t)}},kt=function(...e){const t="FIREBASE INTERNAL ERROR: "+Ct(...e);vt.error(t)},St=function(...e){const t=`FIREBASE FATAL ERROR: ${Ct(...e)}`;throw vt.error(t),new Error(t)},Nt=function(...e){const t="FIREBASE WARNING: "+Ct(...e);vt.warn(t)},Pt=function(e){return"number"==typeof e&&(e!=e||e===Number.POSITIVE_INFINITY||e===Number.NEGATIVE_INFINITY)},Rt="[MIN_NAME]",Dt="[MAX_NAME]",At=function(e,t){if(e===t)return 0;if(e===Rt||t===Dt)return-1;if(t===Rt||e===Dt)return 1;{const n=Ut(e),i=Ut(t);return null!==n?null!==i?n-i===0?e.length-t.length:n-i:-1:null!==i?1:e<t?-1:1}},Mt=function(e,t){return e===t?0:e<t?-1:1},Lt=function(e,t){if(t&&e in t)return t[e];throw new Error("Missing required key ("+e+") in object: "+P(t))},Ft=function(e){if("object"!=typeof e||null===e)return P(e);const t=[];for(const n in e)t.push(n);t.sort();let n="{";for(let i=0;i<t.length;i++)0!==i&&(n+=","),n+=P(t[i]),n+=":",n+=Ft(e[t[i]]);return n+="}",n},Ot=function(e,t){const n=e.length;if(n<=t)return[e];const i=[];for(let s=0;s<n;s+=t)s+t>n?i.push(e.substring(s,n)):i.push(e.substring(s,s+t));return i};function qt(e,t){for(const n in e)e.hasOwnProperty(n)&&t(n,e[n])}const Bt=function(e){r(!Pt(e),"Invalid JSON number");const t=1023;let n,i,s,o,a;0===e?(i=0,s=0,n=1/e==-1/0?1:0):(n=e<0,(e=Math.abs(e))>=Math.pow(2,-1022)?(o=Math.min(Math.floor(Math.log(e)/Math.LN2),t),i=o+t,s=Math.round(e*Math.pow(2,52-o)-Math.pow(2,52))):(i=0,s=Math.round(e/Math.pow(2,-1074))));const l=[];for(a=52;a;a-=1)l.push(s%2?1:0),s=Math.floor(s/2);for(a=11;a;a-=1)l.push(i%2?1:0),i=Math.floor(i/2);l.push(n?1:0),l.reverse();const c=l.join("");let h="";for(a=0;a<64;a+=8){let e=parseInt(c.substr(a,8),2).toString(16);1===e.length&&(e="0"+e),h+=e}return h.toLowerCase()};const Wt=new RegExp("^-?(0*)\\d{1,10}$"),Ut=function(e){if(Wt.test(e)){const t=Number(e);if(t>=-2147483648&&t<=2147483647)return t}return null},$t=function(e){try{e()}catch(e){setTimeout(()=>{const t=e.stack||"";throw Nt("Exception was thrown by user callback.",t),e},Math.floor(0))}},Ht=function(e,t){const n=setTimeout(e,t);return"number"==typeof n&&"undefined"!=typeof Deno&&Deno.unrefTimer?Deno.unrefTimer(n):"object"==typeof n&&n.unref&&n.unref(),n};
/**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class zt{constructor(e,t){var n;this.appCheckProvider=t,this.appName=e.name,null!=(n=e)&&void 0!==n.settings&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t?.getImmediate({optional:!0}),this.appCheck||t?.get().then(e=>this.appCheck=e)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,n)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,n):t(null)},0)})}addTokenChangeListener(e){this.appCheckProvider?.get().then(t=>t.addTokenListener(e))}notifyForInvalidToken(){Nt(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class jt{constructor(e,t,n){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=n,this.auth_=null,this.auth_=n.getImmediate({optional:!0}),this.auth_||n.onInit(e=>this.auth_=e)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(e=>e&&"auth/token-not-initialized"===e.code?(xt("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(e)):new Promise((t,n)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,n):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',Nt(e)}}class Vt{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Vt.OWNER="owner";
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
const Yt=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,Kt="ac",Gt="websocket",Qt="long_polling";
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class Jt{constructor(e,t,n,i,s=!1,r="",o=!1,a=!1,l=null){this.secure=t,this.namespace=n,this.webSocketOnly=i,this.nodeAdmin=s,this.persistenceKey=r,this.includeNamespaceInQueryParams=o,this.isUsingEmulator=a,this.emulatorOptions=l,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=gt.get("host:"+e)||this._host}isCacheableHost(){return"s-"===this.internalHost.substr(0,2)}isCustomHost(){return"firebaseio.com"!==this._domain&&"firebaseio-demo.com"!==this._domain}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&gt.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function Zt(e,t,n){let i;if(r("string"==typeof t,"typeof type must == string"),r("object"==typeof n,"typeof params must == object"),t===Gt)i=(e.secure?"wss://":"ws://")+e.internalHost+"/.ws?";else{if(t!==Qt)throw new Error("Unknown connection type: "+t);i=(e.secure?"https://":"http://")+e.internalHost+"/.lp?"}(function(e){return e.host!==e.internalHost||e.isCustomHost()||e.includeNamespaceInQueryParams})(e)&&(n.ns=e.namespace);const s=[];return qt(n,(e,t)=>{s.push(e+"="+t)}),i+s.join("&")}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class Xt{constructor(){this.counters_={}}incrementCounter(e,t=1){D(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return p(this.counters_)}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const en={},tn={};function nn(e){const t=e.toString();return en[t]||(en[t]=new Xt),en[t]}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class sn{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const e=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let t=0;t<e.length;++t)e[t]&&$t(()=>{this.onMessage_(e[t])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const rn="start";class on{constructor(e,t,n,i,s,r,o){this.connId=e,this.repoInfo=t,this.applicationId=n,this.appCheckToken=i,this.authToken=s,this.transportSessionId=r,this.lastSessionId=o,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Tt(e),this.stats_=nn(t),this.urlFn=e=>(this.appCheckToken&&(e[Kt]=this.appCheckToken),Zt(t,Qt,e))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new sn(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(3e4)),function(e){if("complete"===document.readyState)e();else{let t=!1;const n=function(){document.body?t||(t=!0,e()):setTimeout(n,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{"complete"===document.readyState&&n()}),window.attachEvent("onload",n))}}(()=>{if(this.isClosed_)return;this.scriptTagHolder=new an((...e)=>{const[t,n,i,s,r]=e;if(this.incrementIncomingBytes_(e),this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,t===rn)this.id=n,this.password=i;else{if("close"!==t)throw new Error("Unrecognized command received: "+t);n?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(n,()=>{this.onClosed_()})):this.onClosed_()}},(...e)=>{const[t,n]=e;this.incrementIncomingBytes_(e),this.myPacketOrderer.handleResponse(t,n)},()=>{this.onClosed_()},this.urlFn);const e={};e[rn]="t",e.ser=Math.floor(1e8*Math.random()),this.scriptTagHolder.uniqueCallbackIdentifier&&(e.cb=this.scriptTagHolder.uniqueCallbackIdentifier),e.v="5",this.transportSessionId&&(e.s=this.transportSessionId),this.lastSessionId&&(e.ls=this.lastSessionId),this.applicationId&&(e.p=this.applicationId),this.appCheckToken&&(e[Kt]=this.appCheckToken),"undefined"!=typeof location&&location.hostname&&Yt.test(location.hostname)&&(e.r="f");const t=this.urlFn(e);this.log_("Connecting via long-poll to "+t),this.scriptTagHolder.addTag(t,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){on.forceAllow_=!0}static forceDisallow(){on.forceDisallow_=!0}static isAvailable(){return!!on.forceAllow_||!(on.forceDisallow_||"undefined"==typeof document||null==document.createElement||"object"==typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href)||"object"==typeof Windows&&"object"==typeof Windows.UI)}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=P(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const n=h(t),i=Ot(n,1840);for(let e=0;e<i.length;e++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[e]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const n={dframe:"t"};n.id=e,n.pw=t,this.myDisconnFrame.src=this.urlFn(n),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=P(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class an{constructor(e,t,n,i){this.onDisconnect=n,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(1e8*Math.random()),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=bt(),window["pLPCommand"+this.uniqueCallbackIdentifier]=e,window["pRTLPCB"+this.uniqueCallbackIdentifier]=t,this.myIFrame=an.createIFrame_();let n="";if(this.myIFrame.src&&"javascript:"===this.myIFrame.src.substr(0,11)){n='<script>document.domain="'+document.domain+'";<\/script>'}const i="<html><body>"+n+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(i),this.myIFrame.doc.close()}catch(e){xt("frame writing exception"),e.stack&&xt(e.stack),xt(e)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",!document.body)throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";document.body.appendChild(e);try{e.contentWindow.document||xt("No IE domain setting required")}catch(t){const n=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+n+"';document.close();})())"}return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{null!==this.myIFrame&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e.id=this.myID,e.pw=this.myPW,e.ser=this.currentSerial;let t=this.urlFn(e),n="",i=0;for(;this.pendingSegs.length>0;){if(!(this.pendingSegs[0].d.length+30+n.length<=1870))break;{const e=this.pendingSegs.shift();n=n+"&seg"+i+"="+e.seg+"&ts"+i+"="+e.ts+"&d"+i+"="+e.d,i++}}return t+=n,this.addLongPollTag_(t,this.currentSerial),!0}return!1}enqueueSegment(e,t,n){this.pendingSegs.push({seg:e,ts:t,d:n}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const n=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(n,Math.floor(25e3));this.addTag(e,()=>{clearTimeout(i),n()})}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const n=this.myIFrame.doc.createElement("script");n.type="text/javascript",n.async=!0,n.src=e,n.onload=n.onreadystatechange=function(){const e=n.readyState;e&&"loaded"!==e&&"complete"!==e||(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),t())},n.onerror=()=>{xt("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(n)}catch(e){}},Math.floor(1))}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */let ln=null;"undefined"!=typeof MozWebSocket?ln=MozWebSocket:"undefined"!=typeof WebSocket&&(ln=WebSocket);class cn{constructor(e,t,n,i,s,r,o){this.connId=e,this.applicationId=n,this.appCheckToken=i,this.authToken=s,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Tt(this.connId),this.stats_=nn(t),this.connURL=cn.connectionURL_(t,r,o,i,n),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,n,i,s){const r={v:"5"};return"undefined"!=typeof location&&location.hostname&&Yt.test(location.hostname)&&(r.r="f"),t&&(r.s=t),n&&(r.ls=n),i&&(r[Kt]=i),s&&(r.p=s),Zt(e,Gt,r)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,gt.set("previous_websocket_failure",!0);try{let e;this.mySock=new ln(this.connURL,[],e)}catch(e){this.log_("Error instantiating WebSocket.");const t=e.message||e.data;return t&&this.log_(t),void this.onClosed_()}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=e=>{this.handleIncomingFrame(e)},this.mySock.onerror=e=>{this.log_("WebSocket error.  Closing connection.");const t=e.message||e.data;t&&this.log_(t),this.onClosed_()}}start(){}static forceDisallow(){cn.forceDisallow_=!0}static isAvailable(){let e=!1;if("undefined"!=typeof navigator&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,n=navigator.userAgent.match(t);n&&n.length>1&&parseFloat(n[1])<4.4&&(e=!0)}return!e&&null!==ln&&!cn.forceDisallow_}static previouslyFailed(){return gt.isInMemoryStorage||!0===gt.get("previous_websocket_failure")}markConnectionHealthy(){gt.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const e=this.frames.join("");this.frames=null;const t=N(e);this.onMessage(t)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(r(null===this.frames,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(null===this.mySock)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),null!==this.frames)this.appendFrame_(t);else{const e=this.extractFrameCount_(t);null!==e&&this.appendFrame_(e)}}send(e){this.resetKeepAlive();const t=P(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const n=Ot(t,16384);n.length>1&&this.sendString_(String(n.length));for(let e=0;e<n.length;e++)this.sendString_(n[e])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(45e3))}sendString_(e){try{this.mySock.send(e)}catch(e){this.log_("Exception thrown from WebSocket.send():",e.message||e.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}cn.responsesRequiredToBeHealthy=2,cn.healthyTimeout=3e4;
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class hn{static get ALL_TRANSPORTS(){return[on,cn]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=cn&&cn.isAvailable();let n=t&&!cn.previouslyFailed();if(e.webSocketOnly&&(t||Nt("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),n=!0),n)this.transports_=[cn];else{const e=this.transports_=[];for(const t of hn.ALL_TRANSPORTS)t&&t.isAvailable()&&e.push(t);hn.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}hn.globalTransportInitialized_=!1;class dn{constructor(e,t,n,i,s,r,o,a,l,c){this.id=e,this.repoInfo_=t,this.applicationId_=n,this.appCheckToken_=i,this.authToken_=s,this.onMessage_=r,this.onReady_=o,this.onDisconnect_=a,this.onKill_=l,this.lastSessionId=c,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Tt("c:"+this.id+":"),this.transportManager_=new hn(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),n=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,n)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=Ht(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>102400?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>10240?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{2!==this.state_&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if("t"in e){const t=e.t;"a"===t?this.upgradeIfSecondaryHealthy_():"r"===t?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),this.tx_!==this.secondaryConn_&&this.rx_!==this.secondaryConn_||this.close()):"o"===t&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=Lt("t",e),n=Lt("d",e);if("c"===t)this.onSecondaryControl_(n);else{if("d"!==t)throw new Error("Unknown protocol layer: "+t);this.pendingDataMessages.push(n)}}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:"p",d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:"a",d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:"n",d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=Lt("t",e),n=Lt("d",e);"c"===t?this.onControl_(n):"d"===t&&this.onDataMessage_(n)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=Lt("t",e);if("d"in e){const n=e.d;if("h"===t){const e={...n};this.repoInfo_.isUsingEmulator&&(e.h=this.repoInfo_.host),this.onHandshake_(e)}else if("n"===t){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let e=0;e<this.pendingDataMessages.length;++e)this.onDataMessage_(this.pendingDataMessages[e]);this.pendingDataMessages=[],this.tryCleanupConnection()}else"s"===t?this.onConnectionShutdown_(n):"r"===t?this.onReset_(n):"e"===t?kt("Server Error: "+n):"o"===t?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):kt("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,n=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,0===this.state_&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),"5"!==n&&Nt("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),n=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,n),Ht(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(6e4))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,1===this.state_?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),0===this.primaryResponsesRequired_?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):Ht(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(5e3))}sendPingOnPrimaryIfNecessary_(){this.isHealthy_||1!==this.state_||(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:"p",d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,this.tx_!==e&&this.rx_!==e||this.close()}onConnectionLost_(e){this.conn_=null,e||0!==this.state_?1===this.state_&&this.log_("Realtime connection lost."):(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(gt.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(1!==this.state_)throw"Connection is not connected";this.tx_.send(e)}close(){2!==this.state_&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class un{put(e,t,n,i){}merge(e,t,n,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,n){}onDisconnectMerge(e,t,n){}onDisconnectCancel(e,t){}reportStats(e){}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class pn{constructor(e){this.allowedEvents_=e,this.listeners_={},r(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const n=[...this.listeners_[e]];for(let e=0;e<n.length;e++)n[e].callback.apply(n[e].context,t)}}on(e,t,n){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:n});const i=this.getInitialEvent(e);i&&t.apply(n,i)}off(e,t,n){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let e=0;e<i.length;e++)if(i[e].callback===t&&(!n||n===i[e].context))return void i.splice(e,1)}validateEventType_(e){r(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class fn extends pn{static getInstance(){return new fn}constructor(){super(["online"]),this.online_=!0,"undefined"==typeof window||void 0===window.addEventListener||x()||(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return r("online"===e,"Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class _n{constructor(e,t){if(void 0===t){this.pieces_=e.split("/");let t=0;for(let e=0;e<this.pieces_.length;e++)this.pieces_[e].length>0&&(this.pieces_[t]=this.pieces_[e],t++);this.pieces_.length=t,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)""!==this.pieces_[t]&&(e+="/"+this.pieces_[t]);return e||"/"}}function mn(){return new _n("")}function gn(e){return e.pieceNum_>=e.pieces_.length?null:e.pieces_[e.pieceNum_]}function yn(e){return e.pieces_.length-e.pieceNum_}function vn(e){let t=e.pieceNum_;return t<e.pieces_.length&&t++,new _n(e.pieces_,t)}function bn(e){return e.pieceNum_<e.pieces_.length?e.pieces_[e.pieces_.length-1]:null}function wn(e,t=0){return e.pieces_.slice(e.pieceNum_+t)}function Cn(e){if(e.pieceNum_>=e.pieces_.length)return null;const t=[];for(let n=e.pieceNum_;n<e.pieces_.length-1;n++)t.push(e.pieces_[n]);return new _n(t,0)}function In(e,t){const n=[];for(let t=e.pieceNum_;t<e.pieces_.length;t++)n.push(e.pieces_[t]);if(t instanceof _n)for(let e=t.pieceNum_;e<t.pieces_.length;e++)n.push(t.pieces_[e]);else{const e=t.split("/");for(let t=0;t<e.length;t++)e[t].length>0&&n.push(e[t])}return new _n(n,0)}function En(e){return e.pieceNum_>=e.pieces_.length}function xn(e,t){const n=gn(e),i=gn(t);if(null===n)return t;if(n===i)return xn(vn(e),vn(t));throw new Error("INTERNAL ERROR: innerPath ("+t+") is not within outerPath ("+e+")")}function Tn(e,t){const n=wn(e,0),i=wn(t,0);for(let e=0;e<n.length&&e<i.length;e++){const t=At(n[e],i[e]);if(0!==t)return t}return n.length===i.length?0:n.length<i.length?-1:1}function kn(e,t){if(yn(e)!==yn(t))return!1;for(let n=e.pieceNum_,i=t.pieceNum_;n<=e.pieces_.length;n++,i++)if(e.pieces_[n]!==t.pieces_[i])return!1;return!0}function Sn(e,t){let n=e.pieceNum_,i=t.pieceNum_;if(yn(e)>yn(t))return!1;for(;n<e.pieces_.length;){if(e.pieces_[n]!==t.pieces_[i])return!1;++n,++i}return!0}class Nn{constructor(e,t){this.errorPrefix_=t,this.parts_=wn(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let e=0;e<this.parts_.length;e++)this.byteLength_+=W(this.parts_[e]);Pn(this)}}function Pn(e){if(e.byteLength_>768)throw new Error(e.errorPrefix_+"has a key path longer than 768 bytes ("+e.byteLength_+").");if(e.parts_.length>32)throw new Error(e.errorPrefix_+"path specified exceeds the maximum depth that can be written (32) or object contains a cycle "+Rn(e))}function Rn(e){return 0===e.parts_.length?"":"in property '"+e.parts_.join(".")+"'"}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class Dn extends pn{static getInstance(){return new Dn}constructor(){let e,t;super(["visible"]),"undefined"!=typeof document&&void 0!==document.addEventListener&&(void 0!==document.hidden?(t="visibilitychange",e="hidden"):void 0!==document.mozHidden?(t="mozvisibilitychange",e="mozHidden"):void 0!==document.msHidden?(t="msvisibilitychange",e="msHidden"):void 0!==document.webkitHidden&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const t=!document[e];t!==this.visible_&&(this.visible_=t,this.trigger("visible",t))},!1)}getInitialEvent(e){return r("visible"===e,"Unknown event type: "+e),[this.visible_]}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const An=1e3;class Mn extends un{constructor(e,t,n,i,s,r,o,a){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=n,this.onConnectStatus_=i,this.onServerInfoUpdate_=s,this.authTokenProvider_=r,this.appCheckTokenProvider_=o,this.authOverride_=a,this.id=Mn.nextPersistentConnectionId_++,this.log_=Tt("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=An,this.maxReconnectDelay_=3e5,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,a)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Dn.getInstance().on("visible",this.onVisible_,this),-1===e.host.indexOf("fblocal")&&fn.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,n){const i=++this.requestNumber_,s={r:i,a:e,b:t};this.log_(P(s)),r(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(s),n&&(this.requestCBHash_[i]=n)}get(e){this.initConnection_();const t=new b,n={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:e=>{const n=e.d;"ok"===e.s?t.resolve(n):t.reject(n)}};this.outstandingGets_.push(n),this.outstandingGetCount_++;const i=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(i),t.promise}listen(e,t,n,i){this.initConnection_();const s=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+s),this.listens.has(o)||this.listens.set(o,new Map),r(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),r(!this.listens.get(o).has(s),"listen() called twice for same path/queryId.");const a={onComplete:i,hashFn:t,query:e,tag:n};this.listens.get(o).set(s,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,n=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,0===this.outstandingGetCount_&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(n)})}sendListen_(e){const t=e.query,n=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+n+" for "+i);const s={p:n};e.tag&&(s.q=t._queryObject,s.t=e.tag),s.h=e.hashFn(),this.sendRequest("q",s,s=>{const r=s.d,o=s.s;Mn.warnOnListenWarnings_(r,t);(this.listens.get(n)&&this.listens.get(n).get(i))===e&&(this.log_("listen response",s),"ok"!==o&&this.removeListen_(n,i),e.onComplete&&e.onComplete(o,r))})}static warnOnListenWarnings_(e,t){if(e&&"object"==typeof e&&D(e,"w")){const n=A(e,"w");if(Array.isArray(n)&&~n.indexOf("no_index")){const e='".indexOn": "'+t._queryParams.getIndex().toString()+'"',n=t._path.toString();Nt(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${e} at ${n} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&40===e.length||function(e){const t=R(e).claims;return"object"==typeof t&&!0===t.admin}(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=3e4)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=function(e){const t=R(e).claims;return!!t&&"object"==typeof t&&t.hasOwnProperty("iat")}(e)?"auth":"gauth",n={cred:e};null===this.authOverride_?n.noauth=!0:"object"==typeof this.authOverride_&&(n.authvar=this.authOverride_),this.sendRequest(t,n,t=>{const n=t.s,i=t.d||"error";this.authToken_===e&&("ok"===n?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(n,i))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,n=e.d||"error";"ok"===t?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,n)})}unlisten(e,t){const n=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+n+" "+i),r(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query");this.removeListen_(n,i)&&this.connected_&&this.sendUnlisten_(n,i,e._queryObject,t)}sendUnlisten_(e,t,n,i){this.log_("Unlisten on "+e+" for "+t);const s={p:e};i&&(s.q=n,s.t=i),this.sendRequest("n",s)}onDisconnectPut(e,t,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:n})}onDisconnectMerge(e,t,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:n})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,n,i){const s={p:t,d:n};this.log_("onDisconnect "+e,s),this.sendRequest(e,s,e=>{i&&setTimeout(()=>{i(e.s,e.d)},Math.floor(0))})}put(e,t,n,i){this.putInternal("p",e,t,n,i)}merge(e,t,n,i){this.putInternal("m",e,t,n,i)}putInternal(e,t,n,i,s){this.initConnection_();const r={p:t,d:n};void 0!==s&&(r.h=s),this.outstandingPuts_.push({action:e,request:r,onComplete:i}),this.outstandingPutCount_++;const o=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(o):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,n=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,n,n=>{this.log_(t+" response",n),delete this.outstandingPuts_[e],this.outstandingPutCount_--,0===this.outstandingPutCount_&&(this.outstandingPuts_=[]),i&&i(n.s,n.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,e=>{if("ok"!==e.s){const t=e.d;this.log_("reportStats","Error sending stats: "+t)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+P(e));const t=e.r,n=this.requestCBHash_[t];n&&(delete this.requestCBHash_[t],n(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),"d"===e?this.onDataUpdate_(t.p,t.d,!1,t.t):"m"===e?this.onDataUpdate_(t.p,t.d,!0,t.t):"c"===e?this.onListenRevoked_(t.p,t.q):"ac"===e?this.onAuthRevoked_(t.s,t.d):"apc"===e?this.onAppCheckRevoked_(t.s,t.d):"sd"===e?this.onSecurityDebugPacket_(t):kt("Unrecognized action received from server: "+P(e)+"\nAre you using the latest client?")}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=(new Date).getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){r(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=An,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=An,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){if(this.visible_){if(this.lastConnectionEstablishedTime_){(new Date).getTime()-this.lastConnectionEstablishedTime_>3e4&&(this.reconnectDelay_=An),this.lastConnectionEstablishedTime_=null}}else this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=(new Date).getTime();const e=Math.max(0,(new Date).getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,1.3*this.reconnectDelay_)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=(new Date).getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),n=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+Mn.nextConnectionId_++,s=this.lastSessionId;let o=!1,a=null;const l=function(){a?a.close():(o=!0,n())},c=function(e){r(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(e)};this.realtime_={close:l,sendRequest:c};const h=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[r,l]=await Promise.all([this.authTokenProvider_.getToken(h),this.appCheckTokenProvider_.getToken(h)]);o?xt("getToken() completed but was canceled"):(xt("getToken() completed. Creating connection."),this.authToken_=r&&r.accessToken,this.appCheckToken_=l&&l.token,a=new dn(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,n,e=>{Nt(e+" ("+this.repoInfo_.toString()+")"),this.interrupt("server_kill")},s))}catch(e){this.log_("Failed to get token: "+e),o||(this.repoInfo_.nodeAdmin&&Nt(e),l())}}}interrupt(e){xt("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){xt("Resuming connection for reason: "+e),delete this.interruptReasons_[e],M(this.interruptReasons_)&&(this.reconnectDelay_=An,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-(new Date).getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}0===this.outstandingPutCount_&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let n;n=t?t.map(e=>Ft(e)).join("$"):"default";const i=this.removeListen_(e,n);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const n=new _n(e).toString();let i;if(this.listens.has(n)){const e=this.listens.get(n);i=e.get(t),e.delete(t),0===e.size&&this.listens.delete(n)}else i=void 0;return i}onAuthRevoked_(e,t){xt("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),"invalid_token"!==e&&"permission_denied"!==e||(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=3&&(this.reconnectDelay_=3e4,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){xt("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,"invalid_token"!==e&&"permission_denied"!==e||(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=3&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace("\n","\nFIREBASE: "))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};e["sdk.js."+pt.replace(/\./g,"-")]=1,x()?e["framework.cordova"]=1:"object"==typeof navigator&&"ReactNative"===navigator.product&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=fn.getInstance().currentlyOnline();return M(this.interruptReasons_)&&e}}Mn.nextPersistentConnectionId_=0,Mn.nextConnectionId_=0;
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class Ln{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new Ln(e,t)}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class Fn{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const n=new Ln(Rt,e),i=new Ln(Rt,t);return 0!==this.compare(n,i)}minPost(){return Ln.MIN}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */let On;class qn extends Fn{static get __EMPTY_NODE(){return On}static set __EMPTY_NODE(e){On=e}compare(e,t){return At(e.name,t.name)}isDefinedOn(e){throw o("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return Ln.MIN}maxPost(){return new Ln(Dt,On)}makePost(e,t){return r("string"==typeof e,"KeyIndex indexValue must always be a string."),new Ln(e,On)}toString(){return".key"}}const Bn=new qn;
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class Wn{constructor(e,t,n,i,s=null){this.isReverse_=i,this.resultGenerator_=s,this.nodeStack_=[];let r=1;for(;!e.isEmpty();)if(r=t?n(e.key,t):1,i&&(r*=-1),r<0)e=this.isReverse_?e.left:e.right;else{if(0===r){this.nodeStack_.push(e);break}this.nodeStack_.push(e),e=this.isReverse_?e.right:e.left}}getNext(){if(0===this.nodeStack_.length)return null;let e,t=this.nodeStack_.pop();if(e=this.resultGenerator_?this.resultGenerator_(t.key,t.value):{key:t.key,value:t.value},this.isReverse_)for(t=t.left;!t.isEmpty();)this.nodeStack_.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack_.push(t),t=t.left;return e}hasNext(){return this.nodeStack_.length>0}peek(){if(0===this.nodeStack_.length)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class Un{constructor(e,t,n,i,s){this.key=e,this.value=t,this.color=null!=n?n:Un.RED,this.left=null!=i?i:$n.EMPTY_NODE,this.right=null!=s?s:$n.EMPTY_NODE}copy(e,t,n,i,s){return new Un(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=i?i:this.left,null!=s?s:this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let i=this;const s=n(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,n),null):0===s?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,n)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return $n.EMPTY_NODE;let e=this;return e.left.isRed_()||e.left.left.isRed_()||(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let n,i;if(n=this,t(e,n.key)<0)n.left.isEmpty()||n.left.isRed_()||n.left.left.isRed_()||(n=n.moveRedLeft_()),n=n.copy(null,null,null,n.left.remove(e,t),null);else{if(n.left.isRed_()&&(n=n.rotateRight_()),n.right.isEmpty()||n.right.isRed_()||n.right.left.isRed_()||(n=n.moveRedRight_()),0===t(e,n.key)){if(n.right.isEmpty())return $n.EMPTY_NODE;i=n.right.min_(),n=n.copy(i.key,i.value,null,null,n.right.removeMin_())}n=n.copy(null,null,null,null,n.right.remove(e,t))}return n.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,Un.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,Un.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}Un.RED=!0,Un.BLACK=!1;class $n{constructor(e,t=$n.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new $n(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,Un.BLACK,null,null))}remove(e){return new $n(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Un.BLACK,null,null))}get(e){let t,n=this.root_;for(;!n.isEmpty();){if(t=this.comparator_(e,n.key),0===t)return n.value;t<0?n=n.left:t>0&&(n=n.right)}return null}getPredecessorKey(e){let t,n=this.root_,i=null;for(;!n.isEmpty();){if(t=this.comparator_(e,n.key),0===t){if(n.left.isEmpty())return i?i.key:null;for(n=n.left;!n.right.isEmpty();)n=n.right;return n.key}t<0?n=n.left:t>0&&(i=n,n=n.right)}throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new Wn(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new Wn(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new Wn(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new Wn(this.root_,null,this.comparator_,!0,e)}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
function Hn(e,t){return At(e.name,t.name)}function zn(e,t){return At(e,t)}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */let jn;$n.EMPTY_NODE=new class{copy(e,t,n,i,s){return this}insert(e,t,n){return new Un(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}};const Vn=function(e){return"number"==typeof e?"number:"+Bt(e):"string:"+e},Yn=function(e){if(e.isLeafNode()){const t=e.val();r("string"==typeof t||"number"==typeof t||"object"==typeof t&&D(t,".sv"),"Priority must be a string or number.")}else r(e===jn||e.isEmpty(),"priority of unexpected type.");r(e===jn||e.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
let Kn,Gn,Qn;class Jn{static set __childrenNodeConstructor(e){Kn=e}static get __childrenNodeConstructor(){return Kn}constructor(e,t=Jn.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,r(void 0!==this.value_&&null!==this.value_,"LeafNode shouldn't be created with null/undefined value."),Yn(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new Jn(this.value_,e)}getImmediateChild(e){return".priority"===e?this.priorityNode_:Jn.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return En(e)?this:".priority"===gn(e)?this.priorityNode_:Jn.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return".priority"===e?this.updatePriority(t):t.isEmpty()&&".priority"!==e?this:Jn.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const n=gn(e);return null===n?t:t.isEmpty()&&".priority"!==n?this:(r(".priority"!==n||1===yn(e),".priority must be the last token in a path"),this.updateImmediateChild(n,Jn.__childrenNodeConstructor.EMPTY_NODE.updateChild(vn(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(null===this.lazyHash_){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+Vn(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",e+="number"===t?Bt(this.value_):this.value_,this.lazyHash_=wt(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===Jn.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof Jn.__childrenNodeConstructor?-1:(r(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,n=typeof this.value_,i=Jn.VALUE_TYPE_ORDER.indexOf(t),s=Jn.VALUE_TYPE_ORDER.indexOf(n);return r(i>=0,"Unknown leaf type: "+t),r(s>=0,"Unknown leaf type: "+n),i===s?"object"===n?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:s-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}return!1}}Jn.VALUE_TYPE_ORDER=["object","boolean","number","string"];const Zn=new class extends Fn{compare(e,t){const n=e.node.getPriority(),i=t.node.getPriority(),s=n.compareTo(i);return 0===s?At(e.name,t.name):s}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return Ln.MIN}maxPost(){return new Ln(Dt,new Jn("[PRIORITY-POST]",Qn))}makePost(e,t){const n=Gn(e);return new Ln(t,new Jn("[PRIORITY-POST]",n))}toString(){return".priority"}},Xn=Math.log(2);
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class ei{constructor(e){var t;this.count=(t=e+1,parseInt(Math.log(t)/Xn,10)),this.current_=this.count-1;const n=(i=this.count,parseInt(Array(i+1).join("1"),2));var i;this.bits_=e+1&n}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const ti=function(e,t,n,i){e.sort(t);const s=function(t,i){const r=i-t;let o,a;if(0===r)return null;if(1===r)return o=e[t],a=n?n(o):o,new Un(a,o.node,Un.BLACK,null,null);{const l=parseInt(r/2,10)+t,c=s(t,l),h=s(l+1,i);return o=e[l],a=n?n(o):o,new Un(a,o.node,Un.BLACK,c,h)}},r=function(t){let i=null,r=null,o=e.length;const a=function(t,i){const r=o-t,a=o;o-=t;const c=s(r+1,a),h=e[r],d=n?n(h):h;l(new Un(d,h.node,i,null,c))},l=function(e){i?(i.left=e,i=e):(r=e,i=e)};for(let e=0;e<t.count;++e){const n=t.nextBitIsOne(),i=Math.pow(2,t.count-(e+1));n?a(i,Un.BLACK):(a(i,Un.BLACK),a(i,Un.RED))}return r}(new ei(e.length));return new $n(i||t,r)};
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */let ni;const ii={};class si{static get Default(){return r(ii&&Zn,"ChildrenNode.ts has not been loaded"),ni=ni||new si({".priority":ii},{".priority":Zn}),ni}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=A(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof $n?t:null}hasIndex(e){return D(this.indexSet_,e.toString())}addIndex(e,t){r(e!==Bn,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const n=[];let i=!1;const s=t.getIterator(Ln.Wrap);let o,a=s.getNext();for(;a;)i=i||e.isDefinedOn(a.node),n.push(a),a=s.getNext();o=i?ti(n,e.getCompare()):ii;const l=e.toString(),c={...this.indexSet_};c[l]=e;const h={...this.indexes_};return h[l]=o,new si(h,c)}addToIndexes(e,t){const n=L(this.indexes_,(n,i)=>{const s=A(this.indexSet_,i);if(r(s,"Missing index implementation for "+i),n===ii){if(s.isDefinedOn(e.node)){const n=[],i=t.getIterator(Ln.Wrap);let r=i.getNext();for(;r;)r.name!==e.name&&n.push(r),r=i.getNext();return n.push(e),ti(n,s.getCompare())}return ii}{const i=t.get(e.name);let s=n;return i&&(s=s.remove(new Ln(e.name,i))),s.insert(e,e.node)}});return new si(n,this.indexSet_)}removeFromIndexes(e,t){const n=L(this.indexes_,n=>{if(n===ii)return n;{const i=t.get(e.name);return i?n.remove(new Ln(e.name,i)):n}});return new si(n,this.indexSet_)}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */let ri;class oi{static get EMPTY_NODE(){return ri||(ri=new oi(new $n(zn),null,si.Default))}constructor(e,t,n){this.children_=e,this.priorityNode_=t,this.indexMap_=n,this.lazyHash_=null,this.priorityNode_&&Yn(this.priorityNode_),this.children_.isEmpty()&&r(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||ri}updatePriority(e){return this.children_.isEmpty()?this:new oi(this.children_,e,this.indexMap_)}getImmediateChild(e){if(".priority"===e)return this.getPriority();{const t=this.children_.get(e);return null===t?ri:t}}getChild(e){const t=gn(e);return null===t?this:this.getImmediateChild(t).getChild(vn(e))}hasChild(e){return null!==this.children_.get(e)}updateImmediateChild(e,t){if(r(t,"We should always be passing snapshot nodes"),".priority"===e)return this.updatePriority(t);{const n=new Ln(e,t);let i,s;t.isEmpty()?(i=this.children_.remove(e),s=this.indexMap_.removeFromIndexes(n,this.children_)):(i=this.children_.insert(e,t),s=this.indexMap_.addToIndexes(n,this.children_));const r=i.isEmpty()?ri:this.priorityNode_;return new oi(i,r,s)}}updateChild(e,t){const n=gn(e);if(null===n)return t;{r(".priority"!==gn(e)||1===yn(e),".priority must be the last token in a path");const i=this.getImmediateChild(n).updateChild(vn(e),t);return this.updateImmediateChild(n,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let n=0,i=0,s=!0;if(this.forEachChild(Zn,(r,o)=>{t[r]=o.val(e),n++,s&&oi.INTEGER_REGEXP_.test(r)?i=Math.max(i,Number(r)):s=!1}),!e&&s&&i<2*n){const e=[];for(const n in t)e[n]=t[n];return e}return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(null===this.lazyHash_){let e="";this.getPriority().isEmpty()||(e+="priority:"+Vn(this.getPriority().val())+":"),this.forEachChild(Zn,(t,n)=>{const i=n.hash();""!==i&&(e+=":"+t+":"+i)}),this.lazyHash_=""===e?"":wt(e)}return this.lazyHash_}getPredecessorChildName(e,t,n){const i=this.resolveIndex_(n);if(i){const n=i.getPredecessorKey(new Ln(e,t));return n?n.name:null}return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const e=t.minKey();return e&&e.name}return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new Ln(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const e=t.maxKey();return e&&e.name}return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new Ln(t,this.children_.get(t)):null}forEachChild(e,t){const n=this.resolveIndex_(e);return n?n.inorderTraversal(e=>t(e.name,e.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getIteratorFrom(e,e=>e);{const n=this.children_.getIteratorFrom(e.name,Ln.Wrap);let i=n.peek();for(;null!=i&&t.compare(i,e)<0;)n.getNext(),i=n.peek();return n}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getReverseIteratorFrom(e,e=>e);{const n=this.children_.getReverseIteratorFrom(e.name,Ln.Wrap);let i=n.peek();for(;null!=i&&t.compare(i,e)>0;)n.getNext(),i=n.peek();return n}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===ai?-1:0}withIndex(e){if(e===Bn||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new oi(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===Bn||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority())){if(this.children_.count()===t.children_.count()){const e=this.getIterator(Zn),n=t.getIterator(Zn);let i=e.getNext(),s=n.getNext();for(;i&&s;){if(i.name!==s.name||!i.node.equals(s.node))return!1;i=e.getNext(),s=n.getNext()}return null===i&&null===s}return!1}return!1}}resolveIndex_(e){return e===Bn?null:this.indexMap_.get(e.toString())}}oi.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;const ai=new class extends oi{constructor(){super(new $n(zn),oi.EMPTY_NODE,si.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return oi.EMPTY_NODE}isEmpty(){return!1}};Object.defineProperties(Ln,{MIN:{value:new Ln(Rt,oi.EMPTY_NODE)},MAX:{value:new Ln(Dt,ai)}}),qn.__EMPTY_NODE=oi.EMPTY_NODE,Jn.__childrenNodeConstructor=oi,jn=ai,function(e){Qn=e}(ai);function li(e,t=null){if(null===e)return oi.EMPTY_NODE;if("object"==typeof e&&".priority"in e&&(t=e[".priority"]),r(null===t||"string"==typeof t||"number"==typeof t||"object"==typeof t&&".sv"in t,"Invalid priority type found: "+typeof t),"object"==typeof e&&".value"in e&&null!==e[".value"]&&(e=e[".value"]),"object"!=typeof e||".sv"in e){return new Jn(e,li(t))}if(e instanceof Array){let n=oi.EMPTY_NODE;return qt(e,(t,i)=>{if(D(e,t)&&"."!==t.substring(0,1)){const e=li(i);!e.isLeafNode()&&e.isEmpty()||(n=n.updateImmediateChild(t,e))}}),n.updatePriority(li(t))}{const n=[];let i=!1;if(qt(e,(e,t)=>{if("."!==e.substring(0,1)){const s=li(t);s.isEmpty()||(i=i||!s.getPriority().isEmpty(),n.push(new Ln(e,s)))}}),0===n.length)return oi.EMPTY_NODE;const s=ti(n,Hn,e=>e.name,zn);if(i){const e=ti(n,Zn.getCompare());return new oi(s,li(t),new si({".priority":e},{".priority":Zn}))}return new oi(s,li(t),si.Default)}}!function(e){Gn=e}(li);
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class ci extends Fn{constructor(e){super(),this.indexPath_=e,r(!En(e)&&".priority"!==gn(e),"Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const n=this.extractChild(e.node),i=this.extractChild(t.node),s=n.compareTo(i);return 0===s?At(e.name,t.name):s}makePost(e,t){const n=li(e),i=oi.EMPTY_NODE.updateChild(this.indexPath_,n);return new Ln(t,i)}maxPost(){const e=oi.EMPTY_NODE.updateChild(this.indexPath_,ai);return new Ln(Dt,e)}toString(){return wn(this.indexPath_,0).join("/")}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const hi=new class extends Fn{compare(e,t){const n=e.node.compareTo(t.node);return 0===n?At(e.name,t.name):n}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return Ln.MIN}maxPost(){return Ln.MAX}makePost(e,t){const n=li(e);return new Ln(t,n)}toString(){return".value"}};
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */function di(e){return{type:"value",snapshotNode:e}}function ui(e,t){return{type:"child_added",snapshotNode:t,childName:e}}function pi(e,t){return{type:"child_removed",snapshotNode:t,childName:e}}function fi(e,t,n){return{type:"child_changed",snapshotNode:t,childName:e,oldSnap:n}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class _i{constructor(e){this.index_=e}updateChild(e,t,n,i,s,o){r(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(t);return a.getChild(i).equals(n.getChild(i))&&a.isEmpty()===n.isEmpty()?e:(null!=o&&(n.isEmpty()?e.hasChild(t)?o.trackChildChange(pi(t,a)):r(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(ui(t,n)):o.trackChildChange(fi(t,n,a))),e.isLeafNode()&&n.isEmpty()?e:e.updateImmediateChild(t,n).withIndex(this.index_))}updateFullNode(e,t,n){return null!=n&&(e.isLeafNode()||e.forEachChild(Zn,(e,i)=>{t.hasChild(e)||n.trackChildChange(pi(e,i))}),t.isLeafNode()||t.forEachChild(Zn,(t,i)=>{if(e.hasChild(t)){const s=e.getImmediateChild(t);s.equals(i)||n.trackChildChange(fi(t,i,s))}else n.trackChildChange(ui(t,i))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?oi.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class mi{constructor(e){this.indexedFilter_=new _i(e.getIndex()),this.index_=e.getIndex(),this.startPost_=mi.getStartPost_(e),this.endPost_=mi.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,n=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&n}updateChild(e,t,n,i,s,r){return this.matches(new Ln(t,n))||(n=oi.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,n,i,s,r)}updateFullNode(e,t,n){t.isLeafNode()&&(t=oi.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority(oi.EMPTY_NODE);const s=this;return t.forEachChild(Zn,(e,t)=>{s.matches(new Ln(e,t))||(i=i.updateImmediateChild(e,oi.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,n)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}return e.getIndex().maxPost()}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class gi{constructor(e){this.withinDirectionalStart=e=>this.reverse_?this.withinEndPost(e):this.withinStartPost(e),this.withinDirectionalEnd=e=>this.reverse_?this.withinStartPost(e):this.withinEndPost(e),this.withinStartPost=e=>{const t=this.index_.compare(this.rangedFilter_.getStartPost(),e);return this.startIsInclusive_?t<=0:t<0},this.withinEndPost=e=>{const t=this.index_.compare(e,this.rangedFilter_.getEndPost());return this.endIsInclusive_?t<=0:t<0},this.rangedFilter_=new mi(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,n,i,s,r){return this.rangedFilter_.matches(new Ln(t,n))||(n=oi.EMPTY_NODE),e.getImmediateChild(t).equals(n)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,n,i,s,r):this.fullLimitUpdateChild_(e,t,n,s,r)}updateFullNode(e,t,n){let i;if(t.isLeafNode()||t.isEmpty())i=oi.EMPTY_NODE.withIndex(this.index_);else if(2*this.limit_<t.numChildren()&&t.isIndexed(this.index_)){let e;i=oi.EMPTY_NODE.withIndex(this.index_),e=this.reverse_?t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let n=0;for(;e.hasNext()&&n<this.limit_;){const t=e.getNext();if(this.withinDirectionalStart(t)){if(!this.withinDirectionalEnd(t))break;i=i.updateImmediateChild(t.name,t.node),n++}}}else{let e;i=t.withIndex(this.index_),i=i.updatePriority(oi.EMPTY_NODE),e=this.reverse_?i.getReverseIterator(this.index_):i.getIterator(this.index_);let n=0;for(;e.hasNext();){const t=e.getNext();n<this.limit_&&this.withinDirectionalStart(t)&&this.withinDirectionalEnd(t)?n++:i=i.updateImmediateChild(t.name,oi.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,n)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,n,i,s){let o;if(this.reverse_){const e=this.index_.getCompare();o=(t,n)=>e(n,t)}else o=this.index_.getCompare();const a=e;r(a.numChildren()===this.limit_,"");const l=new Ln(t,n),c=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),h=this.rangedFilter_.matches(l);if(a.hasChild(t)){const e=a.getImmediateChild(t);let r=i.getChildAfterChild(this.index_,c,this.reverse_);for(;null!=r&&(r.name===t||a.hasChild(r.name));)r=i.getChildAfterChild(this.index_,r,this.reverse_);const d=null==r?1:o(r,l);if(h&&!n.isEmpty()&&d>=0)return null!=s&&s.trackChildChange(fi(t,n,e)),a.updateImmediateChild(t,n);{null!=s&&s.trackChildChange(pi(t,e));const n=a.updateImmediateChild(t,oi.EMPTY_NODE);return null!=r&&this.rangedFilter_.matches(r)?(null!=s&&s.trackChildChange(ui(r.name,r.node)),n.updateImmediateChild(r.name,r.node)):n}}return n.isEmpty()?e:h&&o(c,l)>=0?(null!=s&&(s.trackChildChange(pi(c.name,c.node)),s.trackChildChange(ui(t,n))),a.updateImmediateChild(t,n).updateImmediateChild(c.name,oi.EMPTY_NODE)):e}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class yi{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=Zn}hasStart(){return this.startSet_}isViewFromLeft(){return""===this.viewFrom_?this.startSet_:"l"===this.viewFrom_}getIndexStartValue(){return r(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return r(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Rt}hasEnd(){return this.endSet_}getIndexEndValue(){return r(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return r(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Dt}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&""!==this.viewFrom_}getLimit(){return r(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===Zn}copy(){const e=new yi;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function vi(e){const t={};if(e.isDefault())return t;let n;if(e.index_===Zn?n="$priority":e.index_===hi?n="$value":e.index_===Bn?n="$key":(r(e.index_ instanceof ci,"Unrecognized index type!"),n=e.index_.toString()),t.orderBy=P(n),e.startSet_){const n=e.startAfterSet_?"startAfter":"startAt";t[n]=P(e.indexStartValue_),e.startNameSet_&&(t[n]+=","+P(e.indexStartName_))}if(e.endSet_){const n=e.endBeforeSet_?"endBefore":"endAt";t[n]=P(e.indexEndValue_),e.endNameSet_&&(t[n]+=","+P(e.indexEndName_))}return e.limitSet_&&(e.isViewFromLeft()?t.limitToFirst=e.limit_:t.limitToLast=e.limit_),t}function bi(e){const t={};if(e.startSet_&&(t.sp=e.indexStartValue_,e.startNameSet_&&(t.sn=e.indexStartName_),t.sin=!e.startAfterSet_),e.endSet_&&(t.ep=e.indexEndValue_,e.endNameSet_&&(t.en=e.indexEndName_),t.ein=!e.endBeforeSet_),e.limitSet_){t.l=e.limit_;let n=e.viewFrom_;""===n&&(n=e.isViewFromLeft()?"l":"r"),t.vf=n}return e.index_!==Zn&&(t.i=e.index_.toString()),t}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class wi extends un{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return void 0!==t?"tag$"+t:(r(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,n,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=n,this.appCheckTokenProvider_=i,this.log_=Tt("p:rest:"),this.listens_={}}listen(e,t,n,i){const s=e._path.toString();this.log_("Listen called for "+s+" "+e._queryIdentifier);const r=wi.getListenId_(e,n),o={};this.listens_[r]=o;const a=vi(e._queryParams);this.restRequest_(s+".json",a,(e,t)=>{let a=t;if(404===e&&(a=null,e=null),null===e&&this.onDataUpdate_(s,a,!1,n),A(this.listens_,r)===o){let t;t=e?401===e?"permission_denied":"rest_error:"+e:"ok",i(t,null)}})}unlisten(e,t){const n=wi.getListenId_(e,t);delete this.listens_[n]}get(e){const t=vi(e._queryParams),n=e._path.toString(),i=new b;return this.restRequest_(n+".json",t,(e,t)=>{let s=t;404===e&&(s=null,e=null),null===e?(this.onDataUpdate_(n,s,!1,null),i.resolve(s)):i.reject(new Error(s))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},n){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,s])=>{i&&i.accessToken&&(t.auth=i.accessToken),s&&s.token&&(t.ac=s.token);const r=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+function(e){const t=[];for(const[n,i]of Object.entries(e))Array.isArray(i)?i.forEach(e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(i));return t.length?"&"+t.join("&"):""}(t);this.log_("Sending REST request for "+r);const o=new XMLHttpRequest;o.onreadystatechange=()=>{if(n&&4===o.readyState){this.log_("REST Response for "+r+" received. status:",o.status,"response:",o.responseText);let e=null;if(o.status>=200&&o.status<300){try{e=N(o.responseText)}catch(e){Nt("Failed to parse JSON response for "+r+": "+o.responseText)}n(null,e)}else 401!==o.status&&404!==o.status&&Nt("Got unsuccessful REST response for "+r+" Status: "+o.status),n(o.status);n=null}},o.open("GET",r,!0),o.send()})}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class Ci{constructor(){this.rootNode_=oi.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */function Ii(){return{value:null,children:new Map}}function Ei(e,t,n){if(En(t))e.value=n,e.children.clear();else if(null!==e.value)e.value=e.value.updateChild(t,n);else{const i=gn(t);e.children.has(i)||e.children.set(i,Ii());Ei(e.children.get(i),t=vn(t),n)}}function xi(e,t,n){null!==e.value?n(t,e.value):function(e,t){e.children.forEach((e,n)=>{t(n,e)})}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */(e,(e,i)=>{xi(i,new _n(t.toString()+"/"+e),n)})}class Ti{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t={...e};return this.last_&&qt(this.last_,(e,n)=>{t[e]=t[e]-n}),this.last_=e,t}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class ki{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new Ti(e);const n=1e4+2e4*Math.random();Ht(this.reportStats_.bind(this),Math.floor(n))}reportStats_(){const e=this.statsListener_.get(),t={};let n=!1;qt(e,(e,i)=>{i>0&&D(this.statsToReport_,e)&&(t[e]=i,n=!0)}),n&&this.server_.reportStats(t),Ht(this.reportStats_.bind(this),Math.floor(2*Math.random()*3e5))}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */var Si;function Ni(e){return{fromUser:!1,fromServer:!0,queryId:e,tagged:!0}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */!function(e){e[e.OVERWRITE=0]="OVERWRITE",e[e.MERGE=1]="MERGE",e[e.ACK_USER_WRITE=2]="ACK_USER_WRITE",e[e.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"}(Si||(Si={}));class Pi{constructor(e,t,n){this.path=e,this.affectedTree=t,this.revert=n,this.type=Si.ACK_USER_WRITE,this.source={fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}operationForChild(e){if(En(this.path)){if(null!=this.affectedTree.value)return r(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new _n(e));return new Pi(mn(),t,this.revert)}}return r(gn(this.path)===e,"operationForChild called for unrelated child."),new Pi(vn(this.path),this.affectedTree,this.revert)}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class Ri{constructor(e,t){this.source=e,this.path=t,this.type=Si.LISTEN_COMPLETE}operationForChild(e){return En(this.path)?new Ri(this.source,mn()):new Ri(this.source,vn(this.path))}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class Di{constructor(e,t,n){this.source=e,this.path=t,this.snap=n,this.type=Si.OVERWRITE}operationForChild(e){return En(this.path)?new Di(this.source,mn(),this.snap.getImmediateChild(e)):new Di(this.source,vn(this.path),this.snap)}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class Ai{constructor(e,t,n){this.source=e,this.path=t,this.children=n,this.type=Si.MERGE}operationForChild(e){if(En(this.path)){const t=this.children.subtree(new _n(e));return t.isEmpty()?null:t.value?new Di(this.source,mn(),t.value):new Ai(this.source,mn(),t)}return r(gn(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Ai(this.source,vn(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class Mi{constructor(e,t,n){this.node_=e,this.fullyInitialized_=t,this.filtered_=n}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(En(e))return this.isFullyInitialized()&&!this.filtered_;const t=gn(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class Li{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function Fi(e,t,n,i,s,r){const a=i.filter(e=>e.type===n);a.sort((t,n)=>function(e,t,n){if(null==t.childName||null==n.childName)throw o("Should only compare child_ events.");const i=new Ln(t.childName,t.snapshotNode),s=new Ln(n.childName,n.snapshotNode);return e.index_.compare(i,s)}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */(e,t,n)),a.forEach(n=>{const i=function(e,t,n){return"value"===t.type||"child_removed"===t.type||(t.prevName=n.getPredecessorChildName(t.childName,t.snapshotNode,e.index_)),t}(e,n,r);s.forEach(s=>{s.respondsTo(n.type)&&t.push(s.createEvent(i,e.query_))})})}function Oi(e,t){return{eventCache:e,serverCache:t}}function qi(e,t,n,i){return Oi(new Mi(t,n,i),e.serverCache)}function Bi(e,t,n,i){return Oi(e.eventCache,new Mi(t,n,i))}function Wi(e){return e.eventCache.isFullyInitialized()?e.eventCache.getNode():null}function Ui(e){return e.serverCache.isFullyInitialized()?e.serverCache.getNode():null}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */let $i;class Hi{static fromObject(e){let t=new Hi(null);return qt(e,(e,n)=>{t=t.set(new _n(e),n)}),t}constructor(e,t=(()=>($i||($i=new $n(Mt)),$i))()){this.value=e,this.children=t}isEmpty(){return null===this.value&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(null!=this.value&&t(this.value))return{path:mn(),value:this.value};if(En(e))return null;{const n=gn(e),i=this.children.get(n);if(null!==i){const s=i.findRootMostMatchingPathAndValue(vn(e),t);if(null!=s){return{path:In(new _n(n),s.path),value:s.value}}return null}return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(En(e))return this;{const t=gn(e),n=this.children.get(t);return null!==n?n.subtree(vn(e)):new Hi(null)}}set(e,t){if(En(e))return new Hi(t,this.children);{const n=gn(e),i=(this.children.get(n)||new Hi(null)).set(vn(e),t),s=this.children.insert(n,i);return new Hi(this.value,s)}}remove(e){if(En(e))return this.children.isEmpty()?new Hi(null):new Hi(null,this.children);{const t=gn(e),n=this.children.get(t);if(n){const i=n.remove(vn(e));let s;return s=i.isEmpty()?this.children.remove(t):this.children.insert(t,i),null===this.value&&s.isEmpty()?new Hi(null):new Hi(this.value,s)}return this}}get(e){if(En(e))return this.value;{const t=gn(e),n=this.children.get(t);return n?n.get(vn(e)):null}}setTree(e,t){if(En(e))return t;{const n=gn(e),i=(this.children.get(n)||new Hi(null)).setTree(vn(e),t);let s;return s=i.isEmpty()?this.children.remove(n):this.children.insert(n,i),new Hi(this.value,s)}}fold(e){return this.fold_(mn(),e)}fold_(e,t){const n={};return this.children.inorderTraversal((i,s)=>{n[i]=s.fold_(In(e,i),t)}),t(e,this.value,n)}findOnPath(e,t){return this.findOnPath_(e,mn(),t)}findOnPath_(e,t,n){const i=!!this.value&&n(t,this.value);if(i)return i;if(En(e))return null;{const i=gn(e),s=this.children.get(i);return s?s.findOnPath_(vn(e),In(t,i),n):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,mn(),t)}foreachOnPath_(e,t,n){if(En(e))return this;{this.value&&n(t,this.value);const i=gn(e),s=this.children.get(i);return s?s.foreachOnPath_(vn(e),In(t,i),n):new Hi(null)}}foreach(e){this.foreach_(mn(),e)}foreach_(e,t){this.children.inorderTraversal((n,i)=>{i.foreach_(In(e,n),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,n)=>{n.value&&e(t,n.value)})}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class zi{constructor(e){this.writeTree_=e}static empty(){return new zi(new Hi(null))}}function ji(e,t,n){if(En(t))return new zi(new Hi(n));{const i=e.writeTree_.findRootMostValueAndPath(t);if(null!=i){const s=i.path;let r=i.value;const o=xn(s,t);return r=r.updateChild(o,n),new zi(e.writeTree_.set(s,r))}{const i=new Hi(n),s=e.writeTree_.setTree(t,i);return new zi(s)}}}function Vi(e,t,n){let i=e;return qt(n,(e,n)=>{i=ji(i,In(t,e),n)}),i}function Yi(e,t){if(En(t))return zi.empty();{const n=e.writeTree_.setTree(t,new Hi(null));return new zi(n)}}function Ki(e,t){return null!=Gi(e,t)}function Gi(e,t){const n=e.writeTree_.findRootMostValueAndPath(t);return null!=n?e.writeTree_.get(n.path).getChild(xn(n.path,t)):null}function Qi(e){const t=[],n=e.writeTree_.value;return null!=n?n.isLeafNode()||n.forEachChild(Zn,(e,n)=>{t.push(new Ln(e,n))}):e.writeTree_.children.inorderTraversal((e,n)=>{null!=n.value&&t.push(new Ln(e,n.value))}),t}function Ji(e,t){if(En(t))return e;{const n=Gi(e,t);return new zi(null!=n?new Hi(n):e.writeTree_.subtree(t))}}function Zi(e){return e.writeTree_.isEmpty()}function Xi(e,t){return es(mn(),e.writeTree_,t)}function es(e,t,n){if(null!=t.value)return n.updateChild(e,t.value);{let i=null;return t.children.inorderTraversal((t,s)=>{".priority"===t?(r(null!==s.value,"Priority writes must always be leaf nodes"),i=s.value):n=es(In(e,t),s,n)}),n.getChild(e).isEmpty()||null===i||(n=n.updateChild(In(e,".priority"),i)),n}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */function ts(e,t){return fs(t,e)}function ns(e,t){const n=e.allWrites.findIndex(e=>e.writeId===t);r(n>=0,"removeWrite called with nonexistent writeId.");const i=e.allWrites[n];e.allWrites.splice(n,1);let s=i.visible,o=!1,a=e.allWrites.length-1;for(;s&&a>=0;){const t=e.allWrites[a];t.visible&&(a>=n&&is(t,i.path)?s=!1:Sn(i.path,t.path)&&(o=!0)),a--}if(s){if(o)return function(e){e.visibleWrites=rs(e.allWrites,ss,mn()),e.allWrites.length>0?e.lastWriteId=e.allWrites[e.allWrites.length-1].writeId:e.lastWriteId=-1}(e),!0;if(i.snap)e.visibleWrites=Yi(e.visibleWrites,i.path);else{qt(i.children,t=>{e.visibleWrites=Yi(e.visibleWrites,In(i.path,t))})}return!0}return!1}function is(e,t){if(e.snap)return Sn(e.path,t);for(const n in e.children)if(e.children.hasOwnProperty(n)&&Sn(In(e.path,n),t))return!0;return!1}function ss(e){return e.visible}function rs(e,t,n){let i=zi.empty();for(let s=0;s<e.length;++s){const r=e[s];if(t(r)){const e=r.path;let t;if(r.snap)Sn(n,e)?(t=xn(n,e),i=ji(i,t,r.snap)):Sn(e,n)&&(t=xn(e,n),i=ji(i,mn(),r.snap.getChild(t)));else{if(!r.children)throw o("WriteRecord should have .snap or .children");if(Sn(n,e))t=xn(n,e),i=Vi(i,t,r.children);else if(Sn(e,n))if(t=xn(e,n),En(t))i=Vi(i,mn(),r.children);else{const e=A(r.children,gn(t));if(e){const n=e.getChild(vn(t));i=ji(i,mn(),n)}}}}}return i}function os(e,t,n,i,s){if(i||s){const r=Ji(e.visibleWrites,t);if(!s&&Zi(r))return n;if(s||null!=n||Ki(r,mn())){const r=function(e){return(e.visible||s)&&(!i||!~i.indexOf(e.writeId))&&(Sn(e.path,t)||Sn(t,e.path))};return Xi(rs(e.allWrites,r,t),n||oi.EMPTY_NODE)}return null}{const i=Gi(e.visibleWrites,t);if(null!=i)return i;{const i=Ji(e.visibleWrites,t);if(Zi(i))return n;if(null!=n||Ki(i,mn())){return Xi(i,n||oi.EMPTY_NODE)}return null}}}function as(e,t,n,i){return os(e.writeTree,e.treePath,t,n,i)}function ls(e,t){return function(e,t,n){let i=oi.EMPTY_NODE;const s=Gi(e.visibleWrites,t);if(s)return s.isLeafNode()||s.forEachChild(Zn,(e,t)=>{i=i.updateImmediateChild(e,t)}),i;if(n){const s=Ji(e.visibleWrites,t);return n.forEachChild(Zn,(e,t)=>{const n=Xi(Ji(s,new _n(e)),t);i=i.updateImmediateChild(e,n)}),Qi(s).forEach(e=>{i=i.updateImmediateChild(e.name,e.node)}),i}return Qi(Ji(e.visibleWrites,t)).forEach(e=>{i=i.updateImmediateChild(e.name,e.node)}),i}(e.writeTree,e.treePath,t)}function cs(e,t,n,i){return function(e,t,n,i,s){r(i||s,"Either existingEventSnap or existingServerSnap must exist");const o=In(t,n);if(Ki(e.visibleWrites,o))return null;{const t=Ji(e.visibleWrites,o);return Zi(t)?s.getChild(n):Xi(t,s.getChild(n))}}(e.writeTree,e.treePath,t,n,i)}function hs(e,t){return function(e,t){return Gi(e.visibleWrites,t)}(e.writeTree,In(e.treePath,t))}function ds(e,t,n,i,s,r){return function(e,t,n,i,s,r,o){let a;const l=Ji(e.visibleWrites,t),c=Gi(l,mn());if(null!=c)a=c;else{if(null==n)return[];a=Xi(l,n)}if(a=a.withIndex(o),a.isEmpty()||a.isLeafNode())return[];{const e=[],t=o.getCompare(),n=r?a.getReverseIteratorFrom(i,o):a.getIteratorFrom(i,o);let l=n.getNext();for(;l&&e.length<s;)0!==t(l,i)&&e.push(l),l=n.getNext();return e}}(e.writeTree,e.treePath,t,n,i,s,r)}function us(e,t,n){return function(e,t,n,i){const s=In(t,n),r=Gi(e.visibleWrites,s);if(null!=r)return r;if(i.isCompleteForChild(n))return Xi(Ji(e.visibleWrites,s),i.getNode().getImmediateChild(n));return null}(e.writeTree,e.treePath,t,n)}function ps(e,t){return fs(In(e.treePath,t),e.writeTree)}function fs(e,t){return{treePath:e,writeTree:t}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class _s{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,n=e.childName;r("child_added"===t||"child_changed"===t||"child_removed"===t,"Only child changes supported for tracking"),r(".priority"!==n,"Only non-priority child changes can be tracked.");const i=this.changeMap.get(n);if(i){const s=i.type;if("child_added"===t&&"child_removed"===s)this.changeMap.set(n,fi(n,e.snapshotNode,i.snapshotNode));else if("child_removed"===t&&"child_added"===s)this.changeMap.delete(n);else if("child_removed"===t&&"child_changed"===s)this.changeMap.set(n,pi(n,i.oldSnap));else if("child_changed"===t&&"child_added"===s)this.changeMap.set(n,ui(n,e.snapshotNode));else{if("child_changed"!==t||"child_changed"!==s)throw o("Illegal combination of changes: "+e+" occurred after "+i);this.changeMap.set(n,fi(n,e.snapshotNode,i.oldSnap))}}else this.changeMap.set(n,e)}getChanges(){return Array.from(this.changeMap.values())}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const ms=new class{getCompleteChild(e){return null}getChildAfterChild(e,t,n){return null}};class gs{constructor(e,t,n=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=n}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const t=null!=this.optCompleteServerCache_?new Mi(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return us(this.writes_,e,t)}}getChildAfterChild(e,t,n){const i=null!=this.optCompleteServerCache_?this.optCompleteServerCache_:Ui(this.viewCache_),s=ds(this.writes_,i,t,1,n,e);return 0===s.length?null:s[0]}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */function ys(e,t,n,i,s){const a=new _s;let l,c;if(n.type===Si.OVERWRITE){const o=n;o.source.fromUser?l=ws(e,t,o.path,o.snap,i,s,a):(r(o.source.fromServer,"Unknown source."),c=o.source.tagged||t.serverCache.isFiltered()&&!En(o.path),l=bs(e,t,o.path,o.snap,i,s,c,a))}else if(n.type===Si.MERGE){const o=n;o.source.fromUser?l=function(e,t,n,i,s,r,o){let a=t;return i.foreach((i,l)=>{const c=In(n,i);Cs(t,gn(c))&&(a=ws(e,a,c,l,s,r,o))}),i.foreach((i,l)=>{const c=In(n,i);Cs(t,gn(c))||(a=ws(e,a,c,l,s,r,o))}),a}(e,t,o.path,o.children,i,s,a):(r(o.source.fromServer,"Unknown source."),c=o.source.tagged||t.serverCache.isFiltered(),l=Es(e,t,o.path,o.children,i,s,c,a))}else if(n.type===Si.ACK_USER_WRITE){const o=n;l=o.revert?function(e,t,n,i,s,o){let a;if(null!=hs(i,n))return t;{const l=new gs(i,t,s),c=t.eventCache.getNode();let h;if(En(n)||".priority"===gn(n)){let n;if(t.serverCache.isFullyInitialized())n=as(i,Ui(t));else{const e=t.serverCache.getNode();r(e instanceof oi,"serverChildren would be complete if leaf node"),n=ls(i,e)}h=e.filter.updateFullNode(c,n,o)}else{const s=gn(n);let r=us(i,s,t.serverCache);null==r&&t.serverCache.isCompleteForChild(s)&&(r=c.getImmediateChild(s)),h=null!=r?e.filter.updateChild(c,s,r,vn(n),l,o):t.eventCache.getNode().hasChild(s)?e.filter.updateChild(c,s,oi.EMPTY_NODE,vn(n),l,o):c,h.isEmpty()&&t.serverCache.isFullyInitialized()&&(a=as(i,Ui(t)),a.isLeafNode()&&(h=e.filter.updateFullNode(h,a,o)))}return a=t.serverCache.isFullyInitialized()||null!=hs(i,mn()),qi(t,h,a,e.filter.filtersNodes())}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */(e,t,o.path,i,s,a):function(e,t,n,i,s,r,o){if(null!=hs(s,n))return t;const a=t.serverCache.isFiltered(),l=t.serverCache;if(null!=i.value){if(En(n)&&l.isFullyInitialized()||l.isCompleteForPath(n))return bs(e,t,n,l.getNode().getChild(n),s,r,a,o);if(En(n)){let i=new Hi(null);return l.getNode().forEachChild(Bn,(e,t)=>{i=i.set(new _n(e),t)}),Es(e,t,n,i,s,r,a,o)}return t}{let c=new Hi(null);return i.foreach((e,t)=>{const i=In(n,e);l.isCompleteForPath(i)&&(c=c.set(e,l.getNode().getChild(i)))}),Es(e,t,n,c,s,r,a,o)}}(e,t,o.path,o.affectedTree,i,s,a)}else{if(n.type!==Si.LISTEN_COMPLETE)throw o("Unknown operation type: "+n.type);l=function(e,t,n,i,s){const r=t.serverCache,o=Bi(t,r.getNode(),r.isFullyInitialized()||En(n),r.isFiltered());return vs(e,o,n,i,ms,s)}(e,t,n.path,i,a)}const h=a.getChanges();return function(e,t,n){const i=t.eventCache;if(i.isFullyInitialized()){const s=i.getNode().isLeafNode()||i.getNode().isEmpty(),r=Wi(e);(n.length>0||!e.eventCache.isFullyInitialized()||s&&!i.getNode().equals(r)||!i.getNode().getPriority().equals(r.getPriority()))&&n.push(di(Wi(t)))}}(t,l,h),{viewCache:l,changes:h}}function vs(e,t,n,i,s,o){const a=t.eventCache;if(null!=hs(i,n))return t;{let l,c;if(En(n))if(r(t.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),t.serverCache.isFiltered()){const n=Ui(t),s=ls(i,n instanceof oi?n:oi.EMPTY_NODE);l=e.filter.updateFullNode(t.eventCache.getNode(),s,o)}else{const n=as(i,Ui(t));l=e.filter.updateFullNode(t.eventCache.getNode(),n,o)}else{const h=gn(n);if(".priority"===h){r(1===yn(n),"Can't have a priority with additional path components");const s=a.getNode();c=t.serverCache.getNode();const o=cs(i,n,s,c);l=null!=o?e.filter.updatePriority(s,o):a.getNode()}else{const r=vn(n);let d;if(a.isCompleteForChild(h)){c=t.serverCache.getNode();const e=cs(i,n,a.getNode(),c);d=null!=e?a.getNode().getImmediateChild(h).updateChild(r,e):a.getNode().getImmediateChild(h)}else d=us(i,h,t.serverCache);l=null!=d?e.filter.updateChild(a.getNode(),h,d,r,s,o):a.getNode()}}return qi(t,l,a.isFullyInitialized()||En(n),e.filter.filtersNodes())}}function bs(e,t,n,i,s,r,o,a){const l=t.serverCache;let c;const h=o?e.filter:e.filter.getIndexedFilter();if(En(n))c=h.updateFullNode(l.getNode(),i,null);else if(h.filtersNodes()&&!l.isFiltered()){const e=l.getNode().updateChild(n,i);c=h.updateFullNode(l.getNode(),e,null)}else{const e=gn(n);if(!l.isCompleteForPath(n)&&yn(n)>1)return t;const s=vn(n),r=l.getNode().getImmediateChild(e).updateChild(s,i);c=".priority"===e?h.updatePriority(l.getNode(),r):h.updateChild(l.getNode(),e,r,s,ms,null)}const d=Bi(t,c,l.isFullyInitialized()||En(n),h.filtersNodes());return vs(e,d,n,s,new gs(s,d,r),a)}function ws(e,t,n,i,s,r,o){const a=t.eventCache;let l,c;const h=new gs(s,t,r);if(En(n))c=e.filter.updateFullNode(t.eventCache.getNode(),i,o),l=qi(t,c,!0,e.filter.filtersNodes());else{const s=gn(n);if(".priority"===s)c=e.filter.updatePriority(t.eventCache.getNode(),i),l=qi(t,c,a.isFullyInitialized(),a.isFiltered());else{const r=vn(n),c=a.getNode().getImmediateChild(s);let d;if(En(r))d=i;else{const e=h.getCompleteChild(s);d=null!=e?".priority"===bn(r)&&e.getChild(Cn(r)).isEmpty()?e:e.updateChild(r,i):oi.EMPTY_NODE}if(c.equals(d))l=t;else{l=qi(t,e.filter.updateChild(a.getNode(),s,d,r,h,o),a.isFullyInitialized(),e.filter.filtersNodes())}}}return l}function Cs(e,t){return e.eventCache.isCompleteForChild(t)}function Is(e,t,n){return n.foreach((e,n)=>{t=t.updateChild(e,n)}),t}function Es(e,t,n,i,s,r,o,a){if(t.serverCache.getNode().isEmpty()&&!t.serverCache.isFullyInitialized())return t;let l,c=t;l=En(n)?i:new Hi(null).setTree(n,i);const h=t.serverCache.getNode();return l.children.inorderTraversal((n,i)=>{if(h.hasChild(n)){const l=Is(0,t.serverCache.getNode().getImmediateChild(n),i);c=bs(e,c,new _n(n),l,s,r,o,a)}}),l.children.inorderTraversal((n,i)=>{const l=!t.serverCache.isCompleteForChild(n)&&null===i.value;if(!h.hasChild(n)&&!l){const l=Is(0,t.serverCache.getNode().getImmediateChild(n),i);c=bs(e,c,new _n(n),l,s,r,o,a)}}),c}class xs{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const n=this.query_._queryParams,i=new _i(n.getIndex()),s=(r=n).loadsAllData()?new _i(r.getIndex()):r.hasLimit()?new gi(r):new mi(r);var r;this.processor_=function(e){return{filter:e}}(s);const o=t.serverCache,a=t.eventCache,l=i.updateFullNode(oi.EMPTY_NODE,o.getNode(),null),c=s.updateFullNode(oi.EMPTY_NODE,a.getNode(),null),h=new Mi(l,o.isFullyInitialized(),i.filtersNodes()),d=new Mi(c,a.isFullyInitialized(),s.filtersNodes());this.viewCache_=Oi(d,h),this.eventGenerator_=new Li(this.query_)}get query(){return this.query_}}function Ts(e,t){const n=Ui(e.viewCache_);return n&&(e.query._queryParams.loadsAllData()||!En(t)&&!n.getImmediateChild(gn(t)).isEmpty())?n.getChild(t):null}function ks(e){return 0===e.eventRegistrations_.length}function Ss(e,t,n){const i=[];if(n){r(null==t,"A cancel should cancel all event registrations.");const s=e.query._path;e.eventRegistrations_.forEach(e=>{const t=e.createCancelEvent(n,s);t&&i.push(t)})}if(t){let n=[];for(let i=0;i<e.eventRegistrations_.length;++i){const s=e.eventRegistrations_[i];if(s.matches(t)){if(t.hasAnyCallback()){n=n.concat(e.eventRegistrations_.slice(i+1));break}}else n.push(s)}e.eventRegistrations_=n}else e.eventRegistrations_=[];return i}function Ns(e,t,n,i){t.type===Si.MERGE&&null!==t.source.queryId&&(r(Ui(e.viewCache_),"We should always have a full cache before handling merges"),r(Wi(e.viewCache_),"Missing event cache, even though we have a server cache"));const s=e.viewCache_,o=ys(e.processor_,s,t,n,i);var a,l;return a=e.processor_,l=o.viewCache,r(l.eventCache.getNode().isIndexed(a.filter.getIndex()),"Event snap not indexed"),r(l.serverCache.getNode().isIndexed(a.filter.getIndex()),"Server snap not indexed"),r(o.viewCache.serverCache.isFullyInitialized()||!s.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),e.viewCache_=o.viewCache,Ps(e,o.changes,o.viewCache.eventCache.getNode(),null)}function Ps(e,t,n,i){const s=i?[i]:e.eventRegistrations_;return function(e,t,n,i){const s=[],r=[];return t.forEach(t=>{var n;"child_changed"===t.type&&e.index_.indexedValueChanged(t.oldSnap,t.snapshotNode)&&r.push((n=t.childName,{type:"child_moved",snapshotNode:t.snapshotNode,childName:n}))}),Fi(e,s,"child_removed",t,i,n),Fi(e,s,"child_added",t,i,n),Fi(e,s,"child_moved",r,i,n),Fi(e,s,"child_changed",t,i,n),Fi(e,s,"value",t,i,n),s}(e.eventGenerator_,t,n,s)}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */let Rs,Ds;class As{constructor(){this.views=new Map}}function Ms(e,t,n,i){const s=t.source.queryId;if(null!==s){const o=e.views.get(s);return r(null!=o,"SyncTree gave us an op for an invalid query."),Ns(o,t,n,i)}{let s=[];for(const r of e.views.values())s=s.concat(Ns(r,t,n,i));return s}}function Ls(e,t,n,i,s){const r=t._queryIdentifier,o=e.views.get(r);if(!o){let e=as(n,s?i:null),r=!1;e?r=!0:i instanceof oi?(e=ls(n,i),r=!1):(e=oi.EMPTY_NODE,r=!1);const o=Oi(new Mi(e,r,!1),new Mi(i,s,!1));return new xs(t,o)}return o}function Fs(e,t,n,i,s,r){const o=Ls(e,t,i,s,r);return e.views.has(t._queryIdentifier)||e.views.set(t._queryIdentifier,o),function(e,t){e.eventRegistrations_.push(t)}(o,n),function(e,t){const n=e.viewCache_.eventCache,i=[];n.getNode().isLeafNode()||n.getNode().forEachChild(Zn,(e,t)=>{i.push(ui(e,t))});return n.isFullyInitialized()&&i.push(di(n.getNode())),Ps(e,i,n.getNode(),t)}(o,n)}function Os(e,t,n,i){const s=t._queryIdentifier,o=[];let a=[];const l=$s(e);if("default"===s)for(const[t,s]of e.views.entries())a=a.concat(Ss(s,n,i)),ks(s)&&(e.views.delete(t),s.query._queryParams.loadsAllData()||o.push(s.query));else{const t=e.views.get(s);t&&(a=a.concat(Ss(t,n,i)),ks(t)&&(e.views.delete(s),t.query._queryParams.loadsAllData()||o.push(t.query)))}return l&&!$s(e)&&o.push(new(r(Rs,"Reference.ts has not been loaded"),Rs)(t._repo,t._path)),{removed:o,events:a}}function qs(e){const t=[];for(const n of e.views.values())n.query._queryParams.loadsAllData()||t.push(n);return t}function Bs(e,t){let n=null;for(const i of e.views.values())n=n||Ts(i,t);return n}function Ws(e,t){if(t._queryParams.loadsAllData())return Hs(e);{const n=t._queryIdentifier;return e.views.get(n)}}function Us(e,t){return null!=Ws(e,t)}function $s(e){return null!=Hs(e)}function Hs(e){for(const t of e.views.values())if(t.query._queryParams.loadsAllData())return t;return null}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */let zs=1;class js{constructor(e){this.listenProvider_=e,this.syncPointTree_=new Hi(null),this.pendingWriteTree_={visibleWrites:zi.empty(),allWrites:[],lastWriteId:-1},this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Vs(e,t,n,i,s){return function(e,t,n,i,s){r(i>e.lastWriteId,"Stacking an older write on top of newer ones"),void 0===s&&(s=!0),e.allWrites.push({path:t,snap:n,writeId:i,visible:s}),s&&(e.visibleWrites=ji(e.visibleWrites,t,n)),e.lastWriteId=i}(e.pendingWriteTree_,t,n,i,s),s?tr(e,new Di({fromUser:!0,fromServer:!1,queryId:null,tagged:!1},t,n)):[]}function Ys(e,t,n,i){!function(e,t,n,i){r(i>e.lastWriteId,"Stacking an older merge on top of newer ones"),e.allWrites.push({path:t,children:n,writeId:i,visible:!0}),e.visibleWrites=Vi(e.visibleWrites,t,n),e.lastWriteId=i}(e.pendingWriteTree_,t,n,i);const s=Hi.fromObject(n);return tr(e,new Ai({fromUser:!0,fromServer:!1,queryId:null,tagged:!1},t,s))}function Ks(e,t,n=!1){const i=function(e,t){for(let n=0;n<e.allWrites.length;n++){const i=e.allWrites[n];if(i.writeId===t)return i}return null}(e.pendingWriteTree_,t);if(ns(e.pendingWriteTree_,t)){let t=new Hi(null);return null!=i.snap?t=t.set(mn(),!0):qt(i.children,e=>{t=t.set(new _n(e),!0)}),tr(e,new Pi(i.path,t,n))}return[]}function Gs(e,t,n){return tr(e,new Di({fromUser:!1,fromServer:!0,queryId:null,tagged:!1},t,n))}function Qs(e,t,n,i,s=!1){const r=t._path,o=e.syncPointTree_.get(r);let a=[];if(o&&("default"===t._queryIdentifier||Us(o,t))){const l=Os(o,t,n,i);0===o.views.size&&(e.syncPointTree_=e.syncPointTree_.remove(r));const c=l.removed;if(a=l.events,!s){const n=-1!==c.findIndex(e=>e._queryParams.loadsAllData()),s=e.syncPointTree_.findOnPath(r,(e,t)=>$s(t));if(n&&!s){const t=e.syncPointTree_.subtree(r);if(!t.isEmpty()){const n=function(e){return e.fold((e,t,n)=>{if(t&&$s(t)){return[Hs(t)]}{let e=[];return t&&(e=qs(t)),qt(n,(t,n)=>{e=e.concat(n)}),e}})}(t);for(let t=0;t<n.length;++t){const i=n[t],s=i.query,r=sr(e,i);e.listenProvider_.startListening(hr(s),rr(e,s),r.hashFn,r.onComplete)}}}if(!s&&c.length>0&&!i)if(n){const n=null;e.listenProvider_.stopListening(hr(t),n)}else c.forEach(t=>{const n=e.queryToTagMap.get(or(t));e.listenProvider_.stopListening(hr(t),n)})}!function(e,t){for(let n=0;n<t.length;++n){const i=t[n];if(!i._queryParams.loadsAllData()){const t=or(i),n=e.queryToTagMap.get(t);e.queryToTagMap.delete(t),e.tagToQueryMap.delete(n)}}}(e,c)}return a}function Js(e,t,n,i){const s=ar(e,i);if(null!=s){const i=lr(s),r=i.path,o=i.queryId,a=xn(r,t);return cr(e,r,new Di(Ni(o),a,n))}return[]}function Zs(e,t,n,i=!1){const s=t._path;let o=null,a=!1;e.syncPointTree_.foreachOnPath(s,(e,t)=>{const n=xn(e,s);o=o||Bs(t,n),a=a||$s(t)});let l,c=e.syncPointTree_.get(s);if(c?(a=a||$s(c),o=o||Bs(c,mn())):(c=new As,e.syncPointTree_=e.syncPointTree_.set(s,c)),null!=o)l=!0;else{l=!1,o=oi.EMPTY_NODE;e.syncPointTree_.subtree(s).foreachChild((e,t)=>{const n=Bs(t,mn());n&&(o=o.updateImmediateChild(e,n))})}const h=Us(c,t);if(!h&&!t._queryParams.loadsAllData()){const n=or(t);r(!e.queryToTagMap.has(n),"View does not exist, but we have a tag");const i=zs++;e.queryToTagMap.set(n,i),e.tagToQueryMap.set(i,n)}let d=Fs(c,t,n,ts(e.pendingWriteTree_,s),o,l);if(!h&&!a&&!i){const n=Ws(c,t);d=d.concat(function(e,t,n){const i=t._path,s=rr(e,t),o=sr(e,n),a=e.listenProvider_.startListening(hr(t),s,o.hashFn,o.onComplete),l=e.syncPointTree_.subtree(i);if(s)r(!$s(l.value),"If we're adding a query, it shouldn't be shadowed");else{const t=l.fold((e,t,n)=>{if(!En(e)&&t&&$s(t))return[Hs(t).query];{let e=[];return t&&(e=e.concat(qs(t).map(e=>e.query))),qt(n,(t,n)=>{e=e.concat(n)}),e}});for(let n=0;n<t.length;++n){const i=t[n];e.listenProvider_.stopListening(hr(i),rr(e,i))}}return a}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */(e,t,n))}return d}function Xs(e,t,n){const i=e.pendingWriteTree_,s=e.syncPointTree_.findOnPath(t,(e,n)=>{const i=Bs(n,xn(e,t));if(i)return i});return os(i,t,s,n,!0)}function er(e,t){const n=t._path;let i=null;e.syncPointTree_.foreachOnPath(n,(e,t)=>{const s=xn(e,n);i=i||Bs(t,s)});let s=e.syncPointTree_.get(n);s?i=i||Bs(s,mn()):(s=new As,e.syncPointTree_=e.syncPointTree_.set(n,s));const r=null!=i,o=r?new Mi(i,!0,!1):null;return function(e){return Wi(e.viewCache_)}(Ls(s,t,ts(e.pendingWriteTree_,t._path),r?o.getNode():oi.EMPTY_NODE,r))}function tr(e,t){return nr(t,e.syncPointTree_,null,ts(e.pendingWriteTree_,mn()))}function nr(e,t,n,i){if(En(e.path))return ir(e,t,n,i);{const s=t.get(mn());null==n&&null!=s&&(n=Bs(s,mn()));let r=[];const o=gn(e.path),a=e.operationForChild(o),l=t.children.get(o);if(l&&a){const e=n?n.getImmediateChild(o):null,t=ps(i,o);r=r.concat(nr(a,l,e,t))}return s&&(r=r.concat(Ms(s,e,i,n))),r}}function ir(e,t,n,i){const s=t.get(mn());null==n&&null!=s&&(n=Bs(s,mn()));let r=[];return t.children.inorderTraversal((t,s)=>{const o=n?n.getImmediateChild(t):null,a=ps(i,t),l=e.operationForChild(t);l&&(r=r.concat(ir(l,s,o,a)))}),s&&(r=r.concat(Ms(s,e,i,n))),r}function sr(e,t){const n=t.query,i=rr(e,n);return{hashFn:()=>{const e=function(e){return e.viewCache_.serverCache.getNode()}(t)||oi.EMPTY_NODE;return e.hash()},onComplete:t=>{if("ok"===t)return i?function(e,t,n){const i=ar(e,n);if(i){const n=lr(i),s=n.path,r=n.queryId,o=xn(s,t);return cr(e,s,new Ri(Ni(r),o))}return[]}(e,n._path,i):function(e,t){return tr(e,new Ri({fromUser:!1,fromServer:!0,queryId:null,tagged:!1},t))}(e,n._path);{const i=function(e,t){let n="Unknown Error";"too_big"===e?n="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"===e?n="Client doesn't have permission to access the desired data.":"unavailable"===e&&(n="The service is unavailable");const i=new Error(e+" at "+t._path.toString()+": "+n);return i.code=e.toUpperCase(),i}(t,n);return Qs(e,n,null,i)}}}}function rr(e,t){const n=or(t);return e.queryToTagMap.get(n)}function or(e){return e._path.toString()+"$"+e._queryIdentifier}function ar(e,t){return e.tagToQueryMap.get(t)}function lr(e){const t=e.indexOf("$");return r(-1!==t&&t<e.length-1,"Bad queryKey."),{queryId:e.substr(t+1),path:new _n(e.substr(0,t))}}function cr(e,t,n){const i=e.syncPointTree_.get(t);r(i,"Missing sync point for query tag that we're tracking");return Ms(i,n,ts(e.pendingWriteTree_,t),null)}function hr(e){return e._queryParams.loadsAllData()&&!e._queryParams.isDefault()?new(r(Ds,"Reference.ts has not been loaded"),Ds)(e._repo,e._path):e}class dr{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new dr(t)}node(){return this.node_}}class ur{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=In(this.path_,e);return new ur(this.syncTree_,t)}node(){return Xs(this.syncTree_,this.path_)}}const pr=function(e,t,n){return e&&"object"==typeof e?(r(".sv"in e,"Unexpected leaf node or priority contents"),"string"==typeof e[".sv"]?fr(e[".sv"],t,n):"object"==typeof e[".sv"]?_r(e[".sv"],t):void r(!1,"Unexpected server value: "+JSON.stringify(e,null,2))):e},fr=function(e,t,n){if("timestamp"===e)return n.timestamp;r(!1,"Unexpected server value: "+e)},_r=function(e,t,n){e.hasOwnProperty("increment")||r(!1,"Unexpected server value: "+JSON.stringify(e,null,2));const i=e.increment;"number"!=typeof i&&r(!1,"Unexpected increment value: "+i);const s=t.node();if(r(null!=s,"Expected ChildrenNode.EMPTY_NODE for nulls"),!s.isLeafNode())return i;const o=s.getValue();return"number"!=typeof o?i:o+i},mr=function(e,t,n,i){return yr(t,new ur(n,e),i)},gr=function(e,t,n){return yr(e,new dr(t),n)};function yr(e,t,n){const i=e.getPriority().val(),s=pr(i,t.getImmediateChild(".priority"),n);let r;if(e.isLeafNode()){const i=e,r=pr(i.getValue(),t,n);return r!==i.getValue()||s!==i.getPriority().val()?new Jn(r,li(s)):e}{const i=e;return r=i,s!==i.getPriority().val()&&(r=r.updatePriority(new Jn(s))),i.forEachChild(Zn,(e,i)=>{const s=yr(i,t.getImmediateChild(e),n);s!==i&&(r=r.updateImmediateChild(e,s))}),r}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class vr{constructor(e="",t=null,n={children:{},childCount:0}){this.name=e,this.parent=t,this.node=n}}function br(e,t){let n=t instanceof _n?t:new _n(t),i=e,s=gn(n);for(;null!==s;){const e=A(i.node.children,s)||{children:{},childCount:0};i=new vr(s,i,e),n=vn(n),s=gn(n)}return i}function wr(e){return e.node.value}function Cr(e,t){e.node.value=t,kr(e)}function Ir(e){return e.node.childCount>0}function Er(e,t){qt(e.node.children,(n,i)=>{t(new vr(n,e,i))})}function xr(e,t,n,i){n&&t(e),Er(e,e=>{xr(e,t,!0)})}function Tr(e){return new _n(null===e.parent?e.name:Tr(e.parent)+"/"+e.name)}function kr(e){null!==e.parent&&function(e,t,n){const i=function(e){return void 0===wr(e)&&!Ir(e)}(n),s=D(e.node.children,t);i&&s?(delete e.node.children[t],e.node.childCount--,kr(e)):i||s||(e.node.children[t]=n.node,e.node.childCount++,kr(e))}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */(e.parent,e.name,e)}const Sr=/[\[\].#$\/\u0000-\u001F\u007F]/,Nr=/[\[\].#$\u0000-\u001F\u007F]/,Pr=10485760,Rr=function(e){return"string"==typeof e&&0!==e.length&&!Sr.test(e)},Dr=function(e){return"string"==typeof e&&0!==e.length&&!Nr.test(e)},Ar=function(e,t,n,i){i&&void 0===t||Mr(B(e,"value"),t,n)},Mr=function(e,t,n){const i=n instanceof _n?new Nn(n,e):n;if(void 0===t)throw new Error(e+"contains undefined "+Rn(i));if("function"==typeof t)throw new Error(e+"contains a function "+Rn(i)+" with contents = "+t.toString());if(Pt(t))throw new Error(e+"contains "+t.toString()+" "+Rn(i));if("string"==typeof t&&t.length>Pr/3&&W(t)>Pr)throw new Error(e+"contains a string greater than "+Pr+" utf8 bytes "+Rn(i)+" ('"+t.substring(0,50)+"...')");if(t&&"object"==typeof t){let n=!1,s=!1;if(qt(t,(t,r)=>{if(".value"===t)n=!0;else if(".priority"!==t&&".sv"!==t&&(s=!0,!Rr(t)))throw new Error(e+" contains an invalid key ("+t+") "+Rn(i)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');!function(e,t){e.parts_.length>0&&(e.byteLength_+=1),e.parts_.push(t),e.byteLength_+=W(t),Pn(e)}(i,t),Mr(e,r,i),function(e){const t=e.parts_.pop();e.byteLength_-=W(t),e.parts_.length>0&&(e.byteLength_-=1)}(i)}),n&&s)throw new Error(e+' contains ".value" child '+Rn(i)+" in addition to actual children.")}},Lr=function(e,t,n,i){const s=B(e,"values");if(!t||"object"!=typeof t||Array.isArray(t))throw new Error(s+" must be an object containing the children to replace.");const r=[];qt(t,(e,t)=>{const i=new _n(e);if(Mr(s,t,In(n,i)),".priority"===bn(i)&&!(null===(o=t)||"string"==typeof o||"number"==typeof o&&!Pt(o)||o&&"object"==typeof o&&D(o,".sv")))throw new Error(s+"contains an invalid value for '"+i.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");var o;r.push(i)}),function(e,t){let n,i;for(n=0;n<t.length;n++){i=t[n];const s=wn(i);for(let t=0;t<s.length;t++)if(".priority"===s[t]&&t===s.length-1);else if(!Rr(s[t]))throw new Error(e+"contains an invalid key ("+s[t]+") in path "+i.toString()+'. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"')}t.sort(Tn);let s=null;for(n=0;n<t.length;n++){if(i=t[n],null!==s&&Sn(s,i))throw new Error(e+"contains a path "+s.toString()+" that is ancestor of another path "+i.toString());s=i}}(s,r)},Fr=function(e,t,n,i){if(!Dr(n))throw new Error(B(e,t)+'was an invalid path = "'+n+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"')},Or=function(e,t){if(".info"===gn(t))throw new Error(e+" failed = Can't modify data under /.info/")},qr=function(e,t){const n=t.path.toString();if("string"!=typeof t.repoInfo.host||0===t.repoInfo.host.length||!Rr(t.repoInfo.namespace)&&"localhost"!==t.repoInfo.host.split(":")[0]||0!==n.length&&!function(e){return e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),Dr(e)}(n))throw new Error(B(e,"url")+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".')};
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class Br{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Wr(e,t){let n=null;for(let i=0;i<t.length;i++){const s=t[i],r=s.getPath();null===n||kn(r,n.path)||(e.eventLists_.push(n),n=null),null===n&&(n={events:[],path:r}),n.events.push(s)}n&&e.eventLists_.push(n)}function Ur(e,t,n){Wr(e,n),Hr(e,e=>kn(e,t))}function $r(e,t,n){Wr(e,n),Hr(e,e=>Sn(e,t)||Sn(t,e))}function Hr(e,t){e.recursionDepth_++;let n=!0;for(let i=0;i<e.eventLists_.length;i++){const s=e.eventLists_[i];if(s){t(s.path)?(zr(e.eventLists_[i]),e.eventLists_[i]=null):n=!1}}n&&(e.eventLists_=[]),e.recursionDepth_--}function zr(e){for(let t=0;t<e.events.length;t++){const n=e.events[t];if(null!==n){e.events[t]=null;const i=n.getEventRunner();It&&xt("event: "+n.toString()),$t(i)}}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class jr{constructor(e,t,n,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=n,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new Br,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Ii(),this.transactionQueueTree_=new vr,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function Vr(e,t,n){if(e.stats_=nn(e.repoInfo_),e.forceRestClient_||("object"==typeof window&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0)e.server_=new wi(e.repoInfo_,(t,n,i,s)=>{Gr(e,t,n,i,s)},e.authTokenProvider_,e.appCheckProvider_),setTimeout(()=>Qr(e,!0),0);else{if(null!=n){if("object"!=typeof n)throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{P(n)}catch(e){throw new Error("Invalid authOverride provided: "+e)}}e.persistentConnection_=new Mn(e.repoInfo_,t,(t,n,i,s)=>{Gr(e,t,n,i,s)},t=>{Qr(e,t)},t=>{!function(e,t){qt(t,(t,n)=>{Jr(e,t,n)})}(e,t)},e.authTokenProvider_,e.appCheckProvider_,n),e.server_=e.persistentConnection_}e.authTokenProvider_.addTokenChangeListener(t=>{e.server_.refreshAuthToken(t)}),e.appCheckProvider_.addTokenChangeListener(t=>{e.server_.refreshAppCheckToken(t.token)}),e.statsReporter_=function(e,t){const n=e.toString();return tn[n]||(tn[n]=t()),tn[n]}(e.repoInfo_,()=>new ki(e.stats_,e.server_)),e.infoData_=new Ci,e.infoSyncTree_=new js({startListening:(t,n,i,s)=>{let r=[];const o=e.infoData_.getNode(t._path);return o.isEmpty()||(r=Gs(e.infoSyncTree_,t._path,o),setTimeout(()=>{s("ok")},0)),r},stopListening:()=>{}}),Jr(e,"connected",!1),e.serverSyncTree_=new js({startListening:(t,n,i,s)=>(e.server_.listen(t,i,n,(n,i)=>{const r=s(n,i);$r(e.eventQueue_,t._path,r)}),[]),stopListening:(t,n)=>{e.server_.unlisten(t,n)}})}function Yr(e){const t=e.infoData_.getNode(new _n(".info/serverTimeOffset")).val()||0;return(new Date).getTime()+t}function Kr(e){return(t=(t={timestamp:Yr(e)})||{}).timestamp=t.timestamp||(new Date).getTime(),t;var t}function Gr(e,t,n,i,s){e.dataUpdateCount++;const r=new _n(t);n=e.interceptServerDataCallback_?e.interceptServerDataCallback_(t,n):n;let o=[];if(s)if(i){const t=L(n,e=>li(e));o=function(e,t,n,i){const s=ar(e,i);if(s){const i=lr(s),r=i.path,o=i.queryId,a=xn(r,t),l=Hi.fromObject(n);return cr(e,r,new Ai(Ni(o),a,l))}return[]}(e.serverSyncTree_,r,t,s)}else{const t=li(n);o=Js(e.serverSyncTree_,r,t,s)}else if(i){const t=L(n,e=>li(e));o=function(e,t,n){const i=Hi.fromObject(n);return tr(e,new Ai({fromUser:!1,fromServer:!0,queryId:null,tagged:!1},t,i))}(e.serverSyncTree_,r,t)}else{const t=li(n);o=Gs(e.serverSyncTree_,r,t)}let a=r;o.length>0&&(a=io(e,r)),$r(e.eventQueue_,a,o)}function Qr(e,t){Jr(e,"connected",t),!1===t&&function(e){Xr(e,"onDisconnectEvents");const t=Kr(e),n=Ii();xi(e.onDisconnect_,mn(),(i,s)=>{const r=mr(i,s,e.serverSyncTree_,t);Ei(n,i,r)});let i=[];xi(n,mn(),(t,n)=>{i=i.concat(Gs(e.serverSyncTree_,t,n));const s=lo(e,t);io(e,s)}),e.onDisconnect_=Ii(),$r(e.eventQueue_,mn(),i)}(e)}function Jr(e,t,n){const i=new _n("/.info/"+t),s=li(n);e.infoData_.updateSnapshot(i,s);const r=Gs(e.infoSyncTree_,i,s);$r(e.eventQueue_,i,r)}function Zr(e){return e.nextWriteId_++}function Xr(e,...t){let n="";e.persistentConnection_&&(n=e.persistentConnection_.id+":"),xt(n,...t)}function eo(e,t,n,i){t&&$t(()=>{if("ok"===n)t(null);else{const e=(n||"error").toUpperCase();let s=e;i&&(s+=": "+i);const r=new Error(s);r.code=e,t(r)}})}function to(e,t,n){return Xs(e.serverSyncTree_,t,n)||oi.EMPTY_NODE}function no(e,t=e.transactionQueueTree_){if(t||ao(e,t),wr(t)){const n=ro(e,t);r(n.length>0,"Sending zero length transaction queue");n.every(e=>0===e.status)&&function(e,t,n){const i=n.map(e=>e.currentWriteId),s=to(e,t,i);let o=s;const a=s.hash();for(let e=0;e<n.length;e++){const i=n[e];r(0===i.status,"tryToSendTransactionQueue_: items in queue should all be run."),i.status=1,i.retryCount++;const s=xn(t,i.path);o=o.updateChild(s,i.currentOutputSnapshotRaw)}const l=o.val(!0),c=t;e.server_.put(c.toString(),l,i=>{Xr(e,"transaction put response",{path:c.toString(),status:i});let s=[];if("ok"===i){const i=[];for(let t=0;t<n.length;t++)n[t].status=2,s=s.concat(Ks(e.serverSyncTree_,n[t].currentWriteId)),n[t].onComplete&&i.push(()=>n[t].onComplete(null,!0,n[t].currentOutputSnapshotResolved)),n[t].unwatcher();ao(e,br(e.transactionQueueTree_,t)),no(e,e.transactionQueueTree_),$r(e.eventQueue_,t,s);for(let e=0;e<i.length;e++)$t(i[e])}else{if("datastale"===i)for(let e=0;e<n.length;e++)3===n[e].status?n[e].status=4:n[e].status=0;else{Nt("transaction at "+c.toString()+" failed: "+i);for(let e=0;e<n.length;e++)n[e].status=4,n[e].abortReason=i}io(e,t)}},a)}(e,Tr(t),n)}else Ir(t)&&Er(t,t=>{no(e,t)})}function io(e,t){const n=so(e,t),i=Tr(n);return function(e,t,n){if(0===t.length)return;const i=[];let s=[];const o=t.filter(e=>0===e.status),a=o.map(e=>e.currentWriteId);for(let o=0;o<t.length;o++){const l=t[o],c=xn(n,l.path);let h,d=!1;if(r(null!==c,"rerunTransactionsUnderNode_: relativePath should not be null."),4===l.status)d=!0,h=l.abortReason,s=s.concat(Ks(e.serverSyncTree_,l.currentWriteId,!0));else if(0===l.status)if(l.retryCount>=25)d=!0,h="maxretry",s=s.concat(Ks(e.serverSyncTree_,l.currentWriteId,!0));else{const n=to(e,l.path,a);l.currentInputSnapshot=n;const i=t[o].update(n.val());if(void 0!==i){Mr("transaction failed: Data returned ",i,l.path);let t=li(i);"object"==typeof i&&null!=i&&D(i,".priority")||(t=t.updatePriority(n.getPriority()));const r=l.currentWriteId,o=Kr(e),c=gr(t,n,o);l.currentOutputSnapshotRaw=t,l.currentOutputSnapshotResolved=c,l.currentWriteId=Zr(e),a.splice(a.indexOf(r),1),s=s.concat(Vs(e.serverSyncTree_,l.path,c,l.currentWriteId,l.applyLocally)),s=s.concat(Ks(e.serverSyncTree_,r,!0))}else d=!0,h="nodata",s=s.concat(Ks(e.serverSyncTree_,l.currentWriteId,!0))}$r(e.eventQueue_,n,s),s=[],d&&(t[o].status=2,function(e){setTimeout(e,Math.floor(0))}(t[o].unwatcher),t[o].onComplete&&("nodata"===h?i.push(()=>t[o].onComplete(null,!1,t[o].currentInputSnapshot)):i.push(()=>t[o].onComplete(new Error(h),!1,null))))}ao(e,e.transactionQueueTree_);for(let e=0;e<i.length;e++)$t(i[e]);no(e,e.transactionQueueTree_)}(e,ro(e,n),i),i}function so(e,t){let n,i=e.transactionQueueTree_;for(n=gn(t);null!==n&&void 0===wr(i);)i=br(i,n),n=gn(t=vn(t));return i}function ro(e,t){const n=[];return oo(e,t,n),n.sort((e,t)=>e.order-t.order),n}function oo(e,t,n){const i=wr(t);if(i)for(let e=0;e<i.length;e++)n.push(i[e]);Er(t,t=>{oo(e,t,n)})}function ao(e,t){const n=wr(t);if(n){let e=0;for(let t=0;t<n.length;t++)2!==n[t].status&&(n[e]=n[t],e++);n.length=e,Cr(t,n.length>0?n:void 0)}Er(t,t=>{ao(e,t)})}function lo(e,t){const n=Tr(so(e,t)),i=br(e.transactionQueueTree_,t);return function(e,t){let n=e.parent;for(;null!==n;){if(t(n))return!0;n=n.parent}}(i,t=>{co(e,t)}),co(e,i),xr(i,t=>{co(e,t)}),n}function co(e,t){const n=wr(t);if(n){const i=[];let s=[],o=-1;for(let t=0;t<n.length;t++)3===n[t].status||(1===n[t].status?(r(o===t-1,"All SENT items should be at beginning of queue."),o=t,n[t].status=3,n[t].abortReason="set"):(r(0===n[t].status,"Unexpected transaction status in abort"),n[t].unwatcher(),s=s.concat(Ks(e.serverSyncTree_,n[t].currentWriteId,!0)),n[t].onComplete&&i.push(n[t].onComplete.bind(null,new Error("set"),!1,null))));-1===o?Cr(t,void 0):n.length=o+1,$r(e.eventQueue_,Tr(t),s);for(let e=0;e<i.length;e++)$t(i[e])}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */const ho=function(e,t){const n=uo(e),i=n.namespace;"firebase.com"===n.domain&&St(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),i&&"undefined"!==i||"localhost"===n.domain||St("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||"undefined"!=typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&Nt("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");const s="ws"===n.scheme||"wss"===n.scheme;return{repoInfo:new Jt(n.host,n.secure,i,s,t,"",i!==n.subdomain),path:new _n(n.pathString)}},uo=function(e){let t="",n="",i="",s="",r="",o=!0,a="https",l=443;if("string"==typeof e){let c=e.indexOf("//");c>=0&&(a=e.substring(0,c-1),e=e.substring(c+2));let h=e.indexOf("/");-1===h&&(h=e.length);let d=e.indexOf("?");-1===d&&(d=e.length),t=e.substring(0,Math.min(h,d)),h<d&&(s=function(e){let t="";const n=e.split("/");for(let e=0;e<n.length;e++)if(n[e].length>0){let i=n[e];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch(e){}t+="/"+i}return t}(e.substring(h,d)));const u=function(e){const t={};"?"===e.charAt(0)&&(e=e.substring(1));for(const n of e.split("&")){if(0===n.length)continue;const i=n.split("=");2===i.length?t[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):Nt(`Invalid query segment '${n}' in query '${e}'`)}return t}(e.substring(Math.min(e.length,d)));c=t.indexOf(":"),c>=0?(o="https"===a||"wss"===a,l=parseInt(t.substring(c+1),10)):c=t.length;const p=t.slice(0,c);if("localhost"===p.toLowerCase())n="localhost";else if(p.split(".").length<=2)n=p;else{const e=t.indexOf(".");i=t.substring(0,e).toLowerCase(),n=t.substring(e+1),r=i}"ns"in u&&(r=u.ns)}return{host:t,port:l,domain:n,subdomain:i,secure:o,scheme:a,pathString:s,namespace:r}},po="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",fo=function(){let e=0;const t=[];return function(n){const i=n===e;let s;e=n;const o=new Array(8);for(s=7;s>=0;s--)o[s]=po.charAt(n%64),n=Math.floor(n/64);r(0===n,"Cannot push at time == 0");let a=o.join("");if(i){for(s=11;s>=0&&63===t[s];s--)t[s]=0;t[s]++}else for(s=0;s<12;s++)t[s]=Math.floor(64*Math.random());for(s=0;s<12;s++)a+=po.charAt(t[s]);return r(20===a.length,"nextPushId: Length should be 20."),a}}();
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
class _o{constructor(e,t,n,i){this.eventType=e,this.eventRegistration=t,this.snapshot=n,this.prevName=i}getPath(){const e=this.snapshot.ref;return"value"===this.eventType?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+P(this.snapshot.exportVal())}}class mo{constructor(e,t,n){this.eventRegistration=e,this.error=t,this.path=n}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}
/**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class go{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return r(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||void 0!==this.snapshotCallback.userCallback&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}
/**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */class yo{constructor(e,t,n,i){this._repo=e,this._path=t,this._queryParams=n,this._orderByCalled=i}get key(){return En(this._path)?null:bn(this._path)}get ref(){return new vo(this._repo,this._path)}get _queryIdentifier(){const e=bi(this._queryParams),t=Ft(e);return"{}"===t?"default":t}get _queryObject(){return bi(this._queryParams)}isEqual(e){if(!((e=U(e))instanceof yo))return!1;const t=this._repo===e._repo,n=kn(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&n&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+function(e){let t="";for(let n=e.pieceNum_;n<e.pieces_.length;n++)""!==e.pieces_[n]&&(t+="/"+encodeURIComponent(String(e.pieces_[n])));return t||"/"}(this._path)}}class vo extends yo{constructor(e,t){super(e,t,new yi,!1)}get parent(){const e=Cn(this._path);return null===e?null:new vo(this._repo,e)}get root(){let e=this;for(;null!==e.parent;)e=e.parent;return e}}class bo{constructor(e,t,n){this._node=e,this.ref=t,this._index=n}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new _n(e),n=Co(this.ref,e);return new bo(this._node.getChild(t),n,Zn)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){if(this._node.isLeafNode())return!1;return!!this._node.forEachChild(this._index,(t,n)=>e(new bo(n,Co(this.ref,t),Zn)))}hasChild(e){const t=new _n(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return!this._node.isLeafNode()&&!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function wo(e,t){return(e=U(e))._checkNotDeleted("ref"),void 0!==t?Co(e._root,t):e._root}function Co(e,t){var n,i,s;return null===gn((e=U(e))._path)?(n="child",i="path",(s=t)&&(s=s.replace(/^\/*\.info(\/|$)/,"/")),Fr(n,i,s)):Fr("child","path",t),new vo(e._repo,In(e._path,t))}function Io(e,t){e=U(e),Or("push",e._path),Ar("push",t,e._path,!0);const n=Yr(e._repo),i=fo(n),s=Co(e,i),r=Co(e,i);let o;return o=null!=t?function(e,t){e=U(e),Or("set",e._path),Ar("set",t,e._path,!1);const n=new b;return function(e,t,n,i,s){Xr(e,"set",{path:t.toString(),value:n,priority:i});const r=Kr(e),o=li(n,i),a=Xs(e.serverSyncTree_,t),l=gr(o,a,r),c=Zr(e),h=Vs(e.serverSyncTree_,t,l,c,!0);Wr(e.eventQueue_,h),e.server_.put(t.toString(),o.val(!0),(n,i)=>{const r="ok"===n;r||Nt("set at "+t+" failed: "+n);const o=Ks(e.serverSyncTree_,c,!r);$r(e.eventQueue_,t,o),eo(0,s,n,i)});const d=lo(e,t);io(e,d),$r(e.eventQueue_,d,[])}(e._repo,e._path,t,null,n.wrapCallback(()=>{})),n.promise}(r,t).then(()=>r):Promise.resolve(r),s.then=o.then.bind(o),s.catch=o.then.bind(o,void 0),s}function Eo(e,t){Lr("update",t,e._path);const n=new b;return function(e,t,n,i){Xr(e,"update",{path:t.toString(),value:n});let s=!0;const r=Kr(e),o={};if(qt(n,(n,i)=>{s=!1,o[n]=mr(In(t,n),li(i),e.serverSyncTree_,r)}),s)xt("update() called with empty data.  Don't do anything."),eo(0,i,"ok",void 0);else{const s=Zr(e),r=Ys(e.serverSyncTree_,t,o,s);Wr(e.eventQueue_,r),e.server_.merge(t.toString(),n,(n,r)=>{const o="ok"===n;o||Nt("update at "+t+" failed: "+n);const a=Ks(e.serverSyncTree_,s,!o),l=a.length>0?io(e,t):t;$r(e.eventQueue_,l,a),eo(0,i,n,r)}),qt(n,n=>{const i=lo(e,In(t,n));io(e,i)}),$r(e.eventQueue_,t,[])}}(e._repo,e._path,t,n.wrapCallback(()=>{})),n.promise}function xo(e){e=U(e);const t=new go(()=>{}),n=new To(t);return function(e,t,n){const i=er(e.serverSyncTree_,t);return null!=i?Promise.resolve(i):e.server_.get(t).then(i=>{const s=li(i).withIndex(t._queryParams.getIndex());let r;if(Zs(e.serverSyncTree_,t,n,!0),t._queryParams.loadsAllData())r=Gs(e.serverSyncTree_,t._path,s);else{const n=rr(e.serverSyncTree_,t);r=Js(e.serverSyncTree_,t._path,s,n)}return $r(e.eventQueue_,t._path,r),Qs(e.serverSyncTree_,t,n,null,!0),s},n=>(Xr(e,"get for query "+P(t)+" failed: "+n),Promise.reject(new Error(n))))}(e._repo,e,n).then(t=>new bo(t,new vo(e._repo,e._path),e._queryParams.getIndex()))}class To{constructor(e){this.callbackContext=e}respondsTo(e){return"value"===e}createEvent(e,t){const n=t._queryParams.getIndex();return new _o("value",this,new bo(e.snapshotNode,new vo(t._repo,t._path),n))}getEventRunner(e){return"cancel"===e.getEventType()?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new mo(this,e,t):null}matches(e){return e instanceof To&&(!e.callbackContext||!this.callbackContext||e.callbackContext.matches(this.callbackContext))}hasAnyCallback(){return null!==this.callbackContext}}class ko{constructor(e,t){this.eventType=e,this.callbackContext=t}respondsTo(e){let t="children_added"===e?"child_added":e;return t="children_removed"===t?"child_removed":t,this.eventType===t}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new mo(this,e,t):null}createEvent(e,t){r(null!=e.childName,"Child events should have a childName.");const n=Co(new vo(t._repo,t._path),e.childName),i=t._queryParams.getIndex();return new _o(e.type,this,new bo(e.snapshotNode,n,i),e.prevName)}getEventRunner(e){return"cancel"===e.getEventType()?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof ko&&(this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)))}hasAnyCallback(){return!!this.callbackContext}}function So(e,t,n,i,s){const r=new go(n,void 0),o="value"===t?new To(r):new ko(t,r);return function(e,t,n){let i;i=".info"===gn(t._path)?Zs(e.infoSyncTree_,t,n):Zs(e.serverSyncTree_,t,n),Ur(e.eventQueue_,t._path,i)}(e._repo,e,o),()=>function(e,t,n){let i;i=".info"===gn(t._path)?Qs(e.infoSyncTree_,t,n):Qs(e.serverSyncTree_,t,n),Ur(e.eventQueue_,t._path,i)}(e._repo,e,o)}function No(e,t,n,i){return So(e,"value",t)}!function(e){r(!Rs,"__referenceConstructor has already been defined"),Rs=e}(vo),function(e){r(!Ds,"__referenceConstructor has already been defined"),Ds=e}(vo);
/**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
const Po={};let Ro=!1;function Do(e,t,n,i,s){let r=i||e.options.databaseURL;void 0===r&&(e.options.projectId||St("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),xt("Using default host for project ",e.options.projectId),r=`${e.options.projectId}-default-rtdb.firebaseio.com`);let o,a=ho(r,s),l=a.repoInfo;"undefined"!=typeof process&&process.env&&(o=process.env.FIREBASE_DATABASE_EMULATOR_HOST),o?(r=`http://${o}?ns=${l.namespace}`,a=ho(r,s),l=a.repoInfo):a.repoInfo.secure;const c=new jt(e.name,e.options,t);qr("Invalid Firebase Database URL",a),En(a.path)||St("Database URL must point to the root of a Firebase Database (not including a child path).");const h=function(e,t,n,i){let s=Po[t.name];s||(s={},Po[t.name]=s);let r=s[e.toURLString()];r&&St("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call.");return r=new jr(e,Ro,n,i),s[e.toURLString()]=r,r}(l,e,c,new zt(e,n));return new Ao(h,e)}class Ao{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(Vr(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new vo(this._repo,mn())),this._rootInternal}_delete(){return null!==this._rootInternal&&(!function(e,t){const n=Po[t];n&&n[e.key]===e||St(`Database ${t}(${e.repoInfo_}) has already been deleted.`),function(e){e.persistentConnection_&&e.persistentConnection_.interrupt("repo_interrupt")}(e),delete n[e.key]}(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){null===this._rootInternal&&St("Cannot call "+e+" on a deleted database.")}}function Mo(e=function(e=ze){const t=Ve.get(e);if(!t&&e===ze&&v())return Xe();if(!t)throw Je.create("no-app",{appName:e});return t}(),t){const n=function(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}(e,"database").getImmediate({identifier:t});if(!n._instanceStarted){const e=y("database");e&&function(e,t,n,i={}){e=U(e),e._checkNotDeleted("useEmulator");const s=`${t}:${n}`,r=e._repoInternal;if(e._instanceStarted){if(s===e._repoInternal.repoInfo_.host&&F(i,r.repoInfo_.emulatorOptions))return;St("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(r.repoInfo_.nodeAdmin)i.mockUserToken&&St('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Vt(Vt.OWNER);else if(i.mockUserToken){const t="string"==typeof i.mockUserToken?i.mockUserToken:
/**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
function(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=t||"demo-project",i=e.iat||0,s=e.sub||e.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const r={iss:`https://securetoken.google.com/${n}`,aud:n,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}},...e};return[d(JSON.stringify({alg:"none",type:"JWT"})),d(JSON.stringify(r)),""].join(".")}(i.mockUserToken,e.app.options.projectId);o=new Vt(t)}w(t)&&(!async function(e){(await fetch(e,{credentials:"include"})).ok}(t),E("Database",!0));!function(e,t,n,i){const s=t.lastIndexOf(":"),r=w(t.substring(0,s));e.repoInfo_=new Jt(t,r,e.repoInfo_.namespace,e.repoInfo_.webSocketOnly,e.repoInfo_.nodeAdmin,e.repoInfo_.persistenceKey,e.repoInfo_.includeNamespaceInQueryParams,!0,n),i&&(e.authTokenProvider_=i)}(r,s,i,o)}
/**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */(n,...e)}return n}Mn.prototype.simpleListen=function(e,t){this.sendRequest("q",{p:e},t)},Mn.prototype.echo=function(e,t){this.sendRequest("echo",{d:e},t)},function(e){!function(e){pt=e}("12.10.0"),Qe(new $("database",(e,{instanceIdentifier:t})=>Do(e.getProvider("app").getImmediate(),e.getProvider("auth-internal"),e.getProvider("app-check-internal"),t),"PUBLIC").setMultipleInstances(!0)),et(dt,ut,e),et(dt,ut,"esm2020")}();const Lo={apiKey:"AIzaSyC3QVqANPB2PruDDbwc9OQktvLNBMmtGt4",authDomain:"openchat-project.firebaseapp.com",databaseURL:"https://openchat-project-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"openchat-project"};let Fo,Oo;const qo=()=>Oo,Bo=()=>{let e=localStorage.getItem("oc_visitor_id");return e||(e="visitor_"+Math.random().toString(36).substr(2,9),localStorage.setItem("oc_visitor_id",e)),e},Wo=async(e,t,n)=>{const i=qo();let s=localStorage.getItem(`oc_conversation_${e}`);if(s){if((await xo(wo(i,`conversations/${e}/${s}`))).exists())return s}return s=(await Io(wo(i,`conversations/${e}`),{visitorId:Bo(),visitorName:"Visitor",visitorEmail:null,status:"open",createdAt:Date.now(),lastMessageAt:Date.now(),lastSenderWasVisitor:!1,lastMessagePreview:"",collectedEmail:!1,formRequested:!1})).key,localStorage.setItem(`oc_conversation_${e}`,s),s},Uo=async(e,t,n,i,s=null)=>{const r=qo();try{await Io(wo(r,`notifications/${e}`),{type:t,message:n,subtext:i?.substring(0,80)||"",conversationId:s,read:!1,timestamp:Date.now()})}catch(e){console.warn("Notification write failed:",e)}},$o=async(e,t,n,i="visitor")=>{const s=qo();await Io(wo(s,`messages/${e}`),{sender:i,text:n,timestamp:Date.now(),read:!1});const r={lastMessageAt:Date.now(),lastSenderWasVisitor:"visitor"===i,lastMessagePreview:n.slice(0,60)};if("visitor"===i?(r.status="waiting",r.lastVisitorMessageAt=Date.now()):"agent"===i&&(r.status="open"),await Eo(wo(s,`conversations/${t}/${e}`),r),"visitor"===i){const i=(await xo(wo(s,`conversations/${t}/${e}`))).val(),r=i?.visitorName||"A visitor",o=i?.messageCount>1;await Uo(t,o?"return":"message",o?`${r} returned to a conversation`:`New message from ${r}`,n,e)}},Ho=(e,t)=>{!function(e,t){So(e,"child_added",t)}(wo(qo(),`messages/${e}`),e=>{t({id:e.key,...e.val()})})},zo=async()=>{const s=window.OpenChatConfig||{},{installId:r}=s;if(!r)return void console.warn("[OpenChat] No installId provided.");(()=>{if(document.getElementById("oc-styles"))return;const e=document.createElement("style");e.id="oc-styles",e.innerHTML="\n    :root {\n      --oc-primary:        #4F46E5;\n      --oc-chat-bg:        #F9FAFB;\n      --oc-visitor-bubble: #4F46E5;\n      --oc-visitor-text:   #ffffff;\n      --oc-agent-bubble:   #ffffff;\n      --oc-agent-text:     #111827;\n      --oc-input-bg:       #ffffff;\n      --oc-input-border:   #E5E7EB;\n    }\n\n    /* ── Launcher bubble ── */\n    #openchat-bubble {\n      position: fixed;\n      bottom: 20px;\n      right: 20px;\n      width: 52px;\n      height: 52px;\n      border-radius: 50%;\n      background-color: var(--oc-primary);\n      color: white;\n      border: none;\n      cursor: pointer;\n      box-shadow: 0 4px 16px rgba(0,0,0,0.22);\n      font-size: 22px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      z-index: 2147483647;\n      transition: transform 0.2s, box-shadow 0.2s;\n    }\n    #openchat-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(0,0,0,0.28); }\n\n    .oc-bubble-icon {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      line-height: 1;\n      transition: transform 0.2s;\n    }\n    .oc-bubble-close {\n      font-size: 18px;\n      font-weight: 700;\n    }\n\n    #openchat-bubble .oc-badge {\n      position: absolute;\n      top: -4px;\n      right: -4px;\n      background: #EF4444;\n      color: white;\n      font-size: 10px;\n      font-weight: bold;\n      width: 18px;\n      height: 18px;\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    /* ── Chat window (desktop) ── */\n    #openchat-window {\n      position: fixed;\n      bottom: 82px;\n      right: 20px;\n      width: 320px;\n      height: 460px;\n      background: var(--oc-chat-bg);\n      border-radius: 16px;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.16);\n      display: flex;\n      flex-direction: column;\n      z-index: 2147483646;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;\n      overflow: hidden;\n      transform-origin: bottom right;\n      transition: opacity 0.22s ease, transform 0.22s ease;\n    }\n    #openchat-window.oc-hidden {\n      opacity: 0;\n      pointer-events: none;\n      transform: scale(0.92) translateY(12px);\n    }\n\n    /* ── Header ── */\n    .oc-header {\n      background: var(--oc-primary);\n      color: white;\n      padding: 12px 14px;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      flex-shrink: 0;\n    }\n    .oc-header-info {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n    }\n    .oc-avatar {\n      width: 32px;\n      height: 32px;\n      border-radius: 50%;\n      background: rgba(255,255,255,0.2);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 16px;\n    }\n    .oc-header-name {\n      font-size: 13px;\n      font-weight: 700;\n    }\n    .oc-status {\n      font-size: 11px;\n      opacity: 0.85;\n      display: flex;\n      align-items: center;\n      gap: 4px;\n      margin-top: 2px;\n    }\n    .oc-status-dot {\n      width: 6px;\n      height: 6px;\n      border-radius: 50%;\n      background: #4ADE80;\n    }\n    .oc-status-dot.offline { background: rgba(255,255,255,0.4); }\n    .oc-close-btn {\n      background: rgba(255,255,255,0.15);\n      border: none;\n      color: white;\n      width: 26px;\n      height: 26px;\n      border-radius: 50%;\n      cursor: pointer;\n      font-size: 12px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      transition: background 0.15s;\n    }\n    .oc-close-btn:hover { background: rgba(255,255,255,0.28); }\n\n    /* ── Messages area ── */\n    .oc-messages {\n      flex: 1;\n      overflow-y: auto;\n      padding: 12px;\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n      background: var(--oc-chat-bg);\n      -webkit-overflow-scrolling: touch;\n    }\n\n    /* ── Message bubbles ── */\n    .oc-message {\n      max-width: 80%;\n      padding: 9px 12px;\n      border-radius: 14px;\n      font-size: 13px;\n      line-height: 1.45;\n      word-break: break-word;\n    }\n    .oc-message.visitor {\n      background: var(--oc-visitor-bubble);\n      color: var(--oc-visitor-text);\n      align-self: flex-end;\n      border-bottom-right-radius: 4px;\n    }\n    .oc-message.agent {\n      background: var(--oc-agent-bubble);\n      color: var(--oc-agent-text);\n      align-self: flex-start;\n      border-bottom-left-radius: 4px;\n      border: 1px solid var(--oc-input-border);\n    }\n    .oc-message.ai {\n      background: #F3F4F6;\n      color: #374151;\n      align-self: flex-start;\n      border-bottom-left-radius: 4px;\n      border: 1px solid #E5E7EB;\n    }\n    .oc-message-time {\n      font-size: 10px;\n      opacity: 0.5;\n      margin-top: 3px;\n      text-align: right;\n    }\n\n    /* ── Typing indicator ── */\n    .oc-typing {\n      display: flex;\n      gap: 4px;\n      padding: 9px 12px;\n      background: var(--oc-agent-bubble);\n      border: 1px solid var(--oc-input-border);\n      border-radius: 14px 14px 4px 14px;\n      align-self: flex-start;\n      width: fit-content;\n    }\n    .oc-typing span {\n      width: 6px;\n      height: 6px;\n      background: #9CA3AF;\n      border-radius: 50%;\n      animation: ocBounce 1.2s infinite;\n    }\n    .oc-typing span:nth-child(2) { animation-delay: 0.2s; }\n    .oc-typing span:nth-child(3) { animation-delay: 0.4s; }\n    @keyframes ocBounce {\n      0%, 60%, 100% { transform: translateY(0); }\n      30%            { transform: translateY(-5px); }\n    }\n\n    /* ── Input area ── */\n    .oc-input-area {\n      padding: 8px 10px;\n      border-top: 1px solid var(--oc-input-border);\n      display: flex;\n      gap: 7px;\n      align-items: center;\n      background: var(--oc-input-bg);\n      flex-shrink: 0;\n    }\n    .oc-input {\n      flex: 1;\n      padding: 9px 13px;\n      border-radius: 24px;\n      border: 1px solid var(--oc-input-border);\n      background: var(--oc-input-bg);\n      font-size: 16px;\n      outline: none;\n      font-family: inherit;\n      color: #111827;\n      transition: border-color 0.2s;\n    }\n    .oc-input:focus { border-color: var(--oc-primary); }\n    .oc-input:disabled {\n      background: #F3F4F6;\n      color: #9CA3AF;\n      cursor: not-allowed;\n    }\n    .oc-send-btn {\n      width: 36px;\n      height: 36px;\n      min-width: 36px;\n      border-radius: 50%;\n      background: var(--oc-primary);\n      color: white;\n      border: none;\n      cursor: pointer;\n      font-size: 13px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      flex-shrink: 0;\n      transition: opacity 0.2s, transform 0.15s;\n    }\n    .oc-send-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(1.06); }\n    .oc-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }\n\n    /* ── Lead form ── */\n    .oc-collect-form {\n      background: var(--oc-chat-bg);\n      border: 1px solid var(--oc-input-border);\n      border-radius: 12px;\n      padding: 12px;\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n      align-self: stretch;\n    }\n    .oc-collect-input {\n      width: 100%;\n      padding: 9px 11px;\n      border-radius: 8px;\n      border: 1px solid var(--oc-input-border);\n      background: var(--oc-input-bg);\n      font-size: 16px;\n      outline: none;\n      box-sizing: border-box;\n      font-family: inherit;\n      color: #111827;\n      transition: border-color 0.2s;\n    }\n    .oc-collect-input:focus { border-color: var(--oc-primary); }\n    .oc-collect-btn {\n      width: 100%;\n      padding: 10px;\n      background: var(--oc-primary);\n      color: white;\n      border: none;\n      border-radius: 8px;\n      font-size: 13px;\n      font-weight: 600;\n      cursor: pointer;\n      font-family: inherit;\n      transition: opacity 0.2s;\n    }\n    .oc-collect-btn:hover:not(:disabled) { opacity: 0.88; }\n    .oc-collect-btn:disabled { opacity: 0.6; cursor: not-allowed; }\n\n    /* ── Powered by ── */\n    .oc-powered {\n      text-align: center;\n      font-size: 10px;\n      color: #9CA3AF;\n      padding: 5px 0 7px;\n      background: var(--oc-input-bg);\n      flex-shrink: 0;\n    }\n    .oc-powered a { color: var(--oc-primary); text-decoration: none; font-weight: 600; }\n\n    /* ── Mobile ── */\n    @media (max-width: 480px) {\n      #openchat-bubble {\n        bottom: 16px;\n        right: 16px;\n        width: 52px;\n        height: 52px;\n        font-size: 22px;\n      }\n\n      /*\n       * Mobile full-screen chat window.\n       * Uses safe-area-inset-top so header is NEVER hidden under browser chrome.\n       * dvh = dynamic viewport height, accounts for address bar on iOS/Android.\n       */\n      #openchat-window {\n        position: fixed;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        width: 100%;\n        /* Fallback for browsers without dvh support */\n        height: 100vh;\n        /* Real visible height — excludes browser address bar */\n        height: 100dvh;\n        border-radius: 0;\n        transform-origin: bottom center;\n      }\n\n      /*\n       * Push header down by the safe area so it's never hidden under\n       * the browser's status bar / notch on iOS and Android.\n       */\n      .oc-header {\n        padding-top: calc(12px + env(safe-area-inset-top, 0px));\n      }\n\n      #openchat-window.oc-hidden {\n        opacity: 0;\n        pointer-events: none;\n        transform: translateY(30px);\n      }\n\n      .oc-send-btn {\n        width: 42px;\n        height: 42px;\n        min-width: 42px;\n      }\n\n      .oc-input,\n      .oc-collect-input {\n        font-size: 16px;\n      }\n\n      /* Safe area for iPhone home indicator */\n      .oc-input-area {\n        padding-bottom: max(10px, env(safe-area-inset-bottom, 10px));\n      }\n      .oc-powered {\n        padding-bottom: max(8px, env(safe-area-inset-bottom, 8px));\n      }\n    }\n  ",document.head.appendChild(e)})(),Fo=Xe(Lo),Oo=Mo(Fo);const o=await(async e=>{const t=qo();return(await xo(wo(t,`users/${e}`))).val()})(r);if(!o)return void console.warn("[OpenChat] Agent settings not found.");const a=o.appearance||{},l=s.primaryColor||a.primaryColor||"#4F46E5",c=s.chatBg||a.chatBg||"#FFFFFF",h=s.visitorBubble||a.visitorBubble||l,d=s.agentBubble||a.agentBubble||"#FFFFFF",u=s.inputBg||a.inputBg||"#F9FAFB",p=s.inputBorder||a.inputBorder||"#E5E7EB",f=s.position||a.position||"bottom-right",_=s.companyName||a.companyName||o?.profile?.company||"Support",m=s.welcomeMessage||a.welcomeMessage||"Hi there! 👋 How can I help you today?",g=e=>{try{return(e=>{const t=e.replace("#",""),n=parseInt(t.substr(0,2),16)/255,i=parseInt(t.substr(2,2),16)/255,s=parseInt(t.substr(4,2),16)/255,r=e=>e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4);return.2126*r(n)+.7152*r(i)+.0722*r(s)})(e)>.35?"#111827":"#ffffff"}catch{return"#111827"}},y=g(h),v=g(d),b=document.documentElement;b.style.setProperty("--oc-primary",l),b.style.setProperty("--oc-chat-bg",c),b.style.setProperty("--oc-visitor-bubble",h),b.style.setProperty("--oc-visitor-text",y),b.style.setProperty("--oc-agent-bubble",d),b.style.setProperty("--oc-agent-text",v),b.style.setProperty("--oc-input-bg",u),b.style.setProperty("--oc-input-border",p);let w=!1,C=null,I=!1,E=!1;const x=(e=>{const t=document.createElement("button");return t.id="openchat-bubble",t.setAttribute("aria-label","Open chat"),t.innerHTML='\n    <span class="oc-bubble-icon oc-bubble-chat">💬</span>\n    <span class="oc-bubble-icon oc-bubble-close" style="display:none;">✕</span>\n  ',"bottom-left"===e.position&&(t.style.right="auto",t.style.left="24px"),document.body.appendChild(t),t})({position:f}),T=((e,t)=>{const n=document.createElement("div");return n.id="openchat-window",n.classList.add("oc-hidden"),"bottom-left"===e.position&&(n.style.right="auto",n.style.left="24px"),n.innerHTML=`\n    <div class="oc-header">\n      <div class="oc-header-info">\n        <div class="oc-avatar">💬</div>\n        <div>\n          <div class="oc-header-name">${e.companyName||"Support"}</div>\n          <div class="oc-status">\n            <div class="oc-status-dot ${t?"":"offline"}"></div>\n            ${t?"Online":"Offline"}\n          </div>\n        </div>\n      </div>\n      <button class="oc-close-btn" id="oc-close" aria-label="Close chat">✕</button>\n    </div>\n    <div class="oc-messages" id="oc-messages"></div>\n    <div class="oc-input-area">\n      <input\n        class="oc-input"\n        id="oc-input"\n        type="text"\n        placeholder="Type a message..."\n        autocomplete="off"\n      />\n      <button class="oc-send-btn" id="oc-send" aria-label="Send message">➤</button>\n    </div>\n    <div class="oc-powered">\n      Powered by <a href="https://github.com/Dipesh-Das97/openchat" target="_blank">OpenChat</a>\n    </div>\n  `,document.body.appendChild(n),n})({position:f,companyName:_},w);((e,t)=>{No(wo(qo(),`agentPresence/${e}`),e=>{t(e.val())})})(r,e=>{w=e?.online||!1,(e=>{const t=document.querySelector(".oc-status-dot"),n=document.querySelector(".oc-status");t&&n&&(t.className="oc-status-dot "+(e?"":"offline"),n.innerHTML=`\n    <div class="oc-status-dot ${e?"":"offline"}"></div>\n    ${e?"Online":"Offline"}\n  `)})(w)});const k=e=>{const t=o.leadFields||{},s=document.getElementById("oc-input"),a=document.getElementById("oc-send");s&&(s.disabled=!0,s.placeholder="Fill in the form above to continue...",s.style.backgroundColor="#F3F4F6",s.style.color="#9CA3AF",s.style.cursor="not-allowed"),a&&(a.disabled=!0,a.style.opacity="0.4"),n(t,async e=>{await(async(e,t)=>{const n=qo(),i=localStorage.getItem(`oc_conversation_${e}`),s=Object.fromEntries(Object.entries(t).filter(([e,t])=>null!=t&&""!==t));await Io(wo(n,`leads/${e}`),{...s,timestamp:Date.now(),visitorId:Bo()}),i&&(await Io(wo(n,`messages/${i}`),{sender:"system",text:`✅ Visitor submitted the lead form${s.name?` (${s.name})`:""}.`,timestamp:Date.now()}),await Eo(wo(n,`conversations/${e}/${i}`),{leadCollected:!0,formRequested:!1,formRequestedBy:null,lastVisitorMessageAt:Date.now(),lastMessagePreview:"📋 Lead form submitted"+(s.name?` by ${s.name}`:"")}),await Uo(e,"lead",`New lead from ${s.name||"a visitor"}`,s.email||s.phone||"",i))})(r,e),localStorage.setItem(`oc_lead_${r}`,JSON.stringify(e));const t=document.getElementById("oc-lead-form");t&&t.remove(),w||(e=>{const t=document.getElementById("oc-messages");if(!t)return;const n=document.getElementById("oc-lead-form");n&&n.remove();const i=(new Date).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),s=document.createElement("div");s.style.cssText="display:flex;align-items:flex-end;gap:8px;justify-content:flex-end;margin:4px 0;",s.innerHTML=`\n    <div style="max-width:75%;background:#7C3AED;color:#fff;padding:10px 14px;border-radius:12px 12px 4px 12px;word-break:break-word;font-size:14px;line-height:1.4;">\n      <span style="display:inline-block;font-size:10px;font-weight:700;background:rgba(255,255,255,0.25);color:#fff;border-radius:4px;padding:1px 5px;margin-right:6px;vertical-align:middle;">AI</span>\n      Thanks ${e||"there"}! 🎉 We've got your details and an agent will be in touch shortly. Feel free to keep chatting in the meantime!\n      <div style="font-size:10px;opacity:0.6;margin-top:4px;text-align:right;">${i}</div>\n    </div>\n    <div style="width:28px;height:28px;min-width:28px;border-radius:50%;background:#7C3AED;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">🤖</div>\n  `,t.appendChild(s),t.scrollTop=t.scrollHeight})(e.name),i(),E=!1})};function S(){T.classList.add("oc-hidden"),x.style.display="flex",e(!1)}const N=async()=>{const e=!!localStorage.getItem(`oc_conversation_${r}`);C=await Wo(r),e||await $o(C,r,m,"agent"),I||(I=!0,Ho(C,e=>{"form_request"!==e.type&&t(e.text,e.sender,e.timestamp)}),(e=>{const n=qo();No(wo(n,`conversations/${r}/${e}/status`),e=>{if("closed"===e.val()){localStorage.removeItem(`oc_conversation_${r}`),C=null,I=!1,E=!1,t("This conversation has been closed. Start a new message anytime! 👋","agent",Date.now());const e=document.getElementById("oc-input"),n=document.getElementById("oc-send");e&&(e.disabled=!0),n&&(n.disabled=!0)}if("open"===e.val()){const e=document.getElementById("oc-lead-form");e&&(e.remove(),E=!1),i()}}),No(wo(n,`conversations/${r}/${e}/formRequestedBy`),e=>{const t=e.val();if(t)if("agent"===t){E=!1;const e=document.getElementById("oc-lead-form");e&&e.remove(),E=!0,k()}else"ai"!==t||E||(E=!0,k())})})(C))};x.addEventListener("click",async()=>{T.classList.contains("oc-hidden")?(T.classList.remove("oc-hidden"),x.style.display="none",e(!0),C||await N(),(()=>{const e=document.getElementById("oc-input"),t=document.getElementById("oc-send"),n=async()=>{const t=e.value.trim();t&&(e.value="",C||(C=await Wo(r)),await $o(C,r,t,"visitor"))};t.addEventListener("click",n),e.addEventListener("keypress",e=>{"Enter"===e.key&&n()})})()):S()}),document.getElementById("oc-close").addEventListener("click",S)};"loading"===document.readyState?document.addEventListener("DOMContentLoaded",zo):zo()}();

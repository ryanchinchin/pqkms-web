var w=Object.defineProperty;var k=(n,e,t)=>e in n?w(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var c=(n,e,t)=>(k(n,typeof e!="symbol"?e+"":e,t),t);import{U as b,f as m,t as v,a as S,V as A,A as x,I as y,b as _}from"./auth_base-f1c2b218.js";const g="X-Authorization-PQKMS-Token";class C{constructor(e,t,a){c(this,"login_data");c(this,"lockbox_key");c(this,"subtle");this.login_data=e,this.lockbox_key=t,this.subtle=a,this.subtle=this.subtle||globalThis.crypto.subtle}async fetch(e,t,a,s){if(this.login_data.auth_token.length===0)throw new y("User unauthenticated");let i=s||{};i.Authorization=`Bearer ${this.login_data.auth_token}`;let o=null;a&&(i["Content-Type"]=i["Content-Type"]||"application/json",o=JSON.stringify(a));let r=await fetch(e,{method:t,mode:"cors",cache:"no-cache",keepalive:!0,headers:i,body:o});return this.parse(r)}async parse(e){if(e.ok){const t=await e.json();if(t.code>=200&&t.code<300)return t.message;throw new Error(`${t.message}`)}else{const t=await e.json();throw new Error(`${JSON.stringify(t)}`)}}async enclaveSigningKey(){if(!this.lockbox_key||!this.login_data.aux_data)throw new y("enclave signing key unavailable");let e=this.login_data.aux_data.split(".");if(e.length!==2)throw new y("Invalid auxilary data");const t=_(e[0],"big"),a=_(e[1],"big");return this.subtle.unwrapKey("pkcs8",a,this.lockbox_key,{name:"AES-GCM",iv:t},{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!0,["sign"])}}const f={attestation:"/v0/admin/attestation",login_init:"/v0/admin/login_init",login_finish:"/v0/admin/login_finish",user_info:"/v0/admin/user_info"};class R extends b{constructor(t){super(t);c(this,"directory",null)}async loginFinalMsg(t,a){let s=m(t.challenge),i=await globalThis.crypto.subtle.sign({name:"ECDSA",hash:"SHA-384"},a,s);return t.user_info.auth_data=v(i),t}async fetchDirectory(){if(this.directory)return this.directory;try{const t=await fetch(this.discoveryURL,{mode:"cors",cache:"no-store",keepalive:!0});if(t.ok){let a=await t.json();this.directory=a.v0}else this.directory=f}catch{this.directory=f}return this.directory}async loginInit(t,a){const s=await this.fetchDirectory();let i=await this.computeOprfClientData(a,t);t.auth_data=i.clientRequestBytes;let o=`${this.baseURL}${s.login_init}`;delete t.salt;let r=await fetch(o,{method:"POST",mode:"cors",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),keepalive:!0});return this.parseServerResponse(r)}async loginFinal(t){const a=await this.fetchDirectory(),s=await this.oprfClient.finalize(t.user_info.auth_data,this.oprfClientData),{loginKey:i}=await this.oprfClient.login_key(s,this.oprfClientData.hashed_password),o=await this.loginFinalMsg(t,i),r=JSON.stringify(o);let d=`${this.baseURL}${a.login_finish}`,l=await fetch(d,{method:"POST",mode:"cors",cache:"no-cache",headers:{"Content-Type":"application/json","Access-Control-Request-Headers":g},body:r});if(l.ok){let h=null;const p=l.headers.get(g),u=await this.parseServerResponse(l);return S(p===u.auth_token),u.aux_data&&u.aux_data.length>0&&(h=await this.oprfClient.lockbox_key(s,this.oprfClientData.hashed_password)),new C(u,h)}else try{throw this.parseServerResponse(l),new A(`Authentication failed with error code: ${l.status}`)}catch(h){throw new x(`${h.message}`,t.user_info.user_name,t.user_info.domain_name)}}}async function D(n,e,t,a,s,i){const o=new R(i);let r={domain_name:n,user_name:e,salt:a,auth_algo:s,auth_data:null},d=await o.loginInit(r,t);return o.loginFinal(d)}export{R as default,D as login_user};
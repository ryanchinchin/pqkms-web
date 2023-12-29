import{b,h as m,p as C,m as w,a as S,n as x,g as a}from"./auth_base-c411ed3c.js";function g(e,t){let n,o,c=1n,y=0n,r=0n,s=1n;for(e<t?[n,o]=[t,e]:[n,o]=[e,t];o!==0n;){let i=n/o;[o,n]=[n-i*o,o],[y,c]=[c-i*y,y],[s,r]=[r-i*s,s]}return e<t?{g:n,u:r,v:c}:{g:n,u:c,v:r}}function E(e){let t={x:e,y:0n};for(;(t.x&0x1n)===0x0n;)t.y+=1n,t.x>>=1n;return t}function P(e,t,n){const o=e*t-1n,{x:c,y}=E(o);let r=2n;for(;;){let s=C(r,c,n);if(s!==1n&&s!==n-1n){let i=s;for(let _=1;_<=y;_++){const l=i*i,u=w(l,n);if(u===n-1n)break;if(u===1n){const{g:p}=g(i-1n,n);S(n%p===0n);const d=n/p;return{x:p,y:d}}else i=l}}r=r+1n}return{x:0n,y:0n}}async function B(e,t,n){const o=t*n,c=(t-1n)*(n-1n),y=3n;let{g:r,v:s}=g(c,3n);for(S(r===1n);s<0;)s+=c;const i=w(s,t-1n),_=w(s,n-1n);let{u:l}=g(n,t);for(;l<0n;)l+=t;S(l*n%t===1n);const u=x(y),p=x(s),d=x(o),f=x(t),h=x(n),v=x(i),A=x(_),K=x(l+1n),k={kty:"RSA",alg:"RS256",n:a(d),e:a(u),d:a(p),p:a(f),q:a(h),ext:!0,key_ops:["sign"],dp:a(v),dq:a(A),qi:a(K)},R={kty:"RSA",alg:"RS256",n:a(d),e:a(u),ext:!0,key_ops:["verify"]},q=await e.importKey("jwk",k,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!0,["sign"]),j=await e.importKey("jwk",R,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!0,["verify"]);return{privateKey:q,publicKey:j}}async function U(e){const t=new Uint8Array([1,0,1]),n=["sign","verify"],o={name:"RSASSA-PKCS1-v1_5",modulusLength:3072,publicExponent:t,hash:"SHA-256"};for(;;){const c=await e.generateKey(o,!0,n),y=await e.exportKey("jwk",c.privateKey),r=new Uint8Array(b(y.n,"big")),s=new Uint8Array(b(y.d,"big")),i=0x010001n,_=m(s),l=m(r);let{x:u,y:p}=P(i,_,l);if(!((u-1n)%3n==0n||(p-1n)%3n==0n))return B(e,u,p)}}export{U as sgxCompatKey,g as xgcd};
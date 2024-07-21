"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7780],{7980:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>n,metadata:()=>d,toc:()=>a});var i=t(6070),r=t(5710);const n={},o="useFormStatus",d={id:"api/useFormStatus",title:"useFormStatus",description:"React custom hook for subscribing to the overall form validation and submission status.",source:"@site/docs/api/useFormStatus.md",sourceDirName:"api",slug:"/api/useFormStatus",permalink:"/zod-forms/docs/api/useFormStatus",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/api/useFormStatus.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"useFormContext",permalink:"/zod-forms/docs/api/useFormContext"},next:{title:"useFormValues",permalink:"/zod-forms/docs/api/useFormValues"}},c={},a=[{value:"Returns <code>FormStatus</code>",id:"returns-formstatus",level:2}];function l(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.h1,{id:"useformstatus",children:(0,i.jsx)(s.code,{children:"useFormStatus"})}),"\n",(0,i.jsx)(s.p,{children:"React custom hook for subscribing to the overall form validation and submission status."}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-ts",children:"import { useFormStatus } from '@jcoreio/zod-forms'\n"})}),"\n",(0,i.jsxs)(s.h2,{id:"returns-formstatus",children:["Returns ",(0,i.jsx)(s.a,{href:"/zod-forms/docs/api/types#formstatus",children:(0,i.jsx)(s.code,{children:"FormStatus"})})]}),"\n",(0,i.jsx)(s.p,{children:"An object with the following properties. Causes a rerender when any of these properties changes."}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"initialized"})," - whether the form has been initialized"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"submitting"})," - whether the form is currently submitting"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"submitSucceeded"})," - whether submit succeeded"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"submitFailed"})," - whether submit failed"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"submitError"})," - the reason submit failed, if any"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"valididationError"})," - the reason validation failed, if any"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"valid"})," - whether all fields are valid"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"invalid"})," - opposite of ",(0,i.jsx)(s.code,{children:"valid"})]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"pristine"})," - opposite of ",(0,i.jsx)(s.code,{children:"dirty"})]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"dirty"})," - whether any field is unequal to its initial value"]}),"\n"]})]})}function u(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},5710:(e,s,t)=>{t.d(s,{R:()=>o,x:()=>d});var i=t(758);const r={},n=i.createContext(r);function o(e){const s=i.useContext(n);return i.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),i.createElement(n.Provider,{value:s},e.children)}}}]);
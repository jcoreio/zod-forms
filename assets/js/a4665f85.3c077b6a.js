"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4560],{2542:(e,s,i)=>{i.r(s),i.d(s,{assets:()=>l,contentTitle:()=>t,default:()=>h,frontMatter:()=>n,metadata:()=>o,toc:()=>c});var d=i(6070),r=i(5710);const n={},t="useField",o={id:"api/useField",title:"useField",description:"React custom hook for subscribing to the value and validation state of a form field and getting methods",source:"@site/docs/api/useField.md",sourceDirName:"api",slug:"/api/useField",permalink:"/zod-forms/docs/api/useField",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/api/useField.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"useArrayField",permalink:"/zod-forms/docs/api/useArrayField"},next:{title:"useFormContext",permalink:"/zod-forms/docs/api/useFormContext"}},l={},c=[{value:"Returns <code>UseFieldProps</code>",id:"returns-usefieldprops",level:2}];function a(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s.h1,{id:"usefield",children:(0,d.jsx)(s.code,{children:"useField"})}),"\n",(0,d.jsx)(s.p,{children:"React custom hook for subscribing to the value and validation state of a form field and getting methods\nto programmatically set the value."}),"\n",(0,d.jsxs)(s.p,{children:["To connect ",(0,d.jsx)(s.code,{children:"<input>"})," elements to form state, ",(0,d.jsx)(s.a,{href:"/zod-forms/docs/api/useHtmlField",children:(0,d.jsx)(s.code,{children:"useHtmlField"})})," is probably more useful;\n",(0,d.jsx)(s.code,{children:"useField"})," is better for custom field components that aren't based upon ",(0,d.jsx)(s.code,{children:"<input>"}),"s."]}),"\n",(0,d.jsx)(s.pre,{children:(0,d.jsx)(s.code,{className:"language-ts",children:"import { useField } from '@jcoreio/zod-forms'\n"})}),"\n",(0,d.jsx)(s.pre,{children:(0,d.jsx)(s.code,{className:"language-ts",children:"export function useField(path): UseFieldProps`\n"})}),"\n",(0,d.jsxs)(s.p,{children:[(0,d.jsx)(s.code,{children:"path"})," may be a ",(0,d.jsx)(s.a,{href:"/zod-forms/docs/api/FieldPath",children:(0,d.jsx)(s.code,{children:"FieldPath"})}),", ",(0,d.jsx)(s.a,{href:"/zod-forms/docs/concepts#pathstrings",children:"pathstring"})," or ",(0,d.jsx)(s.a,{href:"/zod-forms/docs/concepts#path-arrays",children:"path array"}),"."]}),"\n",(0,d.jsxs)(s.p,{children:["The full ",(0,d.jsx)(s.a,{href:"/zod-forms/docs/api/types#typedusefield",children:(0,d.jsx)(s.code,{children:"TypedUseField<T>"})})," method signature extracts the type of the subschema at\nthe given path, and should produce a TS error if the path is invalid or doesn't exist in ",(0,d.jsx)(s.a,{href:"#schema-t",children:(0,d.jsx)(s.code,{children:"schema"})}),"."]}),"\n",(0,d.jsxs)(s.h2,{id:"returns-usefieldprops",children:["Returns ",(0,d.jsx)(s.a,{href:"/zod-forms/docs/api/types#usefieldprops",children:(0,d.jsx)(s.code,{children:"UseFieldProps"})})]}),"\n",(0,d.jsx)(s.p,{children:"An object containing the following properties. Causes a rerender when any of these properties changes."}),"\n",(0,d.jsxs)(s.ul,{children:["\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"value"})," - the parsed value of the field, or ",(0,d.jsx)(s.code,{children:"undefined"})," if invalid"]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"rawValue"})," - the raw value of the field"]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"initialValue"})," - the parsed initial value of the field, or ",(0,d.jsx)(s.code,{children:"undefined"})," if invalid/uninitialized"]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"rawInitialValue"})," - the raw initial value of the field"]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"error"})," - the validation error message, if any"]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"dirty"})," - whether the ",(0,d.jsx)(s.code,{children:"value"})," is not equal to ",(0,d.jsx)(s.code,{children:"initialValue"})]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"pristine"})," - opposite of ",(0,d.jsx)(s.code,{children:"dirty"})]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"valid"})," - whether the ",(0,d.jsx)(s.code,{children:"rawValue"})," is valid"]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"invalid"})," - oppposite of ",(0,d.jsx)(s.code,{children:"valid"})]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"touched"})," - whether the field has been blurred or the form submitted"]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"visited"})," - whether the field has been focused"]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"setMeta"})," - method to set the ",(0,d.jsx)(s.a,{href:"/zod-forms/docs/api/types#fieldmeta",children:(0,d.jsx)(s.code,{children:"FieldMeta"})})," for this field"]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"setRawValue"})," - method to set the raw value for this field"]}),"\n",(0,d.jsxs)(s.li,{children:[(0,d.jsx)(s.code,{children:"setValue"})," - method to set the value for this field"]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,d.jsx)(s,{...e,children:(0,d.jsx)(a,{...e})}):a(e)}},5710:(e,s,i)=>{i.d(s,{R:()=>t,x:()=>o});var d=i(758);const r={},n=d.createContext(r);function t(e){const s=d.useContext(n);return d.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:t(e.components),d.createElement(n.Provider,{value:s},e.children)}}}]);
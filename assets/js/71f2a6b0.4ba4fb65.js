"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1456],{1619:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>n,metadata:()=>d,toc:()=>c});var i=r(6070),t=r(5710);const n={},o="useFormContext",d={id:"api/useFormContext",title:"useFormContext",description:"React custom hook for getting the enclosing FormContextProps provided by FormProvider.",source:"@site/docs/api/useFormContext.md",sourceDirName:"api",slug:"/api/useFormContext",permalink:"/zod-forms/docs/api/useFormContext",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/api/useFormContext.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"useField",permalink:"/zod-forms/docs/api/useField"},next:{title:"useFormStatus",permalink:"/zod-forms/docs/api/useFormStatus"}},l={},c=[{value:"Returns <code>FormContextProps&lt;T&gt;</code>",id:"returns-formcontextpropst",level:2}];function a(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.h1,{id:"useformcontext",children:(0,i.jsx)(s.code,{children:"useFormContext"})}),"\n",(0,i.jsxs)(s.p,{children:["React custom hook for getting the enclosing ",(0,i.jsx)(s.a,{href:"types#formcontextprops",children:(0,i.jsx)(s.code,{children:"FormContextProps"})})," provided by ",(0,i.jsx)(s.a,{href:"createZodForm#formprovider",children:(0,i.jsx)(s.code,{children:"FormProvider"})}),"."]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-ts",children:"import { useFormContext } from '@jcoreio/zod-forms'\n"})}),"\n",(0,i.jsxs)(s.h2,{id:"returns-formcontextpropst",children:["Returns ",(0,i.jsx)(s.a,{href:"types#formcontextprops",children:(0,i.jsx)(s.code,{children:"FormContextProps<T>"})})]}),"\n",(0,i.jsx)(s.p,{children:"An object with the following properties:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"schema"})," - the Zod schema for the form values"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"inverseSchema"})," - the inverse Zod schema; ",(0,i.jsx)(s.code,{children:"inverseSchema.parse(values)"})," formats to raw values"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"root"})," - the root ",(0,i.jsx)(s.a,{href:"/zod-forms/docs/api/FieldPath",children:(0,i.jsx)(s.code,{children:"FieldPath"})})]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"initialize"})," - method to initialize the form with initial values"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"addHandlers"})," - method to register submit handlers"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"removeHandlers"})," - method to unregister submit handlers"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"setMeta"})," - method to set the ",(0,i.jsx)(s.a,{href:"/zod-forms/docs/api/types#fieldmeta",children:(0,i.jsx)(s.code,{children:"FieldMeta"})})," of a field"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"setRawValue"})," - method to set the raw value of a field"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"setValue"})," - method to set the value of a field"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"submit"})," - method to trigger form submit"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"setSubmitStatus"})," - method to set the submit status"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"submitting"})," - whether the form is currently submitting"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"submitError"})," - the reason submit failed, if any"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"submitSucceeded"})," - whether submit succeeded"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"submitFailed"})," - whether submit failed"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"submittedValues"})," - the values that were submitted"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"rawSubmittedValues"})," - the raw values at submit time"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"arrayActions"})," - methods for manipulating array fields","\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"insert"})," - insert a value into the array"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"insertRaw"})," - insert a raw value into the array"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"move"})," - move a value from one index to another"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"pop"})," - remove the last value from the array"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"push"})," - add a value to the end of the array"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"pushRaw"})," - add a raw value to the end of the array"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"remove"})," - remove a value at an index"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"removeAll"})," - remove all values"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"splice"})," - remove and/or insert values, like ",(0,i.jsx)(s.code,{children:"Array.splice"})]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"spliceRaw"})," - remove and/or insert raw values, like ",(0,i.jsx)(s.code,{children:"Array.splice"})]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"swap"})," - swap values at two indices"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"unshift"})," - add a value to the beginning of the array"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"unshiftRaw"})," - add a raw value to the beginning of the array"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"getValues"})," - get the current field values"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"getRawValues"})," - get the current raw field values"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"getInitialValues"})," - get the initial field values"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"getRawInitialValues"})," - get the raw initial field values"]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},5710:(e,s,r)=>{r.d(s,{R:()=>o,x:()=>d});var i=r(758);const t={},n=i.createContext(t);function o(e){const s=i.useContext(n);return i.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),i.createElement(n.Provider,{value:s},e.children)}}}]);
"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2678],{8232:(e,r,o)=>{o.r(r),o.d(r,{assets:()=>t,contentTitle:()=>c,default:()=>h,frontMatter:()=>n,metadata:()=>i,toc:()=>l});var s=o(6070),d=o(5710);const n={},c="createZodForm",i={id:"api/createZodForm",title:"createZodForm",description:"Creates a form for a Zod schema",source:"@site/docs/api/createZodForm.md",sourceDirName:"api",slug:"/api/createZodForm",permalink:"/zod-forms/docs/api/createZodForm",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/api/createZodForm.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"FieldPath",permalink:"/zod-forms/docs/api/FieldPath"},next:{title:"Typescript Types",permalink:"/zod-forms/docs/api/types"}},t={},l=[{value:"Requirements",id:"requirements",level:2},{value:"Returns <code>ZodForm&lt;T&gt;</code>",id:"returns-zodformt",level:2},{value:"<code>FormProvider</code>",id:"formprovider",level:2},{value:"Example",id:"example",level:3}];function a(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,d.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r.h1,{id:"createzodform",children:(0,s.jsx)(r.code,{children:"createZodForm"})}),"\n",(0,s.jsx)(r.p,{children:"Creates a form for a Zod schema"}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-ts",children:"import { createZodForm } from '@jcoreio/zod-form'\n"})}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-ts",children:"createZodForm<T extends z.ZodTypeAny>(options: { schema: T }): ZodForm<T>\n"})}),"\n",(0,s.jsx)(r.h2,{id:"requirements",children:"Requirements"}),"\n",(0,s.jsxs)(r.p,{children:["If you want to use ",(0,s.jsx)(r.code,{children:".transform"}),"s in ",(0,s.jsx)(r.code,{children:"schema"}),", you must declare them via\n",(0,s.jsx)(r.a,{href:"https://github.com/jcoreio/zod-invertible",children:(0,s.jsx)(r.code,{children:"zod-invertible"})})," so that it's possible\nto format final values into raw values; otherwise ",(0,s.jsx)(r.code,{children:"createZodForm"})," will throw an error."]}),"\n",(0,s.jsxs)(r.h2,{id:"returns-zodformt",children:["Returns ",(0,s.jsx)(r.a,{href:"types#zodform",children:(0,s.jsx)(r.code,{children:"ZodForm<T>"})})]}),"\n",(0,s.jsx)(r.p,{children:"An object with the following properties:"}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.code,{children:"root"})," - the root ",(0,s.jsx)(r.a,{href:"/zod-forms/docs/api/FieldPath",children:(0,s.jsx)(r.code,{children:"FieldPath"})})]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.code,{children:"get"})," - shortcut for ",(0,s.jsx)(r.code,{children:"root"}),(0,s.jsx)(r.a,{href:"/zod-forms/docs/api/FieldPath#getpath-fieldpath",children:(0,s.jsx)(r.code,{children:".get(...)"})})]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.a,{href:"#formprovider",children:(0,s.jsx)(r.code,{children:"FormProvider"})})," - React component to provide form context to its descendants"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.a,{href:"/zod-forms/docs/api/useFormContext",children:(0,s.jsx)(r.code,{children:"useFormContext"})})," bound to schema type ",(0,s.jsx)(r.code,{children:"T"})]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.a,{href:"/zod-forms/docs/api/useFormStatus",children:(0,s.jsx)(r.code,{children:"useFormStatus"})})," bound to schema type ",(0,s.jsx)(r.code,{children:"T"})]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.a,{href:"/zod-forms/docs/api/useFormValues",children:(0,s.jsx)(r.code,{children:"useFormValues"})})," bound to schema type ",(0,s.jsx)(r.code,{children:"T"})]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.a,{href:"/zod-forms/docs/api/useInitialize",children:(0,s.jsx)(r.code,{children:"useInitialize"})})," bound to schema type ",(0,s.jsx)(r.code,{children:"T"})]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.a,{href:"/zod-forms/docs/api/useSubmit",children:(0,s.jsx)(r.code,{children:"useSubmit"})})," bound to schema type ",(0,s.jsx)(r.code,{children:"T"})]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.a,{href:"/zod-forms/docs/api/useArrayField",children:(0,s.jsx)(r.code,{children:"useArrayField"})})," bound to schema type ",(0,s.jsx)(r.code,{children:"T"})]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.a,{href:"/zod-forms/docs/api/useField",children:(0,s.jsx)(r.code,{children:"useField"})})," bound to schema type ",(0,s.jsx)(r.code,{children:"T"})]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.a,{href:"/zod-forms/docs/api/useHtmlField",children:(0,s.jsx)(r.code,{children:"useHtmlField"})})," bound to schema type ",(0,s.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,s.jsx)(r.h2,{id:"formprovider",children:(0,s.jsx)(r.code,{children:"FormProvider"})}),"\n",(0,s.jsx)(r.p,{children:"A React component to provide form context to its descendants."}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-ts",children:"const { FormProvider } = createZodForm({ schema })\n"})}),"\n",(0,s.jsx)(r.h3,{id:"example",children:"Example"}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-ts",children:"function MyForm() {\n  return (\n    <FormProvider>\n      <MyFormContent />\n    </FormProvider>\n  )\n}\n"})})]})}function h(e={}){const{wrapper:r}={...(0,d.R)(),...e.components};return r?(0,s.jsx)(r,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},5710:(e,r,o)=>{o.d(r,{R:()=>c,x:()=>i});var s=o(758);const d={},n=s.createContext(d);function c(e){const r=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function i(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:c(e.components),s.createElement(n.Provider,{value:r},e.children)}}}]);
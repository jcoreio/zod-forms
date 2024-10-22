"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9723],{5325:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>t,contentTitle:()=>d,default:()=>h,frontMatter:()=>c,metadata:()=>r,toc:()=>o});var i=s(6070),a=s(5710);const c={},d="conditionalValidate",r={id:"api/conditionalValidate",title:"conditionalValidate",description:"Helper for doing conditional validation properly.",source:"@site/docs/api/conditionalValidate.md",sourceDirName:"api",slug:"/api/conditionalValidate",permalink:"/zod-forms/docs/api/conditionalValidate",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/api/conditionalValidate.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"FieldPath",permalink:"/zod-forms/docs/api/FieldPath"},next:{title:"createZodForm",permalink:"/zod-forms/docs/api/createZodForm"}},t={},o=[{value:"Rationale",id:"rationale",level:2},{value:"Returns <code>ConditionalValidator&lt;T&gt;</code>",id:"returns-conditionalvalidatort",level:2},{value:"<code>conditionalRefine</code>",id:"conditionalrefine",level:3},{value:"Arguments",id:"arguments",level:4},{value:"Returns",id:"returns",level:4},{value:"<code>conditionalRefineAsync</code>",id:"conditionalrefineasync",level:3},{value:"Arguments",id:"arguments-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"<code>conditionalSuperRefine</code>",id:"conditionalsuperrefine",level:3},{value:"Arguments",id:"arguments-2",level:4},{value:"Returns",id:"returns-2",level:4},{value:"<code>conditionalSuperRefineAsync</code>",id:"conditionalsuperrefineasync",level:3},{value:"Arguments",id:"arguments-3",level:4},{value:"Returns",id:"returns-3",level:4}];function l(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"conditionalvalidate",children:(0,i.jsx)(n.code,{children:"conditionalValidate"})}),"\n",(0,i.jsx)(n.p,{children:"Helper for doing conditional validation properly."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import { conditionalValidate } from '@jcoreio/zod-forms'\n"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"conditionalValidate<T extends z.ZodTypeAny>(schema: T): ConditionalValidator<T>\n"})}),"\n",(0,i.jsx)(n.h2,{id:"rationale",children:"Rationale"}),"\n",(0,i.jsxs)(n.p,{children:["Naively, you would apply ",(0,i.jsx)(n.code,{children:".refine"})," or ",(0,i.jsx)(n.code,{children:".superRefine"})," to an object schema, but the problem is,\nthese refinements aren't checked if any unreleated fields in the object schema fail to parse. For example:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const schema = z\n  .object({\n    foo: z.string(),\n    min: z.number(),\n    max: z.number(),\n  })\n  .superRefine(({ min, max }, ctx) => {\n    if (min > max) {\n      ctx.addIssue({\n        code: z.ZodIssueCode.custom,\n        path: ['min'],\n        message: 'must be <= max',\n      })\n      ctx.addIssue({\n        code: z.ZodIssueCode.custom,\n        path: ['max'],\n        message: 'must be >= min',\n      })\n    }\n  })\n\nschema.parse({ min: 2, max: 1 }) // thrown error only notes that `foo` is required\n"})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"conditionalValidate"})," solves this problem by allowing you to declare a validation that runs as long as\n",(0,i.jsx)(n.code,{children:"min"})," and ",(0,i.jsx)(n.code,{children:"max"})," are valid by themselves:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const schema = conditionalValidate(\n  z.object({\n    foo: z.string(),\n    min: z.number().finite(),\n    max: z.number().finite(),\n  })\n).conditionalRefine(\n  // Pick the fields the refinement depends on here\n  (s) => s.pick({ min: true, max: true }),\n  // This refinement will only be checked if min and max are successfully parsed\n  ({ min, max }) => min <= max,\n  [\n    { path: ['min'], message: 'must be <= max' },\n    { path: ['max'], message: 'must be >= min' },\n  ]\n)\n\nschema.parse({ min: 2, max: 1 }) // thrown error includes issues for `foo` being missing and `min`/`max` being wrong\n"})}),"\n",(0,i.jsxs)(n.h2,{id:"returns-conditionalvalidatort",children:["Returns ",(0,i.jsx)(n.code,{children:"ConditionalValidator<T>"})]}),"\n",(0,i.jsxs)(n.p,{children:["A subclass of ",(0,i.jsx)(n.code,{children:"ZodEffects"})," (a ",(0,i.jsxs)(n.a,{href:"https://zod.dev/?id=preprocess",children:[(0,i.jsx)(n.code,{children:"preprocess"})," effect"]}),") with the following additional methods:"]}),"\n",(0,i.jsx)(n.h3,{id:"conditionalrefine",children:(0,i.jsx)(n.code,{children:"conditionalRefine"})}),"\n",(0,i.jsx)(n.p,{children:"Applies a conditional refinement"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"  conditionalRefine(\n    schema: ConditionalRefineSchema<T>,\n    check: (value: z.output<T>) => unknown,\n    message:\n      | string\n      | z.CustomErrorParams\n      | z.CustomErrorParams[]\n      | ((value: Output) => z.CustomErrorParams | z.CustomErrorParams[])\n  ): ConditionalValidator<T>\n"})}),"\n",(0,i.jsx)(n.h4,{id:"arguments",children:"Arguments"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"schema"})," should be Zod schema requiring a subset of the fields in the base schema (which was passed to ",(0,i.jsx)(n.code,{children:"conditionalValidate"}),") or a function that takes the base schema and returns such a schema."]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"message"})," is similar to ",(0,i.jsx)(n.code,{children:".refine"})," except that it may be an array of messages/issues."]}),"\n",(0,i.jsx)(n.h4,{id:"returns",children:"Returns"}),"\n",(0,i.jsxs)(n.p,{children:["A schema that will ",(0,i.jsx)(n.code,{children:"safeParse"})," the input with the given ",(0,i.jsx)(n.code,{children:"schema"})," in a ",(0,i.jsxs)(n.a,{href:"https://zod.dev/?id=preprocess",children:[(0,i.jsx)(n.code,{children:"preprocess"})," effect"]}),"(",(0,i.jsx)(n.a,{href:"https://zod.dev/?id=preprocess",children:"https://zod.dev/?id=preprocess"}),"), and if successful, it will evaluate ",(0,i.jsx)(n.code,{children:"check"})," on\nthe parsed value. If ",(0,i.jsx)(n.code,{children:"check"})," returns a falsy value, adds the\nspecified issue(s) in ",(0,i.jsx)(n.code,{children:"message"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"conditionalrefineasync",children:(0,i.jsx)(n.code,{children:"conditionalRefineAsync"})}),"\n",(0,i.jsx)(n.p,{children:"Applies a conditional refinement with async parsing and/or check"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"  conditionalRefineAsync(\n    schema: ConditionalRefineSchema<T>,\n    check: (value: z.output<T>) => unknown | Promise<unknown>,\n    message:\n      | string\n      | z.CustomErrorParams\n      | z.CustomErrorParams[]\n      | ((value: Output) => z.CustomErrorParams | z.CustomErrorParams[])\n  ): ConditionalValidator<T>\n"})}),"\n",(0,i.jsx)(n.h4,{id:"arguments-1",children:"Arguments"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"schema"})," should be Zod schema requiring a subset of the fields in the base schema (which was passed to ",(0,i.jsx)(n.code,{children:"conditionalValidate"}),") or a function that takes the base schema and returns such a schema."]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"message"})," is similar to ",(0,i.jsx)(n.code,{children:".refine"})," except that it may be an array of messages/issues."]}),"\n",(0,i.jsx)(n.h4,{id:"returns-1",children:"Returns"}),"\n",(0,i.jsxs)(n.p,{children:["A schema will ",(0,i.jsx)(n.code,{children:"safeParseAsync"})," the input with the given ",(0,i.jsx)(n.code,{children:"schema"})," in a ",(0,i.jsxs)(n.a,{href:"https://zod.dev/?id=preprocess",children:[(0,i.jsx)(n.code,{children:"preprocess"})," effect"]}),"(",(0,i.jsx)(n.a,{href:"https://zod.dev/?id=preprocess",children:"https://zod.dev/?id=preprocess"}),"), and if successful, it will evaluate ",(0,i.jsx)(n.code,{children:"check"})," on\nthe parsed value. If ",(0,i.jsx)(n.code,{children:"check"})," returns a falsy value, adds the\nspecified issue(s) in ",(0,i.jsx)(n.code,{children:"message"}),"."]}),"\n",(0,i.jsx)(n.h3,{id:"conditionalsuperrefine",children:(0,i.jsx)(n.code,{children:"conditionalSuperRefine"})}),"\n",(0,i.jsx)(n.p,{children:"Applies a conditional superRefine"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"  conditionalSuperRefine(\n    schema: ConditionalRefineSchema<T>,\n    check: (value: z.output<T>, ctx: z.RefinementCtx) => void\n  ) {\n    return new ConditionalValidator(this._def.schema, [\n      ...this._def.checks,\n      { schema: resolveSchema(this._def.schema, schema), check, async: false },\n    ])\n  }\n"})}),"\n",(0,i.jsx)(n.h4,{id:"arguments-2",children:"Arguments"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"schema"})," should be Zod schema requiring a subset of the fields in the base schema (which was passed to ",(0,i.jsx)(n.code,{children:"conditionalValidate"}),") or a function that takes the base schema and returns such a schema."]}),"\n",(0,i.jsx)(n.h4,{id:"returns-2",children:"Returns"}),"\n",(0,i.jsxs)(n.p,{children:["A schema will ",(0,i.jsx)(n.code,{children:"safeParse"})," the input with the given ",(0,i.jsx)(n.code,{children:"schema"})," in a ",(0,i.jsxs)(n.a,{href:"https://zod.dev/?id=preprocess",children:[(0,i.jsx)(n.code,{children:"preprocess"})," effect"]}),"(",(0,i.jsx)(n.a,{href:"https://zod.dev/?id=preprocess",children:"https://zod.dev/?id=preprocess"}),"), and if successful, it will evaluate ",(0,i.jsx)(n.code,{children:"check"})," on the parsed value."]}),"\n",(0,i.jsx)(n.h3,{id:"conditionalsuperrefineasync",children:(0,i.jsx)(n.code,{children:"conditionalSuperRefineAsync"})}),"\n",(0,i.jsx)(n.p,{children:"Applies a conditional superRefine with async parsing or check"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"  conditionalSuperRefineAsync(\n    schema: ConditionalRefineSchema<T>,\n    check: (value: z.output<T>, ctx: z.RefinementCtx) => void | Promise<void>\n  ) {\n    return new ConditionalValidator(this._def.schema, [\n      ...this._def.checks,\n      { schema: resolveSchema(this._def.schema, schema), check, async: false },\n    ])\n  }\n"})}),"\n",(0,i.jsx)(n.h4,{id:"arguments-3",children:"Arguments"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"schema"})," should be Zod schema requiring a subset of the fields in the base schema (which was passed to ",(0,i.jsx)(n.code,{children:"conditionalValidate"}),") or a function that takes the base schema and returns such a schema."]}),"\n",(0,i.jsx)(n.h4,{id:"returns-3",children:"Returns"}),"\n",(0,i.jsxs)(n.p,{children:["The returned schema will ",(0,i.jsx)(n.code,{children:"safeParseAsync"})," the input with the given ",(0,i.jsx)(n.code,{children:"schema"})," in a ",(0,i.jsxs)(n.a,{href:"https://zod.dev/?id=preprocess",children:[(0,i.jsx)(n.code,{children:"preprocess"})," effect"]}),"(",(0,i.jsx)(n.a,{href:"https://zod.dev/?id=preprocess",children:"https://zod.dev/?id=preprocess"}),"), and if successful, it will evaluate ",(0,i.jsx)(n.code,{children:"check"})," on\nthe parsed value."]})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},5710:(e,n,s)=>{s.d(n,{R:()=>d,x:()=>r});var i=s(758);const a={},c=i.createContext(a);function d(e){const n=i.useContext(c);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:d(e.components),i.createElement(c.Provider,{value:n},e.children)}}}]);
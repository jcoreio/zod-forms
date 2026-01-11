import z from 'zod'
import { IgnoreEffect } from 'zod-invertible'
import { DeepPartial } from './util/DeepPartial'

type ConditionalCheck<T extends z.ZodTypeAny> = {
  schema: T
  check: (value: z.output<T>, ctx: z.RefinementCtx) => void | Promise<void>
  async: boolean
}

interface ConditionalValidatorDef<T extends z.ZodTypeAny>
  extends z.ZodEffectsDef<T> {
  checks: ConditionalCheck<any>[]
}

type ConditionalRefineMessage<Output> =
  | string
  | z.CustomErrorParams
  | z.CustomErrorParams[]
  | ((value: Output) => z.CustomErrorParams | z.CustomErrorParams[])

type ConditionalRefineSchema<T extends z.ZodTypeAny> =
  | z.ZodType<DeepPartial<z.output<T>>, any, DeepPartial<z.input<T>>>
  | ((
      schema: T
    ) => z.ZodType<DeepPartial<z.output<T>>, any, DeepPartial<z.input<T>>>)

function resolveSchema<T extends z.ZodTypeAny>(
  baseSchema: T,
  refineSchema: ConditionalRefineSchema<T>
) {
  return typeof refineSchema === 'function' ?
      refineSchema(baseSchema)
    : refineSchema
}

export class ConditionalValidator<
  T extends z.ZodTypeAny,
  Output = z.output<T>,
  Input = z.input<T>,
> extends z.ZodEffects<T, Output, Input> {
  declare _def: ConditionalValidatorDef<T>;

  [IgnoreEffect] = true

  constructor(schema: T, checks: ConditionalCheck<any>[]) {
    super({
      ...makePreprocess(schema, checks)._def,
      checks,
    } satisfies ConditionalValidatorDef<T> as z.ZodEffectsDef<T>)
  }

  conditionalRefine(
    schema: ConditionalRefineSchema<T>,
    check: (value: z.output<T>) => unknown,
    message: ConditionalRefineMessage<z.output<T>>
  ) {
    return this.conditionalSuperRefine(schema, (value, ctx) => {
      if (!check(value)) {
        addIssues(ctx, value, message)
      }
    })
  }
  conditionalRefineAsync(
    schema: ConditionalRefineSchema<T>,
    check: (value: z.output<T>) => unknown | Promise<unknown>,
    message: ConditionalRefineMessage<z.output<T>>
  ) {
    return this.conditionalSuperRefineAsync(schema, async (value, ctx) => {
      if (!(await check(value))) {
        addIssues(ctx, value, message)
      }
    })
  }
  conditionalSuperRefine(
    schema: ConditionalRefineSchema<T>,
    check: (value: z.output<T>, ctx: z.RefinementCtx) => void
  ) {
    return new ConditionalValidator(this._def.schema, [
      ...this._def.checks,
      { schema: resolveSchema(this._def.schema, schema), check, async: false },
    ])
  }
  conditionalSuperRefineAsync(
    schema: ConditionalRefineSchema<T>,
    check: (value: z.output<T>, ctx: z.RefinementCtx) => void | Promise<void>
  ) {
    return new ConditionalValidator(this._def.schema, [
      ...this._def.checks,
      { schema: resolveSchema(this._def.schema, schema), check, async: true },
    ])
  }
}

export function conditionalValidate<T extends z.ZodTypeAny>(
  schema: T
): ConditionalValidator<T> {
  return new ConditionalValidator(schema, [])
}

function makePreprocess<T extends z.ZodTypeAny>(
  schema: T,
  checks: ConditionalCheck<any>[]
): z.ZodEffects<T> {
  return z.preprocess((input, ctx) => {
    const results = checks.map(({ schema, check, async }) => {
      function handleParsed(
        parsed: z.SafeParseReturnType<z.input<T>, z.output<T>>
      ) {
        if (!parsed.success) return
        return check(parsed.data, ctx)
      }
      return async ?
          schema.safeParseAsync(input).then(handleParsed)
        : handleParsed(schema.safeParse(input))
    })
    return checks.some((c) => c.async) ?
        Promise.all(results).then(() => input)
      : input
  }, schema)
}

const asArray = <T>(value: T | T[]) => (Array.isArray(value) ? value : [value])

function addIssues<Output>(
  ctx: z.RefinementCtx,
  value: Output,
  message: ConditionalRefineMessage<Output>
) {
  const issues = asArray(
    typeof message === 'function' ? message(value)
    : typeof message === 'string' ? { message }
    : message
  )
  for (const issue of issues) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, ...issue })
  }
}

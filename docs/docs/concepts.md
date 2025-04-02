---
sidebar_position: 2
---

# Concepts

## Values and Parsed Values

Zod schemas parse an input value and may return an output value of a different type.

To support this well, `@jcoreio/zod-forms` stores both input and output values in form state.

The API refers to input values as "values" and output values as "parsed values".

## Path arrays

A path array is an array representation of the path to a value. For example `['foo', 0, 'bar']` represents the value at `values.foo[0].bar`.

## Pathstrings

A pathstring is a string containing an idiomatic JS property path expression. For example, `'foo[0].bar'` represents the value at `values.foo[0].bar`.

You may use strings with escape characters inside brackets like `["\"hello world\""]`.

---
sidebar_position: 1
---

# Requirements and Disclaimers

## Environment

`@jcoreio/zod-form` may require certain ECMAScript features to be polyfilled depending on your environment.

## Designed for Zod and React only

Other projects like [`react-hook-form`](https://react-hook-form.com/) are designed to integrate with a wide
variety of validation libraries. `@jcoreio/zod` form will always require `zod` schemas, to provide the
smoothest integration when using `zod`.

## Not currently designed for super high performance

[`final-form`](https://final-form.org/) uses granular field subscriptions to minimize work in large forms.
Although `@jcoreio/zod-form` does its best to avoid unnecessary rerendering, it currently parses the entire
form values with your schema when any field is changed.

[`react-hook-form`](https://react-hook-form.com/) uses uncontrolled components by default to get maximum
performance in large forms.
import clsx from 'clsx'
import Heading from '@theme/Heading'
import styles from './styles.module.css'
import React from 'react'

type FeatureItem = {
  title: string
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>
  description: React.JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: '100% Typesafe',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Fully typechecked paths, input and output types for deeply nested fields
      </>
    ),
  },
  {
    title: 'Smoothest Zod integration',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Connecting <code>z.string().optional()</code>,{' '}
        <code>z.string().nullable()</code>,<code>z.number()</code> etc to{' '}
        <code>&lt;input&gt;</code>s works out of the box. Interprets blank
        inputs as <code>undefined</code> or <code>null</code> by default,
        depending on what the field schema accepts
      </>
    ),
  },
  {
    title: 'Opinionated Defaults',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Provides the behavior we want in JCore projects by default (normalizes
        inputs on blur, and after submission, resets initial parsedValues to
        submitted parsedValues)
      </>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {Svg && <Svg className={styles.featureSvg} role="img" />}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): React.JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}

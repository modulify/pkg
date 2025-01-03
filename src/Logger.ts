import chalk from 'chalk'
import figures from 'figures'

import * as util from 'node:util'

export interface LoggerInterface {
  info (template: string, context: unknown[]): void;
  warn (template: string, context: unknown[]): void;
  error (template: string, context: unknown[]): void;
}

export class Logger implements LoggerInterface {
  private readonly dry: boolean

  constructor ({ dry }: { dry: boolean; }) {
    this.dry = dry
  }

  get figure () {
    return this.dry
      ? chalk.yellow(figures.tick)
      : chalk.green(figures.tick)
  }

  info (template: string, context: unknown[] = []) {
    console.info(this.format(template, context))
  }

  warn (template: string, context: unknown[] = []) {
    console.warn(chalk.yellow(this.format(template, context, figures.warning)))
  }

  error (template: string, context: unknown[] = []) {
    console.error(chalk.red(this.format(template, context, figures.cross)))
  }

  format (template: string, context: unknown[] = [], figure: string | undefined = undefined) {
    const bold = (arg: unknown) => chalk.bold(arg)
    const message = util.format(template, ...context.map(bold))

    return (figure ?? this.figure) + ' ' + message
  }
}
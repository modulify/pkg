export interface Manifest {
  /** The name of the package, must be globally unique in npm registry. */
  name?: string;
  /** The version of the package, adhering to semantic versioning (semver). */
  version?: string;

  /**
   * A short description of the package. This helps people discover the package, as it's listed in 'npm search'.
   * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#description
   */
  description?: string;

  /** Keywords that describe the package and improve discoverability. */
  keywords?: string[];

  /** The URL of the package's homepage. */
  homepage?: string;

  /** Information about where bugs or issues can be reported. */
  bugs?: string | { url?: string; email?: string };
  /** The version control repository for the package. */
  repository?: string | Repository;

  /** The license under which the package is distributed. */
  license?: string;
  /** The author of the package. */
  author?: string | Person;
  /** A list of people who contributed to this package. */
  contributors?: (string | Person)[];

  /** The primary entry point to the program in CommonJS format. */
  main?: string;
  /** The primary entry point for ES Module systems. */
  module?: string;
  /** The TypeScript typings or type definitions entry point. */
  types?: string;
  /** The TypeScript typings for different versions of the TypeScript and/or for different entrypoint */
  typesVersions?: TypesVersions;
  /** Conditional exports based on environments or entry points. */
  exports?: Exports;
  files?: string[];
  /** Overrides for environments running in browsers instead of Node.js. */
  browser?: string | Record<string, string>;
  /** The executable files exposed by the package. */
  bin?: string | Record<string, string>;
  /** Manual pages (man pages) for CLI tools provided by the package. */
  man?: string | string[];

  /** Custom npm scripts for running predefined commands or tasks. */
  scripts?: { [name: string]: string };

  /** A map of production dependencies required by the package. */
  dependencies?: Dependencies;
  /** A map of development dependencies needed for development and testing. */
  devDependencies?: Dependencies;

  /**
   * A map of optional dependencies that can be safely omitted.
   * These packages will be installed if possible and package manager will not produce any errors
   * if installation is not available. Useful for adding platform-specific dependencies.
   */
  optionalDependencies?: Dependencies;

  /**
   * A map of complementary dependencies that should match the consuming project's versions.
   * These packages should be installed in the consuming project manually by a developer.
   */
  peerDependencies?: Dependencies;
  /** Metadata for peer dependencies, such as marking them optional. */
  peerDependenciesMeta?: { [name: string]: { optional?: boolean } };

  /**
   * A list of dependencies to bundle when packaging the module.
   * These are included in the published package.
   */
  bundleDependencies?: string[];
  /** An alias for "bundleDependencies". */
  bundledDependencies?: string[];

  /** The list of workspace directories, specified as path patterns. */
  workspaces?: string[];

  /** Operating systems on which the package is supported. */
  os?: string[];
  /** CPU architectures on which the package is supported. */
  cpu?: string[];

  /** Engines compatible with the package (e.g., Node.js version). */
  engines?: Engines;

  /**
   * If set to true, then npm will stubbornly refuse to install (or even consider installing)
   * any package that claims to not be compatible with the current Node.js version.
   */
  engineStrict?: boolean;

  /**
   * This object can be used to set configuration parameters used in package scripts that persist across upgrades.
   * For instance, if a package had the following:
   *
   * <pre>
   * {
   *   "name": "foo",
   *   "config": {
   *     "port": "8080"
   *   }
   * }
   * </pre>
   *
   * It could also have a "start" command that referenced the `npm_package_config_port` environment variable.
   */
  config?: Record<string, unknown>;

  /**
   * This is a set of config values that will be used at publish-time.
   * It's especially handy if you want to set the tag, registry or access, so that you can ensure that a given package
   * is not tagged with "latest", published to the global public registry or that a scoped module is private by default.
   */
  publishConfig?: Record<string, unknown>;
}

/**
 * The type for the "exports" field in package.json, which allows conditional exports
 * based on environment or entry points.
 */
export type Exports = ExportsEntry | { [entry: string]: ExportsEntry }
export type ExportsEntry =
  | string
  | string[]
  | ConditionalExports
  | ConditionalExports[]
  | null

/**
 * Keys listed in order from most specific to least specific as conditions should be defined.
 */
export interface ConditionalExports {
  /**
   * Similar to `node` and matches for any Node.js environment.
   * This condition can be used to provide an entry point which uses native C++ addons as opposed to an entry point
   * which is more universal and doesn't rely on native addons.
   * This condition can be disabled via the `--no-addons` flag.
   */
  'node-addons'?: ExportsEntry;

  /**
   * Matches for any Node.js environment. Can be a CommonJS or ES module file.
   * _In most cases explicitly calling out the Node.js platform is not necessary._
   */
  node?: ExportsEntry;

  /**
   * The module path that is resolved when this specifier is imported as
   * an ECMAScript module using an `import` declaration or the dynamic `import(...)` function.
   */
  import?: ExportsEntry;

  /**
   * Matches when the package is loaded via `require()`.
   * The referenced file should be loadable with `require()` although the condition matches
   * regardless of the module format of the target file.
   * Expected formats include CommonJS, JSON, native addons, and ES modules.
   * Always mutually exclusive with `import`
   */
  require?: ExportsEntry;

  /**
   * Matches no matter the package is loaded via `import`, `import()` or `require()`.
   * The format is expected to be ES modules that does not contain top-level await in its module graph - if it does,
   * `ERR_REQUIRE_ASYNC_MODULE` will be thrown when the module is `require()`-ed.
   */
  'module-sync'?: ExportsEntry;

  /**
   * The generic fallback that always matches. Can be a CommonJS or ES module file.
   * _This condition should always come last._
   */
  default?: ExportsEntry;

  /**
   * Any custom conditions are also allowed, such as custom environments.
   */
  [custom: string]: ExportsEntry
}

/** Specifies supported Node.js or package engine versions. */
export type Engines = {
  [name: string]: string;
}

/** Represents a list of dependencies with their versions. */
export type Dependencies = {
  [name: string]: string;
}

/** A person who has been involved in creating or maintaining this package. */
export type Person = {
  name: string;
  email?: string;
  url?: string;
}

export type Repository = {
  type?: string;
  url?: string;
  directory?: string;
}

export type TypesVersions = {
  [versionOrCondition: string]: {
    [path: string]: string[];
  };
}
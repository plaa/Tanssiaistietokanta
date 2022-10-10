//export type Path<T> = Key[]
export type Path<Target,DepthCounter extends number = 3> = [] |
  DepthCounter extends never
    ? []
    : Target extends (infer U)[]
      ? [number, ...Path<U, Decrement[DepthCounter]>]
      : Target extends object
        ? ({ [K in keyof Target]-?: K extends string | number ?
          [K, ...Path<Target[K], Decrement[DepthCounter]>]
          : []
        }[keyof Target])
        : []

export type PropertyAtPath<Target extends unknown, Path extends readonly unknown[]> =
  // Base recursive case, no more paths to traverse
  Path extends []
    // Return target
    ? Target
    // Here we have 1 or more paths to access
    : Path extends [infer TargetPath, ...infer RemainingPaths]
      // Check Target can be accessed via this path
      ? TargetPath extends keyof Target
        // Recurse and grab paths
        ? PropertyAtPath<Target[TargetPath], RemainingPaths>
        // Target path is not keyof Target
        : never
      // Paths could not be destructured
      : never;

type Decrement = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]
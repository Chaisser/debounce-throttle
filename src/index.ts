export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export interface DebouncedFunction<T extends (...args: any[]) => any> extends Cancelable {
  (...args: Parameters<T>): ReturnType<T> | undefined;
}

export interface ThrottledFunction<T extends (...args: any[]) => any> extends Cancelable {
  (...args: Parameters<T>): ReturnType<T> | undefined;
}

export interface Cancelable {
  cancel: () => void;
  flush: () => void;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait
 * @param options - Options
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let result: ReturnType<T> | undefined;

  const { leading = false, trailing = true } = options;

  const invokeFunc = () => {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;

    if (args) {
      result = func.apply(thisArg, args);
    }

    return result;
  };

  const debounced: DebouncedFunction<T> = function (this: any, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (leading) {
      result = invokeFunc();
    }

    if (trailing) {
      timeoutId = setTimeout(() => {
        if (timeoutId) {
          timeoutId = null;
          invokeFunc();
        }
      }, wait);
    }

    return result;
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      return invokeFunc();
    }
    return result;
  };

  return debounced;
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 * @param func - Function to throttle
 * @param wait - Milliseconds to wait between calls
 * @param options - Options
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: ThrottleOptions = {}
): ThrottledFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let result: ReturnType<T> | undefined;
  let shouldCall = true;

  const { leading = true, trailing = true } = options;

  const invokeFunc = () => {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;

    if (args) {
      result = func.apply(thisArg, args);
    }

    return result;
  };

  const throttled: ThrottledFunction<T> = function (this: any, ...args: Parameters<T>) {
    if (!shouldCall) {
      lastArgs = args;
      lastThis = this;
      return result;
    }

    if (leading) {
      result = func.apply(this, args);
    } else {
      lastArgs = args;
      lastThis = this;
    }

    shouldCall = false;

    if (trailing) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        shouldCall = true;
        if (!leading) {
          invokeFunc();
        }
      }, wait);
    } else {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        shouldCall = true;
      }, wait);
    }

    return result;
  } as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
    shouldCall = true;
  };

  throttled.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      return invokeFunc();
    }
    return result;
  };

  return throttled;
}

/**
 * Creates a function that will delay the execution of func until after wait milliseconds
 */
export function delay(wait: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, wait));
}

# @chaisser/debounce-throttle

> Simple debounce and throttle functions with cancel support

Lightweight, zero-dependency rate limiting utilities. Debounce delays execution until after a quiet period; throttle limits execution to at most once per interval. Both support leading/trailing edge invocation and cancel/flush controls.

---

## Installation

```bash
npm install @chaisser/debounce-throttle
# or
yarn add @chaisser/debounce-throttle
# or
pnpm add @chaisser/debounce-throttle
```

---

## Quick Start

```typescript
import { debounce, throttle, delay } from '@chaisser/debounce-throttle';

// Debounce: fire after 300ms of silence
const search = debounce((query: string) => {
  console.log('Searching:', query);
}, 300);

search('he');
search('hel');
search('hell');
search('hello'); // only this fires after 300ms

// Throttle: fire at most once per 1000ms
const onScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 1000);

window.addEventListener('scroll', onScroll);
```

---

## API Reference

### `debounce(func, wait, options?)`

Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last call.

| Param | Type | Description |
|-------|------|-------------|
| `func` | `(...args) => any` | Function to debounce |
| `wait` | `number` | Delay in milliseconds |
| `options.leading` | `boolean` | Invoke on the leading edge (default: `false`) |
| `options.trailing` | `boolean` | Invoke on the trailing edge (default: `true`) |

Returns a `DebouncedFunction` with `.cancel()` and `.flush()` methods.

### `throttle(func, wait, options?)`

Creates a throttled function that invokes `func` at most once per `wait` milliseconds.

| Param | Type | Description |
|-------|------|-------------|
| `func` | `(...args) => any` | Function to throttle |
| `wait` | `number` | Interval in milliseconds |
| `options.leading` | `boolean` | Invoke on the leading edge (default: `true`) |
| `options.trailing` | `boolean` | Invoke on the trailing edge (default: `true`) |

Returns a `ThrottledFunction` with `.cancel()` and `.flush()` methods.

### `delay(wait)`

Returns a `Promise<void>` that resolves after `wait` milliseconds.

### Cancelable Methods

Both `debounce` and `throttle` return functions with:

| Method | Description |
|--------|-------------|
| `.cancel()` | Cancel pending execution and reset state |
| `.flush()` | Immediately invoke pending function and clear timer |

---

## Examples

### Cancel a Debounced Call

```typescript
import { debounce } from '@chaisser/debounce-throttle';

const save = debounce((data: string) => {
  console.log('Saved:', data);
}, 1000);

save('draft');

// User navigated away before save fired
save.cancel();
```

### Flush Immediately

```typescript
import { debounce } from '@chaisser/debounce-throttle';

const log = debounce((msg: string) => {
  console.log(msg);
}, 2000);

log('hello');

// Force immediate execution instead of waiting
log.flush(); // logs 'hello' now
```

### Leading Edge Only

```typescript
import { debounce, throttle } from '@chaisser/debounce-throttle';

// Fire immediately on first call, ignore subsequent calls within 500ms
const onFirstClick = debounce(() => {
  console.log('Action triggered');
}, 500, { leading: true, trailing: false });

// Throttle: fire immediately, then silence for 1s
const onSave = throttle(() => {
  console.log('Saving...');
}, 1000, { leading: true, trailing: false });
```

### Trailing Edge Only (Default Throttle)

```typescript
import { throttle } from '@chaisser/debounce-throttle';

// Wait until the interval passes, then fire with the last args
const onMouseMove = throttle((x: number, y: number) => {
  console.log(`Mouse: ${x}, ${y}`);
}, 100, { leading: false, trailing: true });
```

### Promise-based Delay

```typescript
import { delay } from '@chaisser/debounce-throttle';

async function retryWithBackoff(fn: () => Promise<void>, attempts: number) {
  for (let i = 0; i < attempts; i++) {
    try {
      await fn();
      return;
    } catch {
      await delay(1000 * Math.pow(2, i));
    }
  }
}
```

---

## License

MIT

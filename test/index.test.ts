import { describe, it, expect, vi, beforeEach } from 'vitest';
import { debounce, throttle, delay } from '../src/index';

describe('@chaisser/debounce-throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('debounce', () => {
    it('delays function execution', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('calls function with latest arguments', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('first');
      debounced('second');
      debounced('third');

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledWith('third');
    });

    it('resets timer on each call', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(50);
      debounced();

      expect(fn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('supports leading option', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true });

      debounced();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('supports cancel', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced.cancel();

      vi.advanceTimersByTime(100);
      expect(fn).not.toHaveBeenCalled();
    });

    it('supports flush', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced.flush();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('preserves context', async () => {
      const fn = vi.fn(function (this: any) {
        return this.value;
      });
      const debounced = debounce(fn, 100);

      const obj = { value: 42 };
      debounced.call(obj);

      vi.advanceTimersByTime(100);
      expect(fn.mock.results[0].value).toBe(42);
    });
  });

  describe('throttle', () => {
    it('limits function calls', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('calls function with first call arguments', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled('first');
      throttled('second');
      throttled('third');

      expect(fn).toHaveBeenCalledWith('first');
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('respects trailing calls', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100, { leading: false, trailing: true });

      throttled('first');
      throttled('second');

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('second');
    });

    it('supports cancel', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);

      throttled();
      throttled.cancel();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('supports flush', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled.flush();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('preserves context', () => {
      const fn = vi.fn(function (this: any) {
        return this.value;
      });
      const throttled = throttle(fn, 100);

      const obj = { value: 42 };
      throttled.call(obj);

      expect(fn.mock.results[0].value).toBe(42);
    });

    it('allows subsequent calls after wait period', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('delay', () => {
    it('resolves after specified time', async () => {
      const promise = delay(100);

      vi.advanceTimersByTime(100);
      await promise;

      expect(true).toBe(true);
    });
  });
});

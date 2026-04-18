type Listener<T> = (event: T) => void;

/**
 * Minimal typed event emitter that works in any browser or Node.js environment
 * without depending on Node's built-in `events` module.
 */
// Using `object` instead of `Record<string, unknown>` lets consumers define
// event maps with specific value types without needing an index signature.
export class MiniEventEmitter<Events extends object> {
  private _listeners: Partial<{
    [K in keyof Events]: Array<Listener<Events[K]>>;
  }> = {};

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event]!.push(listener);
    return this;
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    const list = this._listeners[event];
    if (list) {
      this._listeners[event] = list.filter(
        (l) => l !== listener
      ) as Array<Listener<Events[K]>>;
    }
    return this;
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    const wrapper: Listener<Events[K]> = (ev) => {
      this.off(event, wrapper);
      listener(ev);
    };
    return this.on(event, wrapper);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const list = this._listeners[event];
    if (list) {
      // Iterate over a snapshot to allow listeners to call `off` safely.
      [...list].forEach((l) => l(data));
    }
  }

  removeAllListeners(event?: keyof Events): this {
    if (event !== undefined) {
      delete this._listeners[event];
    } else {
      this._listeners = {};
    }
    return this;
  }
}

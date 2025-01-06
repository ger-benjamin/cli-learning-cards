import { EventEmitter } from "node:events";

/**
 * Basic generic listenable value. Calling "setValue" emit a "change" event.
 */
export class EventValue<T> extends EventEmitter {
  private value: T | null = null;

  /**
   * The internal value and emit a "change" event with the new and the "old" value.
   */
  setValue(newValue: T) {
    if (newValue === this.value) {
      return;
    }
    this.emit("change", newValue, this.value);
    this.value = newValue;
  }

  /**
   * @returns the current stored value.
   */
  getValue(): T | null {
    return this.value;
  }
}

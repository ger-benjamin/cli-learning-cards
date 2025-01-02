import { EventEmitter } from "node:events";

export class EventValue<T> extends EventEmitter {
  private value: T | null = null;

  setValue(newValue: T) {
    if (newValue === this.value) {
      return;
    }
    this.emit("change", newValue, this.value);
    this.value = newValue;
  }

  getValue(): T | null {
    return this.value;
  }
}

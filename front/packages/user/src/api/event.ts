/**
 * Event handler function.
 */
export type EventHandler<T> = (args: T) => void;

/**
 * Event class.
 * @typeparam T Event argument type.
 */
export default class Event<T> {
  private handlers: EventHandler<T>[] = [];

  /**
   * @description: on is a method that adds an event handler to the event
   * @param {EventHandler<T>} handler - the event handler function
   * @returns {void}
   */
  public on(handler: EventHandler<T>): void {
    this.handlers.push(handler);
  }

  public off(handler: EventHandler<T>): void {
    const index = this.handlers.indexOf(handler);
    if (index >= 0) {
      this.handlers.splice(index, 1);
    }
  }

  public trigger(args: T): void {
    this.handlers.forEach(handler => handler(args));
  }
}

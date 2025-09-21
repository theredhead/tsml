/**
 * Decorator to mark a class with a content property for TSX/JSX usage.
 * @param contentProp - The property name to be used as content.
 */
export function Content(contentProp: string) {
  return function <T extends new (...args: any[]) => any>(Ctor: T): T {
    // Attach or extend the __tsx metadata on the constructor
    const existing = (Ctor as any).__tsx || {};
    (Ctor as any).__tsx = { ...existing, contentProp };
    return Ctor;
  };
}

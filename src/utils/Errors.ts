function makeError(name: string): ErrorConstructor {
  return Function(`return class ${name} extends Error {
    constructor(message) {
      super(message);
      this.name = '${name}';
    }
  }`)();
}

export const NoDiscriminatorFound = makeError('NoDiscriminatorFound');
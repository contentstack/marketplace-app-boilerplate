const NODE_ENV = process.env.NODE_ENV;

const getEnv: Function = (): string => NODE_ENV;

export { getEnv };

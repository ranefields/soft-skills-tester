interface Console {
    /** Displays a console log only if NODE_ENV meets the given conditions. */
    logInEnvironment(environmentConditions: LogEnvironmentConditions, message: any);
    /** Displays a console log only if NODE_ENV is 'development'. */
    logDev(message: any);
}

console.logInEnvironment = function (environmentConditions: LogEnvironmentConditions, message: any) {
  let doLog = true;
  if (environmentConditions.include) {
    if (!environmentConditions.include.includes(process.env.NODE_ENV)) {
      doLog = false;
    }
  }
  if (environmentConditions.exclude) {
    if (environmentConditions.exclude.includes(process.env.NODE_ENV)) {
      doLog = false;
    }
  }
  if (doLog) { console.log(message); }
}

console.logDev = function(message: any) {
  console.logInEnvironment({include: ['development']}, message);
}

interface LogEnvironmentConditions {
  /** Array of environments to allow. */
  include?: string[];
  /** Array of environments to disallow. */
  exclude?: string[];
}

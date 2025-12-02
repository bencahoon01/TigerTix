const TestLogger = require('./TestLogger');

// Create global test logger
const testLogger = new TestLogger();

// Jest custom reporter
class CustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunStart() {
    console.log('\nStarting test execution...\n');
  }

  onTestResult(test, testResult, aggregatedResult) {
    const category = this.getCategoryFromPath(testResult.testFilePath);
    
    testResult.testResults.forEach(result => {
      const status = result.status === 'passed' ? 'passed' : 
                     result.status === 'failed' ? 'failed' : 'skipped';
      const duration = result.duration || 0;
      const error = result.failureMessages.length > 0 
        ? result.failureMessages[0].split('\n')[0] 
        : null;

      testLogger.logTest(category, result.title, status, duration, error);
    });
  }

  onRunComplete() {
    console.log('\n📊 Generating test reports...\n');
    testLogger.writeToFile();
    testLogger.writeJSONReport();
    testLogger.writeMarkdownReport();
    console.log(testLogger.generateReport());
  }

  getCategoryFromPath(filePath) {
    if (filePath.includes('authentication')) return 'Authentication Tests';
    if (filePath.includes('auth-integration')) return 'Authentication Integration';
    if (filePath.includes('token-expiration')) return 'Token Expiration Tests';
    if (filePath.includes('admin')) return 'Admin Service Tests';
    if (filePath.includes('client')) return 'Client Service Tests';
    if (filePath.includes('llm-service')) return 'LLM Service Tests';
    if (filePath.includes('integration')) return 'Integration Tests';
    if (filePath.includes('accessibility')) return 'Accessibility Tests';
    if (filePath.includes('e2e-workflows')) return 'End-to-End Workflows';
    if (filePath.includes('SignIn')) return 'SignIn Component Tests';
    if (filePath.includes('SignUp')) return 'SignUp Component Tests';
    if (filePath.includes('Chat')) return 'Chat Component Tests';
    return 'Other Tests';
  }
}

module.exports = CustomReporter;

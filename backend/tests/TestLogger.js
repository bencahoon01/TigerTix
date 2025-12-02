const fs = require('fs');
const path = require('path');

class TestLogger {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      },
      categories: {}
    };
    this.logFile = path.join(__dirname, 'test-results.log');
    this.mdFile = path.join(__dirname, 'test-results.md');
  }

  addCategory(categoryName) {
    if (!this.results.categories[categoryName]) {
      this.results.categories[categoryName] = {
        tests: [],
        passed: 0,
        failed: 0,
        skipped: 0
      };
    }
  }

  logTest(category, testName, status, duration, error = null) {
    this.addCategory(category);
    
    const testResult = {
      name: testName,
      status: status, // 'passed', 'failed', 'skipped'
      duration: duration,
      error: error,
      timestamp: new Date().toISOString()
    };

    this.results.categories[category].tests.push(testResult);
    this.results.categories[category][status]++;
    this.results.summary[status]++;
    this.results.summary.total++;
  }

  generateReport() {
    let report = '';
    report += '═══════════════════════════════════════════════════════════\n';
    report += '                    TEST EXECUTION REPORT                  \n';
    report += '═══════════════════════════════════════════════════════════\n';
    report += `Generated: ${this.results.timestamp}\n\n`;

    // Summary
    report += '─────────────────────────────────────────────────────────\n';
    report += '                       SUMMARY                            \n';
    report += '─────────────────────────────────────────────────────────\n';
    report += `Total Tests:    ${this.results.summary.total}\n`;
    report += `✓ Passed:       ${this.results.summary.passed}\n`;
    report += `✗ Failed:       ${this.results.summary.failed}\n`;
    report += `⊘ Skipped:      ${this.results.summary.skipped}\n`;
    
    const passRate = this.results.summary.total > 0 
      ? ((this.results.summary.passed / this.results.summary.total) * 100).toFixed(2)
      : 0;
    report += `Pass Rate:      ${passRate}%\n\n`;

    // Category Details
    report += '═══════════════════════════════════════════════════════════\n';
    report += '                   TESTS BY CATEGORY                       \n';
    report += '═══════════════════════════════════════════════════════════\n\n';

    Object.keys(this.results.categories).forEach(category => {
      const cat = this.results.categories[category];
      report += `\n┌─ ${category.toUpperCase()} `;
      report += '─'.repeat(Math.max(0, 55 - category.length));
      report += '\n';
      report += `│ Total: ${cat.tests.length} | ✓ Passed: ${cat.passed} | ✗ Failed: ${cat.failed} | ⊘ Skipped: ${cat.skipped}\n`;
      report += '├' + '─'.repeat(59) + '\n';

      cat.tests.forEach((test, index) => {
        const statusIcon = test.status === 'passed' ? '✓' : test.status === 'failed' ? '✗' : '⊘';
        report += `│ ${statusIcon} ${test.name}\n`;
        report += `│   Duration: ${test.duration}ms\n`;
        if (test.error) {
          report += `│   Error: ${test.error}\n`;
        }
        if (index < cat.tests.length - 1) {
          report += '│\n';
        }
      });
      report += '└' + '─'.repeat(59) + '\n';
    });

    return report;
  }

  writeToFile() {
    const report = this.generateReport();
    fs.writeFileSync(this.logFile, report, 'utf8');
    console.log(`\n✓ Test report written to: ${this.logFile}\n`);
    return this.logFile;
  }

  getJSONReport() {
    return JSON.stringify(this.results, null, 2);
  }

  writeJSONReport() {
    const jsonFile = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(jsonFile, this.getJSONReport(), 'utf8');
    console.log(`✓ JSON report written to: ${jsonFile}`);
    return jsonFile;
  }

  generateMarkdownReport() {
    let md = '# Test Execution Report\n\n';
    md += `**Generated:** ${this.results.timestamp}\n\n`;
    md += '---\n\n';

    // Summary Section
    md += '## Summary\n\n';
    md += '| Metric | Count |\n';
    md += '|--------|-------|\n';
    md += `| Total Tests | ${this.results.summary.total} |\n`;
    md += `| ✅ Passed | ${this.results.summary.passed} |\n`;
    md += `| ❌ Failed | ${this.results.summary.failed} |\n`;
    md += `| ⊘ Skipped | ${this.results.summary.skipped} |\n`;
    
    const passRate = this.results.summary.total > 0 
      ? ((this.results.summary.passed / this.results.summary.total) * 100).toFixed(2)
      : 0;
    md += `| **Pass Rate** | **${passRate}%** |\n\n`;

    // Test Categories
    md += '---\n\n';
    md += '## Tests by Category\n\n';

    Object.keys(this.results.categories).forEach(category => {
      const cat = this.results.categories[category];
      md += `### ${category}\n\n`;
      md += `**Stats:** ${cat.tests.length} total | ✅ ${cat.passed} passed | ❌ ${cat.failed} failed | ⊘ ${cat.skipped} skipped\n\n`;

      if (cat.tests.length > 0) {
        md += '| Status | Test Name | Duration |\n';
        md += '|--------|-----------|----------|\n';
        
        cat.tests.forEach(test => {
          const statusIcon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⊘';
          const testName = test.name.replace(/\|/g, '\\|'); // Escape pipes in test names
          md += `| ${statusIcon} | ${testName} | ${test.duration}ms |\n`;
        });
        md += '\n';

        // Show errors for failed tests
        const failedTests = cat.tests.filter(t => t.status === 'failed');
        if (failedTests.length > 0) {
          md += '#### Failed Test Details\n\n';
          failedTests.forEach(test => {
            md += `**${test.name}**\n`;
            md += '```\n';
            md += test.error || 'No error details available';
            md += '\n```\n\n';
          });
        }
      }
    });

    // Footer
    md += '---\n\n';
    md += `*Report generated by TigerTix Test Logger at ${new Date().toLocaleString()}*\n`;

    return md;
  }

  writeMarkdownReport() {
    const mdReport = this.generateMarkdownReport();
    fs.writeFileSync(this.mdFile, mdReport, 'utf8');
    console.log(`✓ Markdown report written to: ${this.mdFile}`);
    return this.mdFile;
  }
}

module.exports = TestLogger;

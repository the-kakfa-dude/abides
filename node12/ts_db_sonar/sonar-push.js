const scanner = require("sonarqube-scanner");

scanner(
  {
    // this example uses local instance of SQ
    serverUrl: "http://localhost:9000/",
    options: {
      "sonar.projectVersion": "1.1.0",
      "sonar.sources": "src",
      "sonar.tests": "test, func",
      "sonar.exclusions": "src/migration/**",
      "sonar.typescript.lcov.reportPaths": "coverage/lcov.info",
      "sonar.testExecutionReportPaths": "test-report.xml"
    },
  },
  () => {
    console('Sonar data has been pushed.');
  }
);

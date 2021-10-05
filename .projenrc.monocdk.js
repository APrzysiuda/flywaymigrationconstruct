const { AwsCdkConstructLibrary, ProjectType, github, IgnoreFile } = require('projen');
const project = new AwsCdkConstructLibrary({
  author: 'APrzysiuda',
  authorAddress: '180517@umons.ac.be',
  cdkVersion: '1.119.0',
  defaultReleaseBranch: 'main',
  name: 'flywaymigrationconstruct',
  repositoryUrl: 'https://github.com/APrzysiuda/flywaymigrationconstruct.git',
  cdkAssert: true,
  cdkDependencies: ['@aws-cdk/core', '@aws-cdk/aws-lambda', '@aws-cdk/aws-ec2', '@aws-cdk/aws-s3', '@aws-cdk/aws-secretsmanager'],
  docgen: true,
  eslint: true,
  deps: ['monocdk'],
  releaseToNpm: true,
  keywords: ['cdk', 'flyway', 'DB'],
  releaseWorkflowSetupSteps:[
    { run: 'rm yarn.lock' },
    { run: 'rm .projenrc.js' },
    { run: 'mv .projenrc.monocdk.js .projenrc.js' },
    { run: "find ./src -type f | xargs sed -i  's,@aws-cdk/core,monocdk,g'" },
    { run: "find ./test -type f | xargs sed -i  's,@aws-cdk/core,monocdk,g'" },
    { run: "find ./src -type f | xargs sed -i  's,@aws-cdk,monocdk,g'" },
    { run: "find ./test -type f | xargs sed -i  's,@aws-cdk,monocdk,g'" },
    { run: "find ./test -type f | xargs sed -i  's,monocdk/assert,@monocdk-experiment/assert,g'" },
    { run : "npx projen"}],
  releaseWorkflow: true,
  publishToPypi: {
    distName: 'flywaymigrationconstruct',
    module: 'flywaymigrationconstruct',
  },
  releaseEveryCommit: true,
});

project.release.addJobs({
  upload: {
    needs: 'release',
    runsOn: 'ubuntu-latest',
    permissions: {
      contents: 'write',
      packages: 'write',
      actions: 'write',
    },
    if: 'needs.release.outputs.latest_commit == github.sha',
    steps: [
      {
        uses: 'actions/checkout@v2',
        name: 'checkout',
      },
      {
        name: 'Show GitHub ref',
        run: 'echo "$GITHUB_REF"',
      },
      {
        name: 'Get the version',
        id: 'get_version',
        run: 'echo ::set-output name=tag::${GITHUB_REF#refs/tags/}',
      },
      {
        run: 'cd ./flywayjar',
      },
      {
        uses: 'actions/checkout@v2',
        name: 'checkout2',
      },
      {
        'run': 'gradle build && gradle buildZip',
        'working-directory': './flywayjar',
      },
      {
        uses: 'actions/upload-artifact@v1',
        with: {
          name: 'upload change',
          path: './flywayjar',
        },
      },
      {
        name: 'donwload',
        uses: 'actions/download-artifact@v2',
        with: {
          name: 'dist',
          path: 'dist',
        },
      },
      {
        name: 'run upload !',
        run: 'export AWS_EC2_METADATA_DISABLED=true && mkdir ./temp && cp ./flywayjar/build/distributions/flywayjar-1.0.0.zip ./temp/flywayjar.$(cat dist/version.txt).zip && aws s3 sync ./temp/ s3://flywaymigrationconstruct',
        env: {
          AWS_ACCESS_KEY_ID: '${{secrets.AWS_ACCESS_KEY_ID}}',
          AWS_SECRET_ACCESS_KEY: '${{secrets.AWS_SECRET_ACCESS_KEY}}',
        },
      },
    ],
  },
});


project.gitignore.exclude('.idea/');
project.gitignore.exclude('flywayjar/build/');
project.addPackageIgnore('flywayjar/');
project.synth();
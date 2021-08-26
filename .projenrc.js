const { AwsCdkConstructLibrary, ProjectType, github, git, IgnoreFile } = require('projen');
const { workflows, GitHub, GithubWorkflow } = require('projen/lib/github');
const { Task } = require('projen/lib/tasks');
const project = new AwsCdkConstructLibrary({
  author: 'APrzysiuda',
  authorAddress: '180517@umons.ac.be',
  cdkVersion: '1.119.0',
  defaultReleaseBranch: 'main',
  name: 'flywaymigrationconstruct',
  repositoryUrl: 'https://github.com/APrzysiuda/flywaymigrationconstruct.git',
  projectType: ProjectType.LIB,
  cdkAssert: true,
  cdkDependencies: ['@aws-cdk/core', '@aws-cdk/aws-lambda', '@aws-cdk/aws-ec2', '@aws-cdk/aws-s3', '@aws-cdk/aws-secretsmanager'],
  docgen: true,
  eslint: true,
  releaseToNpm: true,
  releaseWorkflow: true,
  publishToPypi: {
    distName: 'flywaymigrationconstruct',
    module: 'construct',
  },
  releaseEveryCommit: true,
});


const task1= project.github.addWorkflow('taskUpload');
task1.on({
  push: {
    branches: 'main',
  },
  workflowDispatch: {},
});
task1.addJobs({
  upload: {
    runsOn: 'ubuntu-latest',
    permissions: {
      contents: 'write',
      packages: 'write',
      actions: 'write',
    },
    steps: [
      {
        uses: 'actions/checkout@v2',
        name: 'checkout',
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
        name: 'run upload !',
        run: 'export AWS_EC2_METADATA_DISABLED=true && mkdir ./temp && cp ./flywayjar/build/distributions/flywayjar-1.0.0.zip ./temp/flywayjar.0.1.0.zip && aws s3 sync ./temp/ s3://flywaymigrationconstruct',
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
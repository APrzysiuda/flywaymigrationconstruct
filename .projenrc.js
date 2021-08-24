const { AwsCdkConstructLibrary, ProjectType, github, git, IgnoreFile } = require('projen');
const { workflows, GitHub, GithubWorkflow } = require('projen/lib/github');
const { Task } = require('projen/lib/tasks');
const project = new AwsCdkConstructLibrary({
  author: 'APrzysiuda',
  authorAddress: '180517@umons.ac.be',
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  name: 'flywaymigrationconstruct',
  repositoryUrl: 'https://github.com/180517/flywaymigrationconstruct.git',
  projectType: ProjectType.LIB,
  cdkAssert: true,
  cdkDependencies: ['@aws-cdk/core', '@aws-cdk/aws-lambda', '@aws-cdk/aws-ec2', '@aws-cdk/aws-s3'],
  docgen: true,
  eslint: true,
  releaseToNpm: true,
  releaseWorkflow: true,
  publishToPypi: {
    distName: 'flywaymigrationconstruct',
    module: 'construct',
  },
  releaseEveryCommit: true,
  // cdkDependencies: undefined,        /* Which AWS CDK modules (those that start with "@aws-cdk/") does this library require when consumed? */
  // cdkTestDependencies: undefined,    /* AWS CDK modules required for testing. */
  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
});


//project.addTask('test1').exec('cd flywayjar && gradle build && gradle buildZip && cd .. && ' +
//'aws s3 cp flywayjar/build/distributions/flywayjar-1.0-SNAPSHOT.zip s3://flywaymigrationconstruct');
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
        uses: 'actions/setup-java@v2',
        with: {
          java:{
            version: '11',
          },
          distribution: 'adopt',
        },
      },
      {
        uses: 'gradle/wrapper-validation-action@e6e38bacfdf1a337459f332974bb2327a31aaf4b',
      },
      {
        run: './gradlew build && ./gradlew buildZip',
      },
      {
        name: 'run upload !',
        run: 'aws s3 sync flywayjar/build/distributions/flywayjar-1.0-SNAPSHOT.zip s3://flywaymigrationconstruct',
      },
    ],
  },
});

project.gitignore.include('flywayjar/');
project.addPackageIgnore('flywayjar/');
project.synth();
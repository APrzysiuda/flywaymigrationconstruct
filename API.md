# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### FlywayConstruct <a name="flywaymigrationconstruct.FlywayConstruct"></a>

#### Initializer <a name="flywaymigrationconstruct.FlywayConstruct.Initializer"></a>

```typescript
import { FlywayConstruct } from 'flywaymigrationconstruct'

new FlywayConstruct(scope: Construct, id: string, params: FlywayConstructParams)
```

##### `scope`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstruct.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstruct.parameter.id"></a>

- *Type:* `string`

---

##### `params`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstruct.parameter.params"></a>

- *Type:* [`flywaymigrationconstruct.FlywayConstructParams`](#flywaymigrationconstruct.FlywayConstructParams)

---



#### Properties <a name="Properties"></a>

##### `flywayLambdaMigration`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstruct.property.flywayLambdaMigration"></a>

- *Type:* [`@aws-cdk/aws-lambda.Function`](#@aws-cdk/aws-lambda.Function)

---

#### Constants <a name="Constants"></a>

##### `BUCKET_CODE_ARN` <a name="flywaymigrationconstruct.FlywayConstruct.property.BUCKET_CODE_ARN"></a>

- *Type:* `string`

---

##### `HANDLER` <a name="flywaymigrationconstruct.FlywayConstruct.property.HANDLER"></a>

- *Type:* `string`

---

##### `ID_LAMBDA_CODE` <a name="flywaymigrationconstruct.FlywayConstruct.property.ID_LAMBDA_CODE"></a>

- *Type:* `string`

---

##### `OBJECT_CODE_KEY` <a name="flywaymigrationconstruct.FlywayConstruct.property.OBJECT_CODE_KEY"></a>

- *Type:* `any`

---

## Structs <a name="Structs"></a>

### FlywayConstructParams <a name="flywaymigrationconstruct.FlywayConstructParams"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { FlywayConstructParams } from 'flywaymigrationconstruct'

const flywayConstructParams: FlywayConstructParams = { ... }
```

##### `bucketMigrationSQL`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.bucketMigrationSQL"></a>

- *Type:* [`@aws-cdk/aws-s3.IBucket`](#@aws-cdk/aws-s3.IBucket)

---

##### `migrationDBSecretManager`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.migrationDBSecretManager"></a>

- *Type:* [`@aws-cdk/aws-secretsmanager.ISecret`](#@aws-cdk/aws-secretsmanager.ISecret)

---

##### `memorySize`<sup>Optional</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.memorySize"></a>

- *Type:* `number`

---

##### `securityGroups`<sup>Optional</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.securityGroups"></a>

- *Type:* [`@aws-cdk/aws-ec2.ISecurityGroup`](#@aws-cdk/aws-ec2.ISecurityGroup)[]

---

##### `subnet`<sup>Optional</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.subnet"></a>

- *Type:* [`@aws-cdk/aws-ec2.SubnetSelection`](#@aws-cdk/aws-ec2.SubnetSelection)

---

##### `timeout`<sup>Optional</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.timeout"></a>

- *Type:* [`@aws-cdk/core.Duration`](#@aws-cdk/core.Duration)

---

##### `vpc`<sup>Optional</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.vpc"></a>

- *Type:* [`@aws-cdk/aws-ec2.IVpc`](#@aws-cdk/aws-ec2.IVpc)

---




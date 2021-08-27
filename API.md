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

##### `bucketCodeArn`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstruct.property.bucketCodeArn"></a>

- *Type:* `string`

---

##### `flywayLambdaMigration`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstruct.property.flywayLambdaMigration"></a>

- *Type:* [`@aws-cdk/aws-lambda.Function`](#@aws-cdk/aws-lambda.Function)

---

##### `handler`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstruct.property.handler"></a>

- *Type:* `string`

---

##### `idLambdaCode`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstruct.property.idLambdaCode"></a>

- *Type:* `string`

---

##### `objectCodeKey`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstruct.property.objectCodeKey"></a>

- *Type:* `string`

---


## Structs <a name="Structs"></a>

### FlywayConstructParams <a name="flywaymigrationconstruct.FlywayConstructParams"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { FlywayConstructParams } from 'flywaymigrationconstruct'

const flywayConstructParams: FlywayConstructParams = { ... }
```

##### `bucket`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.bucket"></a>

- *Type:* [`@aws-cdk/aws-s3.IBucket`](#@aws-cdk/aws-s3.IBucket)

---

##### `migrationBucketSecretArn`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.migrationBucketSecretArn"></a>

- *Type:* `string`

---

##### `securityGroups`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.securityGroups"></a>

- *Type:* `object`

---

##### `subnet`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.subnet"></a>

- *Type:* [`@aws-cdk/aws-ec2.SubnetSelection`](#@aws-cdk/aws-ec2.SubnetSelection)

---

##### `vpc`<sup>Required</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.vpc"></a>

- *Type:* [`@aws-cdk/aws-ec2.IVpc`](#@aws-cdk/aws-ec2.IVpc)

---

##### `memorySize`<sup>Optional</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.memorySize"></a>

- *Type:* `number`

---

##### `timeout`<sup>Optional</sup> <a name="flywaymigrationconstruct.FlywayConstructParams.property.timeout"></a>

- *Type:* [`@aws-cdk/core.Duration`](#@aws-cdk/core.Duration)

---




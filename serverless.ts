import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'ignite-node-challenge08-serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:*',
        ],
        Resource: [
          '*',
        ],
      },
    ],
  },
  functions: {
    createTodo: {
      handler: 'src/functions/createTodo.handler',
      events: [
        {
          http: {
            method: 'post',
            path: '/todos/{id}',
            cors: true,
          },
        },
      ],
    },
    getTodo: {
      handler: 'src/functions/getTodo.handler',
      events: [
        {
          http: {
            method: 'get',
            path: '/todos/{id}',
            cors: true,
          }
        }
      ],
    },
  },
  package: { individually: false },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      }
    }
  },
  resources: {
    Resources: {
      dbCertificateUsers: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "todos",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            },
            {
              AttributeName: "user_id",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            },
            {
              AttributeName: "user_id",
              KeyType: "RANGE"
            }
          ]
        },
      }
    }
  }
};

module.exports = serverlessConfiguration;

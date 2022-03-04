import { APIGatewayProxyHandler } from 'aws-lambda';
import { validate } from "uuid";

import { document } from '../utils/dynamodbClient';

interface IGetTodo {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id: user_id } = event.pathParameters;

  if (!validate(user_id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid user_id",
      }),
    };
  }

  const response = await document.scan({
    TableName: 'todos',
    FilterExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': user_id,
    },
  }).promise();

  const userTodo = response.Items as IGetTodo[];

  if (userTodo.length > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify(userTodo),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Todo doesn't exist",
      }),
    };
  }
}
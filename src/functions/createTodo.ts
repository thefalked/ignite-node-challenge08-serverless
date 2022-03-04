import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { v4 as uuidV4, validate } from "uuid";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  if (!validate(user_id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid user_id",
      }),
    };
  }

  const todo = {
    id: uuidV4(),
    user_id,
    title,
    done: false,
    deadline: new Date(deadline).toISOString(),
  }

  await document.put({
    TableName: "todos",
    Item: todo,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(todo, null, 2),
  };
};
type SuccessResponse<T> = {
  statusCode: number;
  body: T;
};

export type ErrorResponse = {
  statusCode: number;
  body: { message: string; code: string };
};

export type Response<T> = SuccessResponse<T> | ErrorResponse;

export function created<T>(response: T): SuccessResponse<T> {
  return {
    statusCode: 201,
    body: response
  };
}

export function success<T>(
  response: T | undefined = undefined
): SuccessResponse<T | undefined> {
  return {
    statusCode: 200,
    body: response
  };
}

export function notFound(message: string, code: string): ErrorResponse {
  return {
    statusCode: 404,
    body: {
      message,
      code
    }
  };
}

export function invalidRequest(message: string): ErrorResponse {
  return {
    statusCode: 400,
    body: {
      message: message,
      code: "INVALID_REQUEST"
    }
  };
}

export function conflict(message: string, code: string): ErrorResponse {
  return {
    statusCode: 409,
    body: {
      message,
      code
    }
  };
}

export function internalServerError(): ErrorResponse {
  return {
    statusCode: 500,
    body: { message: "Internal server error", code: "INTERNAL_SERVER_ERROR" }
  };
}

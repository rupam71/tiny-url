const response = (res: any, statusCode: number, message: string, result: any) => {
  return res.status(statusCode).send({
    statusCode,
    message,
    result,
  });
};

export default response;

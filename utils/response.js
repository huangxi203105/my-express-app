/**
 * 自定义404错误类
 *
 */
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}
function success(res, message, data, code = 200) {
  res.status(code).json({
    status: "success",
    message,
    data,
  });
}
function failure(res, error) {
  if (error.name === "SequelizeValidationError") {
    const errors = error.errors.map((e) => e.error);
    return res.status(400).json({
      status: "error",
      errors,
      message: "请求参数错误",
    });
  }
  if (error.name === "NotFoundError") {
    return res.status(404).json({
      status: "error",
      message: "资源不存在",
      errors: [error.message],
    });
  }
  res.status(500).json({
    status: "error",
    message: "服务器错误",
    errors: [error.message],
  });
}

module.exports = {
  NotFoundError,
  success,
  failure,
};

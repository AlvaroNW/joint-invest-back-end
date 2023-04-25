const errorHandler = (err, req, res, next) => {
  console.log(err);
  return res.status(400).json({ error: err.message });
};

export { errorHandler };

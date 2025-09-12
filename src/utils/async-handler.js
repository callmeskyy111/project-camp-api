// Wrapper f(x) , H.O.F () - Ni more try/catch

export function asyncHandler(requestHanlder) {
  return (req, res, next) => {
    Promise.resolve(requestHanlder(req, res, next))
      .catch((err) => next(err))
      .catch((err) => next(err));
  };
}

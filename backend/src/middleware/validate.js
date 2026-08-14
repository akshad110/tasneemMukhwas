export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req[source])
    if (!parsed.success) {
      return next(parsed.error)
    }
    req[source] = parsed.data
    next()
  }
}

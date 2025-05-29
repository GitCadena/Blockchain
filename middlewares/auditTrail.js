exports.logAuditTrail = (req, res, next) => {
    const log = {
      url: req.originalUrl,
      method: req.method,
      params: req.params,
      body: req.body,
      timestamp: new Date()
    };
  
    // Aquí guardaríamos el log en la base de datos o en la blockchain (próximos pasos)
  
    console.log('Audit log:', log);
    next();
  };
export const isAuthenticated = (req, res, next) => {
  if (!req.user)
    return (
      res.status(401).redirect("/api/users/login"),
      req.logger.error("Registrese para poder ingresar")
    );

  if (req.user.role === "Admin") {
    res.locals.isAdmin = true;
  } else if (req.user.role === "Premium") {
    res.locals.isPremium = true;
  } else {
    res.locals.isAdmin = false;
    res.locals.isPremium = false;
  }
  next();
};

export const authUser = (req, res, next) => {
  if (!req.user)
    return (
      res.status(401).redirect("/api/users/login"),
      req.logger.error("Registrese para poder ingresar")
    );
  if (req.user.role === "User") {
    req.logger.info("Tiene rol de usuario");
    res.locals.isAdmin = false;
    next();
  } else {
    req.logger.error(
      "solo los usuarios pueden ingresar a esta ruta. Registrate!"
    );
    return res.redirect("/api/products");
  }
};

export const authAdminOrUserPremium = (req, res, next) => {
  if (!req.user)
    return (
      res.status(401).redirect("/api/users/login"),
      req.logger.error("Registrese para poder ingresar")
    );
  if (req.user.role === "Admin") {
    req.logger.info("Usted es administrador");
    res.locals.isAdmin = true;
    next();
  } else if (req.user.role === "Premium") {
    req.logger.info("Eres usuario Premium");
    res.locals.isPremium = true;
    next();
  } else {
    req.logger.error("no tienes los permisos suficientes");
    return res.redirect("/api/products");
  }
};

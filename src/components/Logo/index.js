import React from "react";

import { Container } from "./styles";

function Logo({ ...rest }) {
  return (
    <Container
      source={require("../../global/images/logo.png")}
      {...rest}
      style={{ width: 137, height: 103 }}
    />
  );
}

export default Logo;

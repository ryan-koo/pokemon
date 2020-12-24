import React from "react";
import image from "./card.jpg";
import CardDetails from "./CardDetails";

const Card = () => {
  return (
    <React.Fragment>
      <img src={image} alt="logo" />
      <CardDetails />
    </React.Fragment>
  );
};

export default Card;

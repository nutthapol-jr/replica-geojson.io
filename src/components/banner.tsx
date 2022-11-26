import React from "react";
import { Card, Image } from "@nextui-org/react";

const Banner = () => {
  return (
    <Card
      isPressable
      isHoverable
      variant="bordered"
      onClick={() => window.open("https://2022.foss4g.in.th/", "_blank")}
      css={{
        position: "absolute",
        zIndex: 1,
        left: 8,
        bottom: 8,
        width: 180,
        bgBlur: "#0f111466",
      }}
    >
      <Card.Body css={{ padding: "8px !important" }}>
        <Image
          src="/images/Logo-FOSS4G-Thailand-2022.png"
          alt="logo-foss4g-thailand-2022"
        />
      </Card.Body>
    </Card>
  );
};

export default Banner;

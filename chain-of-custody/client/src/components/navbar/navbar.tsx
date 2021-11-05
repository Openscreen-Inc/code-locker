import React from "react";
import { Flex, Image } from "@chakra-ui/react";
import logo from "images/logo.png";
import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const Navbar = () => {
  return (
    <Flex
      as="nav"
      position="fixed"
      left="0"
      top="0"
      paddingX="20px"
      paddingTop="20px"
      bgColor="white"
      align="center"
      justify="space-between"
    >
      <Image width="70%" maxW="300px" src={logo} alt="test" />
      <IconButton
        display={{ base: "block", lg: "none" }}
        aria-label="Search database"
        icon={<HamburgerIcon />}
      />
    </Flex>
  );
};

export default Navbar;

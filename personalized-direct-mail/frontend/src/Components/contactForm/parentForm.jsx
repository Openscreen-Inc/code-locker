import React from "react";
import { useParams } from "react-router-dom";
import ChildContactForm from "./contactForm";
import axios from "axios";
import { Flex, Spinner, Center } from "@chakra-ui/react";
const ContactForm = () => {
  const { scanId } = useParams();
  const [defaultValues, setDefaultValues] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(`/scan/${scanId}`)
      .then((res) => {
        setDefaultValues(res.data.contact);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [scanId]);

  return (
    <>
      {defaultValues ? (
        <ChildContactForm defaultValues={defaultValues} />
      ) : (
        <Flex paddingX="50%" bgColor="gray.700" minH="100vh" minW="100vw">
          <Center>
            <Spinner color="white" size="xl" />
          </Center>
        </Flex>
      )}
    </>
  );
};

export default ContactForm;

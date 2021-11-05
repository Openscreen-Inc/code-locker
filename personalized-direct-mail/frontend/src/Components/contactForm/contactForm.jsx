import React from "react";
import {
  Box,
  Radio,
  Input,
  RadioGroup,
  Stack,
  Button,
  Heading,
  useToast,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FormControl, FormLabel } from "@chakra-ui/react";
const ChildContactForm = (props) => {
  const { defaultValues } = props;

  console.log(defaultValues);
  const toast = useToast();
  const [value, setValue] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      address: defaultValues.mailingAddress.address,
      provinceOrState: defaultValues.mailingAddress.provinceOrState,
      country: defaultValues.mailingAddress.country,
      postalOrZip: defaultValues.mailingAddress.postalOrZip,
    },
  });

  const submit = async (data) => {
    const val = JSON.parse(value);
    const formattedData = {
      address: data.address,
      provinceOrState: data.provinceOrState,
      country: data.country,
      postalOrZip: data.postalOrZip,
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: data.emailAddress,
      cellPhone: data.cellPhone,
      ...val,
    };
    try {
      await axios.post(
        `/update`,
        formattedData
      );
      toast({
        title: "Updated Contact",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      setSubmitted(true);
    } catch (error) {}
  };

  return (
    <Box w="100%" paddingY="30px" bgColor="gray.700">
      <Box
        display={submitted ? "none" : "block"}
        textColor="white"
        maxW="700px"
        marginBottom="60px"
        marginX="auto"
      >
        <form action="submit" onSubmit={handleSubmit(submit)}>
          <Heading marginBottom="30px">Real Estate Contact Form</Heading>
          <FormControl marginY="10px" id="First Name" isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              color="gray.300"
              // variant="..."
              borderColor="gray.300"
              border="1px"
              height="50px"
              {...register("firstName")}
              type="text"
              placeholder="First Name"
            />
          </FormControl>
          <FormControl marginY="10px" id="Last Name" isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              // variant="filled"
              color="gray.300"
              borderColor="gray.100"
              border="1px"
              height="50px"
              {...register("lastName")}
              type="text"
              placeholder="Last Name"
            />
          </FormControl>

          <FormControl marginY="10px" id="Email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              color="gray.300"
              borderColor="gray.300"
              border="1px"
              height="50px"
              {...register("emailAddress")}
              type="text"
              placeholder="Email"
            />
          </FormControl>

          <FormControl marginY="10px" id="address" isRequired>
            <FormLabel>Address</FormLabel>
            <Input
              // variant="filled"
              color="gray.300"
              borderColor="gray.300"
              border="1px"
              height="50px"
              isReadOnly
              {...register("address")}
              type="text"
              placeholder="Address"
            />
          </FormControl>

          <FormControl marginY="10px" id="provinceOrState" isRequired>
            <FormLabel>Province/State</FormLabel>
            <Input
              // variant="filled"
              isReadOnly
              color="gray.300"
              borderColor="gray.300"
              border="1px"
              height="50px"
              {...register("provinceOrState")}
              type="text"
              placeholder="Province or State"
            />
          </FormControl>

          <FormControl marginY="10px" id="provinceOrState" isRequired>
            <FormLabel>Postal Or Zip</FormLabel>
            <Input
              // variant="filled"
              isReadOnly
              color="gray.300"
              borderColor="gray.300"
              border="1px"
              height="50px"
              {...register("postalOrZip")}
              type="text"
              placeholder="Postal Or Zip"
            />
          </FormControl>

          <FormControl marginY="10px" id="country" isRequired>
            <FormLabel>Country</FormLabel>
            <Input
              // variant="filled"
              color="gray.300"
              isReadOnly
              borderColor="gray.300"
              border="1px"
              height="50px"
              {...register("country")}
              type="text"
              placeholder="Country"
            />
          </FormControl>

          <FormControl marginY="10px" id="Phone Number" isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input
              color="gray.300"
              borderColor="gray.300"
              border="1px"
              height="50px"
              {...register("cellPhone")}
              type="text"
              placeholder="Phone Number"
            />
          </FormControl>
          <RadioGroup onChange={setValue} value={value}>
            <Stack direction="row">
              <Radio value={JSON.stringify({ consent: true })}>Accepted</Radio>
              <Radio value={JSON.stringify({ consent: false })}>Revoked</Radio>
            </Stack>
          </RadioGroup>
          <Stack>
            <Button colorScheme="linkedin" marginY="10px" type="submit">
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
      <Box display={submitted ? "block" : "none"}>
        <Heading color="white">Thank You!</Heading>
        <Text color="white">Your data has been submitted</Text>
      </Box>
    </Box>
  );
};

export default ChildContactForm;

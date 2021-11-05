import React, { useEffect, useState } from "react";
import {
  Stack,
  Button,
  useToast,
  Select,
  Box,
  Text,
  Heading,
  Flex,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import axios from "axios";
import Option from "../option/option";
import { useWizard } from "react-use-wizard";

interface Field {
  owner: string;
  farmName: string;
  city: string;
  stateOrProvince: string;
  zipOrPostal: string;
  country: string;
  coordinates: [number, number];
  plantingCrop: string;
}

interface NewInfo {
  sampleDate?: string;
  collector?: string;
  fieldData: Field;
}

interface ObservationProps {
  bag: any;
  submittedInfo?: NewInfo;
  setLabAddress: (lab: string) => void;
  lab?: any;
  submitted: boolean;
  setSubmitted: () => void;
}

const url = process.env.REACT_APP_API_ENDPOINT;

const PostObservation = ({
  bag,
  setLabAddress,
  lab,
  setSubmitted,
  submitted,
}: ObservationProps) => {
  const toast = useToast();
  const { register, handleSubmit } = useForm({
    reValidateMode: "onChange",
  });

  const { assetCollector } = bag?.customAttributes;
  const { assetField } = bag?.customAttributes;
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [labs, setLabs] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { nextStep } = useWizard();
  const { isOpen, onToggle } = useDisclosure();
  const { notes } = bag?.customAttributes;
  const { assetAcres } = bag?.customAttributes;
  const { scanId } = useParams<Record<string, string | undefined>>();

  const getLabs = () => {
    setLoadingLabs(true);
    axios
      .get(`${url}/contacts/labtech`)
      .then((res) => {
        setLoadingLabs(false);
        setLabs(res.data.filtered);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getLabs();
  }, []);

  const submit = async (data: any) => {
    setLoading(true);
    setSubmitted();
    const labObject = JSON.parse(data.lab);
    setLabAddress(labObject);
    try {
      await axios.patch(`${url}/asset/${bag.assetId}`, {
        submittedLab: labObject,
        state: "submitted to lab",
      });
      await axios.post(`${url}/sendSms`, {
        to: labObject.phoneNumber,
        smsTemplateName: "dataSubmitted",
        scanId
      });
      await axios.post(`${url}/sendSms`, {
        to: bag.customAttributes.assetCollector.phoneNumber,
        smsTemplateName: "dataSubmitted",
        scanId
      });
      toast({
        title: "Lab notified.",
        description: "We've submitted your data and notified .",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      nextStep();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box width="100%">
      <Stack padding="15px" align="flex-start" spacing={1}>
        <Heading fontSize="13pt">Date and Time:</Heading>
        <Text>{bag?.customAttributes.date}</Text>
      </Stack>

      <Stack padding="15px" align="flex-start" spacing={1}>
        <Heading fontSize="13pt">Collector:</Heading>
        <Text>{`${assetCollector.firstName} ${assetCollector.lastName}, ${
          assetCollector.customAttributes.companyName || "Not Available"
        }`}</Text>
      </Stack>

      <Stack padding="15px" align="flex-start" spacing={1}>
        <Heading fontSize="13pt">Field Name:</Heading>
        <Text>{`${assetField?.firstName} ${assetField?.lastName}`}</Text>
        <Text>{assetField.customAttributes.companyName}</Text>
        <Text>
          {assetField.city}, {assetField.provinceOrState}
        </Text>
        <Text>{assetField.zipOrPostal}</Text>
      </Stack>

      <Stack padding="15px" align="flex-start" spacing={1}>
        <Heading fontSize="13pt">Location:</Heading>
        <Text>{bag?.customAttributes.location}</Text>
      </Stack>

      <Stack padding="15px" align="flex-start" spacing={1}>
        <Heading fontSize="13pt">Planting Crop:</Heading>
        <Text>{bag?.customAttributes.assetPlantingCrop}</Text>
      </Stack>

      <Flex
        width="100%"
        padding="15px"
        align="baseline"
        justify="space-between"
        spacing={4}
      >
        <Stack>
          <Heading fontSize="13pt">Observations</Heading>
          <Collapse in={!isOpen}>
            <Stack>
              <Text fontSize="13pt">Acres: {assetAcres}</Text>
              <Text fontSize="13pt">Notes:</Text>
              <Text fontSize="13pt">{notes}</Text>
            </Stack>
          </Collapse>
        </Stack>
        <Button onClick={onToggle} bgColor="#B4C7E7" color="gray.700">
          {!isOpen ? "Hide" : "View"}
        </Button>
      </Flex>
      <form action="submit" onSubmit={handleSubmit(submit)}>
        <Flex
          width="100%"
          padding="15px"
          align="end"
          justify="space-between"
          spacing={4}
        >
          <Stack textAlign="start">
            <Heading fontSize="13pt">Testing Lab</Heading>
            <Text fontSize="13pt">{lab?.customAttributes.companyName}</Text>
            <Text fontSize="13pt">{lab?.address}</Text>
            <Text fontSize="13pt">
              {lab?.city} {lab?.provinceOrState}
            </Text>
            <Text fontSize="13pt">{lab?.postalOrZip}</Text>
            <Select
              variant="filled"
              display={submitted ? "none" : "block"}
              placeholder={loadingLabs ? "Loading..." : "Select A Lab"}
              {...register("lab")}
              isRequired
            >
              {labs.map((e: any, i: number) => (
                <Option
                  key={i}
                  value={{ ...e }}
                >{`${e.customAttributes.companyName}`}</Option>
              ))}
            </Select>
          </Stack>
          <Button
            bgColor="#B4C7E7"
            disabled={loadingLabs}
            display={submitted ? "none" : "block"}
            color="gray.700"
            isLoading={loading}
            type={submitted ? "button" : "submit"}
          >
            {submitted ? "Confirm" : "Submit"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default PostObservation;

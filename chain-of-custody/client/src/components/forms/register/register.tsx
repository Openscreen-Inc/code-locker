import React, { useEffect, useState } from "react";
import {
  Input,
  Stack,
  InputGroup,
  Textarea,
  Button,
  useToast,
  Select,
  FormLabel,
  Center,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import axios from "axios";
import Option from "components/forms/option/option";
import { useWizard } from "react-use-wizard";

const url = process.env.REACT_APP_API_ENDPOINT;

interface RegisterProps {
  bag: any;
  setBag: (bag: any) => void;
}

interface formProps {
  notes: string;
  assetCollector: string;
  assetLocation: string;
  assetField: string;
  assetAcres: string;
  assetPlantingCrop: string;
}

const Register = ({ bag, setBag }: RegisterProps) => {
  const { nextStep } = useWizard();
  const toast = useToast();

  const [loadingCollectors, setLoadingCollectors] = useState(false);
  const [loadingFarms, setLoadingFarms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collectors, setCollectors] = useState<any>([]);
  const [farms, setFarms] = useState<any>([]);
  const [location, setLocation] = useState<string>("");
  const { scanId } = useParams<Record<string, string | undefined>>();

  const { register, handleSubmit } = useForm<formProps>({
    reValidateMode: "onChange",
  });

  const getCollectors = () => {
    setLoadingCollectors(true);
    axios
      .get(`${url}/contacts/agronomist`)
      .then((res) => {
        setLoadingCollectors(false);
        setCollectors(res.data.filtered);
      })
      .catch((err) => {
        setLoadingCollectors(false);
        console.log(err);
      });
  };

  const getFarms = async () => {
    setLoadingFarms(true);
    axios
      .get(`${url}/contacts/farmer`)
      .then((res) => {
        setFarms(res.data.filtered);
        setLoadingFarms(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingFarms(false);
        toast({
          title: "Error getting Farms!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(
          `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(
            3
          )}`
        );
      });
    }
  }

  useEffect(() => {
    getCollectors();
    getFarms();
    getLocation();
  }, []);

  const onSubmit = async (data: formProps) => {
    setLoading(true);
    const fixedData: any = { ...data };
    fixedData.assetCollector = JSON.parse(data.assetCollector);
    fixedData.assetField = JSON.parse(data.assetField);
    let today: Date | string = new Date();
    const formattedDate = today.toUTCString();
    const newBag = bag.asset;
    newBag.customAttributes = {
      ...fixedData,
      location,
      date: formattedDate,
      state: "observed",
    };
    setBag(newBag);
    try {
      await axios.patch(`${url}/asset/${bag.asset.assetId}`, {
        ...fixedData,
        location,
        date: formattedDate,
        state: "observed",
      });
      await axios.post(`${url}/sendSms`, {
        to: fixedData.assetField.phoneNumber,
        smsTemplateName: "fieldDataSubmitted",
        scanId
      });
      await axios.post(`${url}/sendSms`, {
        to: fixedData.assetCollector.phoneNumber,
        smsTemplateName: "fieldDataSubmitted",
        scanId
      });
      toast({
        title: "Thank you!",
        description:
          "Your data has been submitted to the Deveron Cloud, the farmer has been notified of this",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      nextStep();
    } catch (error) {
      toast({
        title: "Error submitting data!",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center direction="column" width="100%" margin="auto">
        <Stack spacing={4} maxW="500px" w="100%" padding="20px">
          <FormLabel>Collector</FormLabel>
          <InputGroup>
            <Select
              placeholder={
                loadingCollectors ? "Loading..." : "Select Collector"
              }
              variant="filled"
              {...register("assetCollector")}
              isRequired
            >
              {collectors.map((e: any, i: number) => (
                <Option
                  key={i}
                  value={e}
                >{`${e.firstName} ${e.lastName}`}</Option>
              ))}
            </Select>
          </InputGroup>

          <FormLabel>Location</FormLabel>
          <InputGroup marginRight="10px">
            <Input
              bgColor="white"
              {...register("assetLocation")}
              placeholder=""
              value={location}
            />
          </InputGroup>

          <FormLabel>Notes</FormLabel>
          <InputGroup>
            <Textarea
              resize="vertical"
              size="md"
              bgColor="white"
              {...register("notes")}
              placeholder=""
            />
          </InputGroup>

          <FormLabel>Farm Name</FormLabel>
          <InputGroup>
            <Select
              placeholder={loadingFarms ? "Loading..." : "Select Farmer"}
              variant="filled"
              {...register("assetField")}
              isRequired
            >
              {farms.map((e: any, i: number) => (
                <Option
                  key={i}
                  value={e}
                >{`${e.customAttributes.companyName}`}</Option>
              ))}
            </Select>
          </InputGroup>

          <FormLabel>Acres</FormLabel>
          <InputGroup>
            <Input bgColor="white" {...register("assetAcres")} />
          </InputGroup>

          <FormLabel>Planting Crop</FormLabel>
          <InputGroup>
            <Select
              variant="filled"
              {...register("assetPlantingCrop")}
              placeholder="Select A Crop"
              isRequired
            >
              <option value="Apple">Apple</option>
              <option value="Corn">Corn</option>
              <option value="Cucumber">Cucumber</option>
              <option value="Lavender">Lavender</option>
              <option value="Strawberries">Strawberries</option>
              <option value="Wheat">Wheat</option>
            </Select>
          </InputGroup>
          <Button
            disabled={loadingCollectors || loadingFarms}
            isLoading={loading}
            type="submit"
            bgColor="#B4C7E7"
            color="gray.700"
          >
            Submit
          </Button>
        </Stack>
      </Center>
    </form>
  );
};

export default Register;

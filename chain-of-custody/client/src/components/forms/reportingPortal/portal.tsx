import {
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Input,
  Table,
  Box,
  Flex,
  Button,
  FormLabel,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";

import React, { useState } from "react";

const url = process.env.REACT_APP_API_ENDPOINT;

const Portal = () => {
  const [loading, setLoading] = useState(false);
  const [batchAssets, setBatchAssets] = useState<any>([]);
  const { register, handleSubmit } = useForm({
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/batch/${data.search.toUpperCase()}`);
      setBatchAssets(res.data.filtered);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Box marginX="20px" marginTop="100px">
      <title>Reporting Portal</title>
      <form action="submit" onSubmit={handleSubmit(onSubmit)}>
        <Flex margin="20px" justify="space-between" maxW="550px" align="center">
          <FormLabel>Enter a Batch ID:</FormLabel>
          <Input
            {...register("search")}
            maxW="300px"
            variant="outline"
            placeholder="Batch"
          />
          <Button
            isLoading={loading}
            bgColor="#B4C7E7"
            color="gray.700"
            type="submit"
          >
            Search
          </Button>
        </Flex>
      </form>
      <Table variant="simple" colorScheme="gray">
        <Thead bgColor="gray.300" height="60px">
          <Tr>
            <Th color="gray.900">Batch</Th>
            <Th color="gray.900">Bag</Th>
            <Th color="gray.900">Collector</Th>
            <Th color="gray.900">Acres</Th>
            <Th color="gray.900">Location</Th>
            <Th color="gray.900">Last Updated</Th>
            <Th color="gray.900">Field Notes</Th>
            <Th color="gray.900">Testing Lab</Th>
            <Th color="gray.900">Carbon Validator</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Center w="100vw" h="100vh">
              <Spinner size="xl" color="blue" />
            </Center>
          ) : (
            batchAssets.map((e: any, i: any) => {
              return (
                <Tr>
                  <Td key={i}>{e.customAttributes?.batchId}</Td>
                  <Td key={i}>{e.customAttributes?.soilSampleId}</Td>
                  <Td key={i}>
                    {e.customAttributes.assetCollector?.firstName}{" "}
                    {e.customAttributes.assetCollector?.lastName}
                  </Td>
                  <Td key={i}>{e.customAttributes?.assetAcres}</Td>
                  <Td key={i}>{e.customAttributes?.location}</Td>
                  <Td key={i}>{e?.modified}</Td>
                  <Td key={i}>{e.customAttributes?.notes}</Td>
                  <Td key={i}>
                    {
                      e.customAttributes?.submittedLab?.customAttributes
                        ?.companyName
                    }
                  </Td>
                  <Td key={i}>
                    {
                      e.customAttributes?.carbonValidator?.customAttributes
                        ?.companyName
                    }
                  </Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Portal;

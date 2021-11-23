import React, {useEffect, useState} from 'react'
import {Stack, Button, useToast, Select, Box, Text, Heading, Flex, useDisclosure, Collapse} from '@chakra-ui/react'

import {useForm} from 'react-hook-form'
import {useParams} from 'react-router'
import axios from 'axios'
import Option from '../option/option'
import {useWizard} from 'react-use-wizard'

interface Field {
  owner: string
  farmName: string
  city: string
  stateOrProvince: string
  zipOrPostal: string
  country: string
  coordinates: [number, number]
  plantingCrop: string
}

interface NewInfo {
  sampleDate?: string
  collector?: string
  fieldData: Field
}

interface ObservationProps {
  bag?: any
  submittedInfo?: NewInfo
  lab?: any
  submitted: any
  setSubmitted: any
  setCarbonValidator: (lab: string) => void
  carbonValidator: any
}

const url = process.env.REACT_APP_API_ENDPOINT

const CarbonValidationForm = ({
  bag,
  submitted,
  setSubmitted,
  setCarbonValidator,
  carbonValidator,
}: ObservationProps) => {
  const [loadingValidators, setLoadingValidators] = useState(false)
  const [validators, setValidators] = useState<any>([])
  const {register, handleSubmit} = useForm({
    reValidateMode: 'onChange',
  })

  const {scanId} = useParams<Record<string, string | undefined>>()

  const {isOpen, onToggle} = useDisclosure()
  const labTest = useDisclosure()

  const toast = useToast()

  const [loading, setLoading] = useState(false)

  const {nextStep} = useWizard()
  const {assetCollector} = bag?.asset.customAttributes
  const {assetField} = bag?.asset.customAttributes
  const {submittedLab} = bag?.asset.customAttributes
  const {notes} = bag?.asset.customAttributes
  const {location} = bag?.asset.customAttributes
  const {assetAcres} = bag?.asset.customAttributes

  console.log(bag.asset.customAttributes.date)

  const getValidators = () => {
    setLoadingValidators(true)
    axios
      .get(`${url}/contacts/validator`)
      .then((res) => {
        setLoadingValidators(false)
        setValidators(res.data.filtered)
      })
      .catch((err) => {
        setLoadingValidators(false)
        console.log(err)
      })
  }

  useEffect(() => {
    getValidators()
  }, [])

  const submit = async (data: any) => {
    setLoading(true)
    const labObject: any = JSON.parse(data.lab)
    setCarbonValidator(labObject)
    try {
      await axios.patch(`${url}/asset/${bag.asset.assetId}`, {
        carbonValidator: labObject,
        state: 'completed',
      })
      await axios.post(`${url}/sendSms`, {
        to: labObject.phoneNumber,
        smsTemplateName: 'validationComplete',
        scanId,
      })
      await axios.post(`${url}/sendSms`, {
        to: bag.asset.customAttributes.assetCollector.phoneNumber,
        smsTemplateName: 'validationComplete',
        scanId,
      })
      toast({
        title: 'Carbon Data Submitted.',
        description: "We've submitted your data and notified all parties.",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      nextStep()
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error!',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      setLoading(false)
    }
    setSubmitted(true)
  }

  return (
    <Box width="100%">
      <Stack padding="15px" align="flex-start" spacing={1}>
        <Heading fontSize="13pt">Sample Date:</Heading>
        <Text>{bag.asset.customAttributes.date}</Text>
      </Stack>

      <Stack padding="15px" align="flex-start" spacing={1}>
        <Heading fontSize="13pt">Collector:</Heading>
        <Text>{`${assetCollector.firstName} ${assetCollector.lastName}, ${
          assetCollector.customAttributes.companyName || 'Not Available'
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
        <Text>{location}</Text>
      </Stack>

      <Stack padding="15px" align="flex-start" spacing={1}>
        <Heading fontSize="13pt">Planting Crop:</Heading>
        <Text>{bag.asset.customAttributes.assetPlantingCrop}</Text>
      </Stack>

      <Flex width="100%" padding="15px" align="baseline" justify="space-between" spacing={4}>
        <Stack>
          <Heading fontSize="13pt">Observations</Heading>
          <Collapse in={isOpen}>
            <Stack>
              <Text fontSize="13pt">Acres: {assetAcres}</Text>
              <Text fontSize="13pt">Notes:</Text>
              <Text fontSize="13pt">{notes}</Text>
            </Stack>
          </Collapse>
        </Stack>
        <Button onClick={onToggle} bgColor="#B4C7E7" color="gray.700">
          {isOpen ? 'Hide' : 'View'}
        </Button>
      </Flex>

      <Flex width="100%" padding="15px" align="baseline" justify="space-between" spacing={1}>
        <Flex>
          <Stack>
            <Heading fontSize="13pt">Testing Lab</Heading>
            <Collapse in={labTest.isOpen}>
              <Text fontSize="13pt">{submittedLab.customAttributes.companyName}</Text>
              <Text fontSize="13pt">{submittedLab.address}</Text>
              <Text fontSize="13pt">
                {submittedLab.city}, {submittedLab.provinceOrState}
              </Text>
              <Text fontSize="13pt">{submittedLab.postalOrZip}</Text>
            </Collapse>
          </Stack>
        </Flex>
        <Button onClick={labTest.onToggle} bgColor="#B4C7E7" color="gray.700">
          {labTest.isOpen ? 'Hide' : 'View'}
        </Button>
      </Flex>

      <form action="submit" onSubmit={handleSubmit(submit)}>
        <Flex width="100%" padding="15px" align="end" justify="space-between" spacing={4}>
          <Stack textAlign="start">
            <Heading fontSize="13pt">Carbon Validator</Heading>
            <Select
              display={submitted ? 'none' : 'block'}
              disabled={loadingValidators}
              variant="filled"
              placeholder={loadingValidators ? 'Loading...' : 'Select A Validator'}
              {...register('lab')}
              isRequired
            >
              {validators.map((e: any, i: number) => (
                <Option key={i} value={e}>{`${e.customAttributes.companyName}`}</Option>
              ))}
            </Select>
            <Stack display={submitted ? 'block' : 'none'}>
              <Text fontSize="13pt">{carbonValidator?.customAttributes.companyName}</Text>
              <Text fontSize="13pt">{carbonValidator?.address}</Text>
              <Text fontSize="13pt">
                {carbonValidator?.city}, {carbonValidator?.provinceOrState}
              </Text>
              <Text fontSize="13pt">{carbonValidator?.postalOrZip}</Text>
            </Stack>
          </Stack>
          <Button
            bgColor="#B4C7E7"
            disabled={loadingValidators || submitted}
            display={submitted ? 'none' : 'block'}
            color="gray.700"
            isLoading={loading}
            type={submitted ? 'button' : 'submit'}
          >
            {submitted ? '' : 'Submit'}
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default CarbonValidationForm

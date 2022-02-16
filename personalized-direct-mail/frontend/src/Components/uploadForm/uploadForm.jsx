import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Button, Heading, Text, Flex, useToast } from "@chakra-ui/react";
import axios from "axios";

const UploadForm = () => {
  const [csv, setCsv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [zippedFileReceived, setZippedFileReceived] = useState(false);
  const [resObject, setResObject] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (resObject) {
      const filename = resObject.headers['content-disposition']
        .split(';')
        .find((n) => n.includes('filename='))
        .replace('filename=', '')
        .slice(2, -1)
        .trim();

      const blob = resObject.data
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.setAttribute('href', url);
      a.setAttribute('download', filename); // desired filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setZippedFileReceived(true);
    }
  }, [resObject])

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("csv", csv);
    setLoading(true);
    try {
      setSubmitted(true)
      const config = {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/zip',
        },
      }
      const res = await axios.post(
        `/uploads`,
        formData,
        config
      );
      setResObject(res);
      toast({
        title: "QR Codes generated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setCsv(acceptedFiles[0]);
  }, []);

  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "75px",
    minHeight: "150px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#2196f3",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const activeStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDragActive, isDragReject, isDragAccept]
  );

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Box maxW='1200px' margin='auto'>
      <Box margin='auto' maxW='1000px'>
        <Heading marginTop='10px' marginBottom='40px' color='black'>
          Direct Mail App
        </Heading>
        <Text>Upload CSV File</Text>
        <form action='submit' onSubmit={onSubmit}>
          <div className='dragndrop' {...getRootProps({ style })}>
            <input name='csv' {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <>
                <p>Drag 'n' drop some files here, or click to select files</p>
                <em>(Only *.csv files will be accepted)</em>
              </>
            )}
          </div>
          <aside>
            <h4>Your uploaded files</h4>
            <ul>{acceptedFileItems}</ul>
          </aside>
          <Flex align='center'>
            <Button isLoading={loading} marginY='10px' type='submit'>
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default UploadForm;

import React, { FC, Fragment, useCallback, useState } from "react";
import { Map } from "mapbox-gl";
import { Badge, Button, Modal, Text } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import gjv from "geojson-validation";
import byteSize from "byte-size";
import { FaPlus, FaMinus, FaUpload, FaFileDownload } from "react-icons/fa";
import { FeatureCollection } from "geojson";

const CommonControl: FC<{ map?: Map; setgeojson: Function }> = ({
  map,
  setgeojson,
}) => {
  const [modalShow, setmodalShow] = useState<boolean>(false);
  const [fileData, setfileData] = useState<null | {
    file: File;
    json: FeatureCollection | null;
    help: string;
  }>(null);

  const onDrop = useCallback((acceptedFiles: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      const result: any = JSON.parse(e.target?.result as any);
      if (gjv.valid(result)) {
        setfileData({
          file: acceptedFiles[0],
          json: result,
          help: "Already for upload",
        });
      } else {
        setfileData({
          file: acceptedFiles[0],
          json: null,
          help: "Invalid GeoJSON",
        });
      }
    });
    reader.readAsText(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/json": [".geojson"] },
    maxFiles: 1,
  });

  const onUploadFile = () => {
    const draw = (map as any)._controls.find((c: any) => c.modes);
    draw.set(fileData?.json);
    setmodalShow(false);
    setfileData((f) => {
      setgeojson(fileData?.json);
      return null;
    });
  };

  const onDownloadGeojson = () => {
    const draw = (map as any)._controls.find((c: any) => c.modes);
    const geojson = draw.getAll();
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(geojson));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `my-geojson.geojson`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const onCloseModal = () => {
    setfileData(null);
    setmodalShow(false);
  };

  return (
    <Fragment>
      <Button.Group
        size="md"
        vertical
        color="gradient"
        bordered
        css={{ position: "absolute", zIndex: 1, left: 8, top: 8 }}
      >
        <Button onClick={() => map?.zoomIn()}>
          <FaPlus />
        </Button>
        <Button onClick={() => map?.zoomOut()}>
          <FaMinus />
        </Button>
      </Button.Group>
      <Button
        size="sm"
        auto
        shadow
        css={{ position: "absolute", zIndex: 1, left: 12, top: 108 }}
        onClick={() => setmodalShow(true)}
      >
        <FaUpload />
      </Button>
      <Button
        size="sm"
        color={"success"}
        auto
        shadow
        css={{ position: "absolute", zIndex: 1, left: 12, top: 150 }}
        onClick={onDownloadGeojson}
      >
        <FaFileDownload />
      </Button>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={modalShow}
        onClose={onCloseModal}
      >
        <Modal.Header>
          <Text b size={18}>
            Upload your GeoJSON
          </Text>
        </Modal.Header>
        <Modal.Body>
          <section className="container">
            <div
              {...getRootProps({ className: "dropzone" })}
              style={{
                border: "dashed",
                borderRadius: 8,
                padding: 8,
                display: "flex",
                alignItems: "center",
                height: 120,
              }}
            >
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            {fileData && (
              <Badge
                enableShadow
                disableOutline
                color="success"
                style={{ marginTop: 8 }}
              >
                {`${fileData.file.name}, ${byteSize(fileData.file.size)}`}
              </Badge>
            )}
          </section>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={onCloseModal}>
            Cancel
          </Button>
          <Button auto onClick={onUploadFile}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default CommonControl;

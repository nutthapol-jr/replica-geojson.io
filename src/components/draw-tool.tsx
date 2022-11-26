import React, { FC } from "react";
import { Map } from "mapbox-gl";
import { Button, Grid, Popover, Tooltip } from "@nextui-org/react";
import { FaMapMarkerAlt, FaTrashAlt } from "react-icons/fa";
import { IoAnalyticsSharp } from "react-icons/io5";
import { RiShapeFill } from "react-icons/ri";
import { MdDelete, MdDeleteSweep } from "react-icons/md";
import { Feature } from "geojson";

const DrawTool: FC<{ map?: Map; setgeojson: Function }> = ({
  map,
  setgeojson,
}) => {
  const handleDrawTool = (mode: string) => () => {
    const draw = (map as any)._controls.find((c: any) => c.modes);
    draw.changeMode(mode);
  };

  const onDeleteAll = () => {
    const draw = (map as any)._controls.find((c: any) => c.modes);
    draw.deleteAll();
    setgeojson({ type: "FeatureCollection", features: [] });
  };

  const onDeleteSelected = () => {
    const draw = (map as any)._controls.find((c: any) => c.modes);
    const selectedFeatures = draw.getSelected();
    setgeojson(
      draw.delete(selectedFeatures.features.map((f: any) => f.id)).getAll()
    );
  };

  return (
    <Button.Group
      size="sm"
      vertical
      color="gradient"
      bordered
      css={{ position: "absolute", zIndex: 1, right: 8, top: 8 }}
    >
      <Button onClick={handleDrawTool("draw_point")}>
        <FaMapMarkerAlt />
      </Button>
      <Button onClick={handleDrawTool("draw_line_string")}>
        <IoAnalyticsSharp size={18} />
      </Button>
      <Button onClick={handleDrawTool("draw_polygon")}>
        <RiShapeFill size={18} />
      </Button>
      <Popover disableShadow placement="left">
        <Popover.Trigger>
          <Button>
            <FaTrashAlt />
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <Grid.Container gap={0.5} css={{ width: 96 }}>
            <Grid>
              <Tooltip content="Delete Seleted" placement="bottom">
                <Button onClick={onDeleteSelected} rounded>
                  <MdDelete />
                </Button>
              </Tooltip>
            </Grid>
            <Grid>
              <Tooltip content="Delete All" placement="bottom">
                <Button onClick={onDeleteAll} rounded>
                  <MdDeleteSweep />
                </Button>
              </Tooltip>
            </Grid>
          </Grid.Container>
        </Popover.Content>
      </Popover>
    </Button.Group>
  );
};

export default DrawTool;

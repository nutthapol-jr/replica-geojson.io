import React, { FC, useEffect, useState } from "react";
import { Map } from "mapbox-gl";
import { Avatar, Grid } from "@nextui-org/react";

interface basemap {
  id: "dark" | "hillshade";
  image: string;
  url: string;
}

const basemapList: basemap[] = [
  {
    id: "dark",
    image: "/images/dark-matter.png",
    url: "https://cloud.vallarismaps.com/core/api/styles/1.0-beta/styles/637d90c37097ddd6be5e1383?api_key=Kpd3mZgizcJWSceiU4Bec8JXIP407fJ4Bu3nJ7HbZRjLz80NZIe850yeSPPre6LS",
  },
  {
    id: "hillshade",
    image: "/images/hillshade.png",
    url: "https://cloud.vallarismaps.com/core/api/styles/1.0-beta/styles/637d974ab85ccd7ce13c74a3?api_key=Kpd3mZgizcJWSceiU4Bec8JXIP407fJ4Bu3nJ7HbZRjLz80NZIe850yeSPPre6LS",
  },
];

const Basemap: FC<{ map?: Map }> = ({ map }) => {
  const [styleActive, setstyleActive] = useState<basemap["id"]>("dark");

  const handleBasemap = (newBasemap: basemap["id"]) => () => {
    setstyleActive(newBasemap);
  };

  useEffect(() => {
    const abortControl = new AbortController();
    const selectedBasemap = basemapList.find((bm) => bm.id === styleActive);
    map?.getStyle();
    selectedBasemap &&
      fetch(selectedBasemap?.url, { signal: abortControl.signal })
        .then((rs) => rs.json())
        .then((rs) => {
          const hasHillshade = Boolean(map?.getStyle()?.sources.hillshade);
          if (!hasHillshade && selectedBasemap.id === "hillshade") {
            const { id, ...hillshadeProp } = rs.sources.hillshade;
            map?.addSource(id, hillshadeProp);
          }
          map
            ?.getStyle()
            .layers.map(
              (layer: any) =>
                (layer.type === "background" ||
                  layer.source === "osm" ||
                  layer.source === "hillshade") &&
                map?.removeLayer(layer.id)
            );
          rs.layers.map((layer: any) =>
            map?.addLayer(layer, "gl-draw-polygon-fill-inactive.cold")
          );
        });

    return () => {
      abortControl.abort();
    };
  }, [styleActive]);

  return (
    <Grid.Container
      gap={1}
      css={{ position: "absolute", zIndex: 1, left: 210, bottom: 8 }}
    >
      <Grid xs={12}>
        <Avatar.Group>
          {basemapList.map((bm) => (
            <Avatar
              key={bm.id}
              squared
              size={"xl"}
              pointer
              src={bm.image}
              bordered
              color={styleActive === bm.id ? "gradient" : "default"}
              onClick={handleBasemap(bm.id)}
            />
          ))}
        </Avatar.Group>
      </Grid>
    </Grid.Container>
  );
};

export default Basemap;

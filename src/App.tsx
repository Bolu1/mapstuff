/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {
  Fragment,
  LegacyRef,
  useCallback,
  useRef,
  useState,
  createRef,
  ReactElement,
} from "react";
import { GoogleMap, Polyline, useLoadScript } from "@react-google-maps/api";
import FunctionModal from "./Pages/FunctionModal";
import * as htmlToImage from "html-to-image";

const createFileName = (extension = "", ...names: any[]) => {
  if (!extension) {
    return "";
  }

  return `${names.join("")}.${extension}`;
};

const App = (): ReactElement => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const [centerLat, setCenterLat] = useState(51.999889);
  const [centerLng, setCenterLng] = useState(-0.98807);
  const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [mapref, setMapRef] = React.useState<google.maps.Map>();
  const [mapType, setMapType] = useState("hybrid");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFuncion, setShowFunction] = useState(true);
  const [zoom, setZoom] = useState<number|undefined>(3);

  const ref = createRef<HTMLDivElement>();

  const takeScreenShot = async (node: HTMLElement) => {
    const dataURI = await htmlToImage.toJpeg(node);
    return dataURI;
  };

  const download = (
    image: string,
    { name = "img", extension = "jpg" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    // base 64 here
    console.log(a.href);
    a.download = createFileName(extension, name);
    a.click();
  };

  const toogleFunctionModal = (state: boolean) => {
    setShowFunction(state);
  };

  const downloadScreenshot = () => {
    toogleFunctionModal(false);
    takeScreenShot(ref.current as HTMLElement).then(download);
    // toogleFunctionModal(true)
  };

  // Call setPath with new edited path
  const onEdit = useCallback(() => {
    if (polylineRef.current) {
      const nextPath = polylineRef.current
        .getPath()
        .getArray()
        .map((latLng) => latLng.toJSON());
      setPath(nextPath);
    }
  }, [setPath]);

  // Bind refs to current Polyline and listeners
  const onLoad = useCallback(
    (polyline: google.maps.Polyline) => {
      polylineRef.current = polyline;
      const path = polyline.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
      console.log(polyline);
    },
    [onEdit]
  );

  const handleOnLoad = (map: google.maps.Map) => {
    setMapRef(map);
  };

  const handleCenterChanged = () => {
    try {
      if (mapref) {
        // newCenter = mapref.getCenter();
        // let nl = newCenter.lat()
        // let nln = newCenter.lng()
        // setCenterLat(nl)
        // setCenterLng(nln)
        // console.log(newCenter.lat(), newCenter.lng());
      }
    } catch (error) {
      console.log(error, "aa");
    }
  };

  const findCenter = () => {
    try {
      if (mapref) {
        const newCenter = mapref.getCenter();
        const zoom = mapref.getZoom()
        if (newCenter?.lat() && newCenter?.lng()) {
          setCenterLat(newCenter.lat());
          setCenterLng(newCenter.lng());
          console.log(zoom)
          if(zoom && zoom>10 && zoom <16){
            console.log("xnzm")
            setPath([
              ...path,
              { lat: newCenter.lat(), lng: newCenter.lng() },
              { lat: newCenter.lat() - 0.1/zoom, lng: newCenter.lng() - 0.1/zoom },
            ]);
          }
          if(zoom && zoom<5){
            
            setPath([
              ...path,
              { lat: newCenter.lat(), lng: newCenter.lng() },
              { lat: newCenter.lat() - zoom, lng: newCenter.lng() - zoom },
            ]);
          }
          if(zoom && zoom>5&& zoom<10){
            
            setPath([
              ...path,
              { lat: newCenter.lat(), lng: newCenter.lng() },
              { lat: newCenter.lat() - 1/zoom, lng: newCenter.lng() - 1/zoom },
            ]);
          }
          if(zoom && zoom>16){
            
            setPath([
              ...path,
              { lat: newCenter.lat(), lng: newCenter.lng() },
              { lat: newCenter.lat() - 0.01/zoom, lng: newCenter.lng() - 0.01/zoom },
            ]);
          }
          }
      }
    } catch (error) {
      console.log(error, "aa");
    }
  };

  // Clean up refs
  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis) => lis.remove());
    polylineRef.current = null;
  }, []);

  const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
  };

  const showPath = () => {
    console.log(path); //What should be here to show the edited path if its possible to access?
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDN62f6t7YptfRccxFxRByRFg8fhs0Ggeo",
  });

  const options = {
    mapTypeControlOptions: {
      styles: [
        {
          featureType: "poi.business",
          elementType: "labels",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
      ],
      mapTypeIds: ["satellite"],
    },
    minZoom: 3,
    restriction:{
      latLngBounds:{
        east:90,
        west:90,
        north:90,
        south:90
      },
      strictBounds: true
    },
    mapTypeId: mapType,
  };

  function handleZoomChanged() {
    if (mapref) {
      setZoom(mapref.getZoom())
      console.log("zoom", mapref.getZoom());
    }
  }

  const centre = { lat: centerLat, lng: centerLng };
  console.log("The path state is", path);

  if (loadError) return <div>"Error loading Google Map"</div>;
  if (!isLoaded) return <div>"Loading Maps...."</div>;

  return (
    <div ref={ref}>
      <Fragment>
        <GoogleMap
          // onZoomChanged={handleZoomChanged}
          mapContainerStyle={mapContainerStyle}
          zoom={3}
          onLoad={handleOnLoad}
          onCenterChanged={handleCenterChanged}
          options={options}
          center={centre}
        >
          {showFuncion && (
            <FunctionModal
              downloadScreenshot={downloadScreenshot}
              isCompleted={isCompleted}
              setIsCompleted={setIsCompleted}
              setMapType={setMapType}
              findCenter={findCenter}
            />
          )}

          {path.length > 0 && (
            <Polyline
              ref={polylineRef as unknown as LegacyRef<Polyline>}
              path={path}
              options={{ editable: true, strokeColor: "#be03fc" }}
              // Event used when manipulating and adding points
              onMouseUp={onEdit}
              onLoad={onLoad}
              onUnmount={onUnmount}
            />
          )}
        </GoogleMap>
        <button onClick={downloadScreenshot}>Download screenshot</button>
        <button onClick={showPath}>Show Path in Console</button>
      </Fragment>
    </div>
  );
};

export default App;

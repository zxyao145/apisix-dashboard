import { RawRouteEditor } from "../../_components/raw-route-editor";

const RouteEditPage = ({ params }: { params: { rid: string } }) => {
  return <RawRouteEditor mode="edit" routeId={decodeURIComponent(params.rid)} />;
};

export default RouteEditPage;

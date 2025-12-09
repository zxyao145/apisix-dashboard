import { RawRouteEditor } from "../../_components/raw-route-editor";

const RouteDuplicatePage = ({ params }: { params: { rid: string } }) => {
  return <RawRouteEditor mode="duplicate" routeId={decodeURIComponent(params.rid)} />;
};

export default RouteDuplicatePage;

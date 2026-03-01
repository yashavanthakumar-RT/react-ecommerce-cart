import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <ClipLoader size={40}></ClipLoader>
    </div>
  );
};

export default Loader

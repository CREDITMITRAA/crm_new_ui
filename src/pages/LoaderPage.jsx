import Loader from "../components/common/loaders/Loader";

function LoaderPage() {
  console.log('loader page is mounted');
  
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
      <Loader size={50}/>
    </div>
  );
}

export default LoaderPage;

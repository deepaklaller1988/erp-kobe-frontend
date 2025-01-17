import { useNavigate } from "react-router-dom";

const Successmessage = () => {
  const router = useNavigate();

  const handleOk = () => {
    router("/");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <h1 className="text-4xl">账户激活成功</h1>
      <button
        className="text-xl font-bold px-10 py-3 rounded-xl border bg-black text-white hover:bg-black/70 mt-8 duration-300"
        onClick={handleOk}
      >
       好的
      </button>
    </div>
  );
};

export default Successmessage;

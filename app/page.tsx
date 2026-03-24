import Image from "next/image";
import Components from "./components/allCompo";

export default function Home() {
  return (
    <div className="flex min-h-screen mx-auto h-full  bg-zinc-50 font-sans ">
     <Components />
    </div>
  );
}

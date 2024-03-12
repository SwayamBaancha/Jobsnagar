import { useState } from "react";

const Sidebar = (props: any) => {
  //   const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <main
        className={
          " fixed overflow-clip z-50 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
          (props.isOpen
            ? " transition-opacity opacity-100 duration-500 -translate-x-0  "
            : " transition-all delay-500 opacity-0 -translate-x-full  ")
        }
      >
        <section
          className={
            " w-screen max-w-xs left-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
            (props.isOpen ? " -translate-x-0 " : " -translate-x-full ")
          }
        >
          {/* <article className="relative w-screen max-w-lg pb-10 flex flex-col space-y-6 overflow-y h-full"> */}
          <nav>
            <ul className="text-base p-5 text-center font-lg font-serif"></ul>
          </nav>
          {/* </article> */}
        </section>
        <section
          className=" w-screen h-full cursor-pointer "
          onClick={() => {
            props.onClose;
          }}
        >
          X
        </section>
      </main>
    </div>
  );
};

export default Sidebar;

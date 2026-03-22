import Sidebar from "./Sidebar";

function Layout({ children }) {

  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-60 w-full">
        {children}
      </div>

    </div>
  );
}

export default Layout;
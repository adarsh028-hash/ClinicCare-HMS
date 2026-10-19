import Sidebar from "./Sidebar";
import Header from "./Header"

function Layout({ children }) {

  return (
    <div className="flex">

      <Sidebar />
      <Header />


      <div className="ml-60 w-full">
        {children}
      </div>

    </div>
  );
}

export default Layout;
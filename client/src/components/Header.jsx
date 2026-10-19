import ProfileUI  from "./ProfileUI";


const Header = () => {
  return (
    <header className="
      fixed top-0 left-64 right-0 h-16
      bg-white/90 backdrop-blur-md
      border-b border-gray-200
      flex justify-between items-center
      px-6 z-40"
    >
      
      <div className="flex items-center gap-6">
        <h1 className="text-black font-semibold text-lg">
          Admin Panel
        </h1>
        
      </div>

      <div className="flex items-center gap-5">
        

        {/* <div className="w-px h-6 bg-white/40"></div> */}

        <div >
          <span>
            <ProfileUI />
          </span>
        </div>

      </div>

    </header>
  );
};

export default Header;


// components/Header.js
import Image from 'next/image';
import Link from 'next/link';
import Logo from "../../assets/images/Logo.svg"
const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Image src={Logo} alt="Logo" width={80} height={80} />
          {/* <span className="text-xl font-bold text-gray-800 ml-2">Your Logo</span> */}
        </div>
        <nav className="flex items-center space-x-4">
          <Link href="/">
            <span className="text-gray-800 hover:text-gray-600">Home</span>
          </Link>
          <Link href="/about">
            <span className="text-gray-800 hover:text-gray-600">About</span>
          </Link>
          <Link href="/contact">
            <span className="text-gray-800 hover:text-gray-600">Contact</span>
          </Link>
        </nav>
    
      </div>
    </header>
  );
};

export default Header;

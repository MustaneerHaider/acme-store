import Logo from './Logo'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-black py-10 font-quick text-white">
      <div className="mx-5 max-w-6xl lg:mx-auto">
        <div className="flex flex-col items-start pb-10 md:flex-row">
          <div className="flex cursor-pointer items-center space-x-2 self-start">
            <Logo className="h-10 w-10 transform rounded-full border duration-150 ease-out hover:scale-110" />
            <span className="font-quick font-bold text-white md:inline-flex">
              ACME
            </span>
          </div>

          <ul className="flex flex-col space-y-3 pt-8 md:pt-0 md:pl-28">
            <li className="hover:cursor-pointer hover:text-[#999] hover:underline">
              Home
            </li>
            <li className="hover:cursor-pointer hover:text-[#999] hover:underline">
              About
            </li>
            <li className="hover:cursor-pointer hover:text-[#999] hover:underline">
              Terms of use
            </li>
            <li className="hover:cursor-pointer hover:text-[#999] hover:underline">
              Shiping & Returns
            </li>
          </ul>

          <h4 className="pt-3 pb-10 hover:cursor-pointer hover:text-[#999] hover:underline md:pl-32 md:pt-0 md:pb-0">
            Privacy Policy
          </h4>

          <div className="flex items-center space-x-5 md:ml-auto md:flex-col md:space-y-5 md:space-x-0 ">
            <FaFacebook className="icon" />
            <FaInstagram className="icon" />
            <FaTwitter className="icon" />
          </div>
        </div>

        <hr className="border-t border-[#999]" />
        <div className="flex justify-between pt-8 text-sm md:text-base">
          <p className="hover:text-[#999]">
            &copy; 2022 ACME, Inc. All rights reserved.
          </p>

          <h3 className="hover:text-[#999]">
            Created by{' '}
            <span className="font-bold hover:underline">Mustaneer Haider</span>
          </h3>
        </div>
      </div>
    </footer>
  )
}

export default Footer

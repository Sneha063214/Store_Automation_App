import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-sky-100 py-3.5 px-4 md:px-8 text-xs text-gray-600 no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-center sm:text-left">
          <p className="font-medium text-gray-800">
            Developed &amp; Maintained By: <span className="font-semibold text-sky-700">SNEHA SHARMA  and  ADITYA KUMAR </span> &nbsp;CSE AIML A
          </p>
          <p className="text-[11px] text-gray-500 font-medium">
            Full Stack Development Team
          </p>
        </div>
        <div className="text-center sm:text-right text-[11px] text-gray-500 font-medium">
          &copy; 2026 ABESEC Ghaziabad. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

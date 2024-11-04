import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { MdClose } from 'react-icons/md';
import { BASE_URL, SideBarLinks } from '../../constants/constants';



function titleCase(str) {
  return str.split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}



export default function SlideOver({ open, setOpen, links }) {
  const [hasMatchingSubstring, setHasMatchingSubstring] = useState(false);

  useEffect(() => {
    const url = window.location.href;
    setHasMatchingSubstring(SideBarLinks.some(substring => url.includes(substring)));
  }, [])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden ">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex  max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-[300px]">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-white  hover:text-slate-200 focus:outline-none"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <MdClose className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col justify-between overflow-y-scroll w-full bg-[#ff375e] text-white py-6 shadow-xl px-4">
                    {
                      hasMatchingSubstring ?
                        <a
                          href="#"
                          target="_blank"
                          className="bg-purple font-medium text-white px-3 py-2 rounded-md"
                          onClick={(event) => {
                            event.preventDefault();  // Prevent default behavior
                            window.open(`http://localhost:3000/worklog/${window.location.pathname.split('/')[2]}`, '_blank'); // Open in new tab
                          }}
                        >
                          SLA Worklog
                        </a> :
                        "No Link added on this Page"
                    }


                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

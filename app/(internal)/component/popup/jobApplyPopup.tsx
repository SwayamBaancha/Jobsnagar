"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { JobConfirm } from "@/type/type";

export default function ConfirmJobApplication(props: JobConfirm) {
  const [checked, isChecked] = useState(false);

  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={props.closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Confirm your Action
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-black">{props.body}</p>
                  </div>

                  <p className="text-sm text-gray-500 border-2 border-gray-300 p-2 rounded-xl mt-2 ">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={checked}
                      onChange={() => isChecked(!checked)}
                    />
                    {props.checkboxText}
                  </p>

                  <div className="mt-4">
                    {/* {isChecked && (
                      <> */}
                    <button
                      type="button"
                      className="btn"
                      onClick={props.onFirstButtonClick}
                      disabled={!checked}
                    >
                      {props.firstButtonText}
                    </button>
                    {/* </>
                    )} */}
                    <button
                      type="button"
                      className="btn"
                      onClick={props.onSecondButtonClick}
                    >
                      {props.secondButtonText}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
